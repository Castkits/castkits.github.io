import { useEffect, useState } from 'react';
import type { Abi } from 'viem';
import { useNetwork } from './useNetwork';
import { useTransaction } from './useTransaction';
import { useWallet } from './useWallet';
import { useWalletContext } from '../context/WalletContext';
import { clampMinZero } from '../utils/bigint';

export interface UseMintConfig {
  contractAddress: `0x${string}`;
  abi: Abi;
  price: bigint;
  maxPerWallet?: number;
  requiredChainId?: number;
  encodeMintData?: (quantity: number) => `0x${string}`;
  readMintState?: () => Promise<{ remainingSupply: number | null; hasMinted: boolean }>;
}

/**
 * Headless mint helper that builds on the generic transaction state machine.
 */
export function useMint(config: UseMintConfig) {
  const { adapter } = useWalletContext();
  const { address, isConnected } = useWallet();
  const { chainId, isSupported } = useNetwork();
  const transaction = useTransaction();
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [remainingSupply, setRemainingSupply] = useState<number | null>(null);
  const [hasMinted, setHasMinted] = useState(false);

  useEffect(() => {
    if (!config.readMintState) {
      return;
    }

    void config.readMintState().then((result) => {
      setRemainingSupply(result.remainingSupply);
      setHasMinted(result.hasMinted);
    });
  }, [config]);

  useEffect(() => {
    if (!address || !isConnected) {
      setBalance(null);
      return;
    }

    void adapter.getBalance(address).then(setBalance);
  }, [adapter, address, isConnected, transaction.state]);

  const totalCost = config.price * BigInt(quantity);
  const rightChain = config.requiredChainId ? chainId === config.requiredChainId : isSupported;
  const enoughBalance = balance !== null && balance >= totalCost;
  const canMint =
    isConnected &&
    rightChain &&
    enoughBalance &&
    !hasMinted &&
    (remainingSupply === null || remainingSupply > 0);

  const mint = async (nextQuantity: number) => {
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      throw new Error('Mint quantity must be a positive integer.');
    }

    if (config.maxPerWallet && nextQuantity > config.maxPerWallet) {
      throw new Error(`Maximum mint quantity is ${config.maxPerWallet}.`);
    }

    const nextCost = clampMinZero(config.price * BigInt(nextQuantity));
    if (!isConnected) {
      throw new Error('Connect a wallet before minting.');
    }

    if (balance !== null && balance < nextCost) {
      throw new Error('Insufficient balance for this mint.');
    }

    setQuantity(nextQuantity);

    await transaction.send({
      to: config.contractAddress,
      value: nextCost,
      data: config.encodeMintData?.(nextQuantity) ?? '0x',
    });

    setHasMinted(true);

    if (remainingSupply !== null) {
      setRemainingSupply(Math.max(remainingSupply - nextQuantity, 0));
    }
  };

  return {
    mint,
    totalCost,
    remainingSupply,
    hasMinted,
    canMint,
    txState: transaction.state,
    hash: transaction.hash,
    error: transaction.error,
  };
}

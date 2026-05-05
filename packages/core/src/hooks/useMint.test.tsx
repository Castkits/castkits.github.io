import { act, renderHook, waitFor } from '@testing-library/react';
import { useMint } from './useMint';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useMint', () => {
  it('exposes a mintable state when balance is sufficient', () => {
    const adapter = new TestAdapter({ balance: '2' });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(
      () =>
        useMint({
          contractAddress: '0x1111111111111111111111111111111111111111',
          abi: [],
          price: 10000000000000000n,
        }),
      { wrapper },
    );

    expect(result.current.canMint).toBe(true);
  });

  it('updates transaction state after minting', async () => {
    const adapter = new TestAdapter({ balance: '2' });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(
      () =>
        useMint({
          contractAddress: '0x1111111111111111111111111111111111111111',
          abi: [],
          price: 10000000000000000n,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mint(1);
    });

    await waitFor(() => expect(result.current.txState).toBe('success'));
  });
});

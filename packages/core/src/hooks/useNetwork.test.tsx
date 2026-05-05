import { act, renderHook } from '@testing-library/react';
import { useNetwork } from './useNetwork';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useNetwork', () => {
  it('returns network metadata', () => {
    const adapter = new TestAdapter({ chainId: 1 });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter} config={{ allowedChains: [1, 8453] }}>
        {children}
      </TestProvider>
    );

    const { result } = renderHook(() => useNetwork(), { wrapper });
    expect(result.current.chainName).toBe('Ethereum');
    expect(result.current.isSupported).toBe(true);
  });

  it('switches chain', async () => {
    const adapter = new TestAdapter({ chainId: 1 });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(() => useNetwork(), { wrapper });
    await act(async () => {
      await result.current.switchChain(8453);
    });

    expect(result.current.chainId).toBe(8453);
  });
});


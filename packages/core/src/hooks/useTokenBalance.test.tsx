import { renderHook, waitFor } from '@testing-library/react';
import { useTokenBalance } from './useTokenBalance';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useTokenBalance', () => {
  it('loads token balances from the configured service', async () => {
    const adapter = new TestAdapter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider
        adapter={adapter}
        config={{
          services: {
            getTokenBalance: async () => ({
              balance: 1_500_000_000_000_000_000n,
              symbol: 'CAST',
              decimals: 18,
            }),
          },
        }}
      >
        {children}
      </TestProvider>
    );

    const { result } = renderHook(
      () => useTokenBalance({ tokenAddress: '0x1111111111111111111111111111111111111111' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.formatted).toBe('1.5'));
  });
});


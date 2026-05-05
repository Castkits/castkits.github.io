import { renderHook, waitFor } from '@testing-library/react';
import { useENS } from './useENS';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useENS', () => {
  it('resolves an ENS profile', async () => {
    const adapter = new TestAdapter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider
        adapter={adapter}
        config={{
          services: {
            resolveENS: async () => ({
              name: 'caster.eth',
              avatar: null,
            }),
          },
        }}
      >
        {children}
      </TestProvider>
    );

    const { result } = renderHook(() => useENS(), { wrapper });
    await waitFor(() => expect(result.current.name).toBe('caster.eth'));
  });
});


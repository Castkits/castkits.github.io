import { act, renderHook, waitFor } from '@testing-library/react';
import { useTransaction } from './useTransaction';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useTransaction', () => {
  it('completes a successful transaction', async () => {
    const adapter = new TestAdapter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(() => useTransaction(), { wrapper });
    await act(async () => {
      await result.current.send({ to: '0x1111111111111111111111111111111111111111' });
    });

    expect(result.current.state).toBe('success');
    expect(result.current.hash).not.toBeNull();
  });

  it('captures transaction errors', async () => {
    const adapter = new TestAdapter({ txBehavior: 'error' });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(() => useTransaction(), { wrapper });
    await expect(
      act(async () => {
        await result.current.send({ to: '0x1111111111111111111111111111111111111111' });
      }),
    ).rejects.toThrow('Transaction failed');

    await waitFor(() => expect(result.current.state).toBe('error'));
  });
});


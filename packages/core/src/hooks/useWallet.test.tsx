import { act, renderHook, waitFor } from '@testing-library/react';
import { useWallet } from './useWallet';
import { TestAdapter } from '../test/TestAdapter';
import { TestProvider } from '../test/TestProvider';

describe('useWallet', () => {
  it('connects a wallet', async () => {
    const adapter = new TestAdapter({ connected: false });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).not.toBeNull();
  });

  it('disconnects a wallet', async () => {
    const adapter = new TestAdapter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TestProvider adapter={adapter}>{children}</TestProvider>
    );

    const { result } = renderHook(() => useWallet(), { wrapper });
    await act(async () => {
      await result.current.disconnect();
    });

    await waitFor(() => expect(result.current.isDisconnected).toBe(true));
  });
});


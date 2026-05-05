import { MockAdapter } from './MockAdapter';

describe('MockAdapter', () => {
  it('starts connected with the connected preset', () => {
    const adapter = MockAdapter.presets.connected();
    expect(adapter.isConnected()).toBe(true);
    expect(adapter.getChainId()).toBe(1);
  });

  it('emits chain change events', async () => {
    const adapter = MockAdapter.presets.connected();
    const handler = vi.fn();

    adapter.on('chainChanged', handler);
    await adapter.switchChain(8453);

    expect(handler).toHaveBeenCalledWith(8453);
  });

  it('stores transaction history', async () => {
    const adapter = MockAdapter.presets.connected();
    const hash = await adapter.sendTransaction({
      to: '0x1111111111111111111111111111111111111111',
      value: 1n,
    });

    expect(hash).toMatch(/^0x/);
    expect(adapter.getHistory()).toHaveLength(1);
  });
});

import { Badge, MintPanel, WalletStatus } from '@castkit/ui';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
        <div className="space-y-5">
          <Badge>CastKit Demo</Badge>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">
            Cast your Web3 UI in minutes with a production-shaped mint flow.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            This example app uses the same provider, hook, and component surface you would ship in a
            real collection launch. Add a WalletConnect project ID to move from mock to live wallet
            connectivity.
          </p>
          <WalletStatus />
        </div>
        <MintPanel
          contractAddress="0x1111111111111111111111111111111111111111"
          title="Genesis Relay Pass"
          description="A dark-first mint panel for onboarding a Web3 audience without rebuilding wallet and transaction UX from scratch."
          price={0.05}
          maxSupply={5000}
          mintedCount={1824}
          maxPerWallet={3}
        />
      </section>
    </main>
  );
}


import * as React from 'react';

export function Playground({ code }: { code: string }) {
  return (
    <div style={{ marginTop: '1.5rem', overflow: 'hidden', borderRadius: 24, border: '1px solid rgba(124,58,237,0.3)' }}>
      <div style={{ borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '0.75rem 1rem', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
        MockAdapter Playground
      </div>
      <pre style={{ margin: 0, overflowX: 'auto', padding: '1rem 1.25rem' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

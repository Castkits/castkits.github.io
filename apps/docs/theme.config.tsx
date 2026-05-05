import * as React from 'react';
import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>CastKit</span>,
  project: {
    link: 'https://github.com/castkit/castkit',
  },
  docsRepositoryBase: 'https://github.com/castkit/castkit/tree/main/apps/docs',
  footer: {
    text: 'CastKit - Cast your Web3 UI in minutes.',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s - CastKit',
    };
  },
  primaryHue: 270,
  primarySaturation: 90,
};

export default config;


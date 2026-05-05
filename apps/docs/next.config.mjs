import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

export default withNextra({
  transpilePackages: ['@castkit/ui', '@castkit/core', '@castkit/adapter-mock'],
});


import type { Config } from 'tailwindcss';
import { castkitTailwindPreset } from '@castkit/ui';

export default {
  presets: [castkitTailwindPreset],
  darkMode: 'class',
  content: ['../../packages/ui/src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
} satisfies Config;


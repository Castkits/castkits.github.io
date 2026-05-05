import type { Config } from 'tailwindcss';
import { castkitTailwindPreset } from '@castkit/ui';

export default {
  presets: [castkitTailwindPreset],
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
} satisfies Config;


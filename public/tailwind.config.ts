import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './*.html',
    './main.ts'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config;
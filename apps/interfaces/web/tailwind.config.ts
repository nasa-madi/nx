import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    // colors:{
    //   // primary: '#5c6ac4',
    //   // secondary: '#ecc94b',
    //   // accent: '#4fd1c5',
    //   // neutral: '#f0f0f0',
    //   // info: '#3ABFF8',
    //   // success: '#32E875',
    //   // warning: '#FFD23F',
    //   // error: '#FB3862'
    // },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  daisyui: {},
  plugins: [require('postcss-import'), require('@tailwindcss/typography')]
}
export default config

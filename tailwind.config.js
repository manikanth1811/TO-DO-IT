/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/*.html','./dist/*.js','./src/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-dracula')(),
  ],
}


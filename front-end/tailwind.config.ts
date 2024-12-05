import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist:[
		"bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200", 
		"bg-gradient-to-b from-white to-blue-500" ,
    	"bg-gradient-to-r from-green-50 via-teal-100 to-blue-50" , 
		"bg-gradient-to-bl from-pink-50 via-red-100 to-yellow-50" ,
    	"bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50" , 
		"bg-gradient-to-tl from-yellow-100 via-orange-200 to-red-100" ,
    	'bg-black' , 
		'bg-white',
		'text-white'
	],
	theme: {
		extend: {
			colors: {
			primary: '#3D2645',
			secondary: '#832161',
			},
			fontFamily: {
			sans: ['Inter', 'sans-serif'],
			},
			fontSize : {
				sm:'10px',
				md:'14px',
				lg:'16px'
			}
		},
		keyframes: {
			"caret-blink": {
			"0%,70%,100%": { opacity: "1" },
			"20%,50%": { opacity: "0" },
			},
		},
		animation: {
			"caret-blink": "caret-blink 1.25s ease-out infinite",
		},
	},
	plugins: [
	require('tailwind-scrollbar-hide'),
	require('daisyui'),
	require('tailwind-scrollbar')
	],

};
export default config;

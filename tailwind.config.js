/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // gray 계열
        gray100: "#000000",
        gray90: "#1D1D1D",
        gray80: "#2D2D2D",
        gray70: "#555555",
        gray60: "#717171",
        gray50: "#8E8E8E",
        gray40: "#C6C6C6",
        gray30: "#D8D8D8",
        gray20: "#E4E4E4",
        gray10: "#F0F0F0",
        gray5: "#F8F8F8",
        gray1: "#FFFFFF",

        // Main 계열
        main900: "#152C4A",
        main800: "#1B3960",
        main700: "#234A7C",
        main600: "#2D5F9F",
        main500: "#3168AF",
        main400: "#5A86BF",
        main300: "#759AC9",
        main200: "#A0BADA",
        main100: "#BFD0E6",
        main50: "#EAF0F7",

        // Sub 계열
        sub50: "#ECEFF7",

        // Red 계열 (System Color)
        red900: "#640000",
        red800: "#830000",
        red700: "#A90000",
        red600: "#D90000",
        red500: "#EE0000",
        red400: "#F13333",
        red300: "#F45454",
        red200: "#F78A8A",
        red100: "#FAB0B0",
        red50: "#FDE6E6",

        // Yellow 계열 (System Color)
        yellow900: "#6B5900",
        yellow800: "#8C7500",
        yellow700: "#B59700",
        yellow600: "#E8C100",
        yellow500: "#FFD400",
        yellow400: "#FFDD33",
        yellow300: "#FFE254",
        yellow200: "#FFEBBA",
        yellow100: "#FFF2B0",
        yellow50: "#FFFBE6",

        // Green 계열 (System Color)
        green900: "#155615",
        green800: "#1C711C",
        green700: "#249224",
        green600: "#2EBB2E",
        green500: "#32CD32",
        green400: "#5BD75B",
        green300: "#76DE76",
        green200: "#A1E8A1",
        green100: "#BFF0BF",
        green50: "#EBFAEB",

        // Blue 계열 (System Color)
        blue900: "#0C216A",
        blue800: "#0F2B8B",
        blue700: "#1437B3",
        blue600: "#1947E5",
        blue500: "#1C4EFC",
        blue400: "#4971FD",
        blue300: "#6788FD",
        blue200: "#97AEFE",
        blue100: "#B9C8FE",
        blue50: "#E8EDFF",

        primary: "#152C4A",
        main: "#0C54B0",
        disabled: "#D8D8D8",

        white: "#FFFFFF",
      },
      fontSize: {
        sm: "13px",
        md: "15px",
        lg: "17px",
        xl: "19px",
        xxl: "21px",
        xxxl: "24px",
        subtitle: "32px",
        title: "40px",
      },
    },
  },
  plugins: [],
};

import { extendTheme } from "native-base";

export const THEME = extendTheme({
    colors: {
        primary: {
            700: '#996dff'
        },
        secondary: {
            700: '#fba94c'
        },
        green: {
            700: '#00875f',
            500: '#00b37e',
            300: '#04d361'
        },
        gray: {
            700: '#121214',
            600: '#202024',
            500: '#29292e',
            400: '#323238',
            300: '#7c7c8a',
            200: '#c4c4cc',
            100: '#e1e1e6'
        },
        yellow: {
            700: '#ffca00',
            500: '#ffcf52'
        },
        white: '#ffffff'
        
        // 700: '#',
        // 600: '#',
        // 500: '#',
        // 400: '#',
        // 300: '#',
        // 200: '#',
        // 100: '#'
    },
    fonts: {
        heading: 'Roboto_700Bold',
        body: 'Roboto_400Regular'
    },
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16, 
        lg: 20,
        xl: 24
    },
    sizes: {
        14: 56
    }
})
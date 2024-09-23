// Styles
import '@mdi/font/css/materialdesignicons.css'
import "vuetify/styles"
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme: {
        defaultTheme: "light",
        themes: {
            light: {
                colors: {
                    primary: "#2b4c81",
                    secondary: "#5CBBF6",
                    background: "#eef2f9",
                    danger: "#dc354580",
                    lightDanger: "#ff6e6e",
                    success: "#19875480"
                },
            },
        },
    },
});
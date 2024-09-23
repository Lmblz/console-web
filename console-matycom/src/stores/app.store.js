import { defineStore } from "pinia";
import { useSnackbarStore } from "@/stores/snackbar.store.js";
import * as AppService from "@/services/AppService";

export const useAppStore = defineStore('appStore', {
    state: () => (
        {
            user: {
                ad: "",
                name: "",
                role: "",
                color: "#fff",
                firstConnection: false,
                connectionDates: {
                    Hellobars: "",
                    HomePages: "",
                    DynamicPages: "",
                },
            }
        }
    ),

    actions: {
        // Retourne un ID unique
        getUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        },

        // Retourne les infos du user
        async getUser() {
            const user = await AppService.getUser();
            if (user.success) {
                this.user.ad = user.name;
                this.user.name = user.name.split("_")[1];
                this.user.color = this.getUserColor(this.user.ad);
            }

            this.user.firstConnection = AppService.isFirstConnection();

            return this.user;
        },

        // Retourne la couleur du user
        getUserColor(userName) {
            let hash = 0;
            userName.split('').forEach(char => {
                hash = char.charCodeAt(0) + ((hash << 5) - hash)
            })

            let color = '#'

            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xff
                color += value.toString(16).padStart(2, '0')
            }

            if (userName == "MATY\\DSI_TL") {
                color = '#000000'
            }

            return color
        },

        // Copie un texte dans le presse papier
        copyText(text) {
            const snackbarStore = useSnackbarStore();
            navigator.clipboard.writeText(text);
            snackbarStore.showSnackbar({
                message: "Le texte \"" + text + "\" a bien été copié dans votre presse-papier.",
                color: "primary",
                title: ""
            })
        },

        // Scrolle jusqu'à une section
        scrollToSectionById(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ block: "center", behavior: "smooth" })
        },

        // Initialisation de la date de connexion, permet de gérer d'éventuels conflits de version
        initializeConnectionDate(domain) {
            const datePart = AppService.getConnectionDate(domain);
            const dateObj = this.convertLocaleStringDateToMs(datePart);
            this.user.connectionDates[domain] = dateObj;
        },

        // Conversion d'une date au format DD/MM/AAAA HH:MM:SS en new Date().getTime()
        convertLocaleStringDateToMs(datePart) {
            const [date, time] = datePart.split(' ');
            const [day, month, year] = date.split('/');
            const formattedDateStr = `${year}-${month}-${day}T${time}`;
            const dateObj = new Date(formattedDateStr).getTime();
            return dateObj
        }
    }
})
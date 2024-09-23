import { defineStore } from "pinia";

export const useSnackbarStore = defineStore('snackbarStore', {
    state: () => (
        {
            show: false,
            title: "",
            color: "red",
            message: "",
            button: null,
            timeout: "5000"
        }
    ),

    actions: {
        // Construit la snackbar
        showSnackbar(params) {
            this.show = true;
            params.title ? this.title = params.title : this.title = "";
            params.color ? this.color = params.color : this.color = "";
            params.message ? this.message = params.message : this.message = "";
            params.button ? this.button = params.button : this.button = null;
            params.timeout ? this.timeout = params.timeout : this.timeout = "5000";
        },
    }
})
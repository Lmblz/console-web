import { useAppStore } from "@/stores/app.store.js";
import { useSnackbarStore } from "@/stores/snackbar.store.js";

// Retourne les informations remontées après connection avec l'AD
export async function getUser() {
    try {
        const response = await fetch("/navigation/getUser");

        if (response.ok) {
            const user = await response.json();
            return user;
        }

        throw new Error(response.statusText);
    } catch (e) {
        console.error(e);
        throw new Error(e);
    }
}

// Retourne boolean qui indique s'il s'agit de la première connexion de l'utilisateur
export function isFirstConnection() {
    const ls = localStorage.getItem('userAlreadyConnected');
    if (ls) {
        return false;
    }

    localStorage.setItem("userAlreadyConnected", "true");
    return true;
}

// Requête qui enregistre les logs à l'enregistrement 
export async function setEditLogs(domain, infos) {
    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();

    const user = appStore.user.ad;
    sessionStorage.removeItem("connectionDate" + domain);

    let url = "/navigation/PostUserLog?domain=" + domain + "&user=" + user;
    if (infos) url += "&infos=" + infos;

    try {
        const response = await fetch(url, { method: 'POST' });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    } catch (e) {
        console.error(e);

        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Un problème est servenu à l'enregistrement des logs : " + e
        })
    }
}

export function getConnectionDate(domain) {
    let date = new Date().toLocaleString();

    if (!sessionStorage.getItem("connectionDate" + domain)) {
        sessionStorage.setItem("connectionDate" + domain, date);
    }

    date = sessionStorage.getItem("connectionDate" + domain);
    return date;
}

export async function getLastModificationDate(domain) {
    try {
        const response = await fetch(`/navigation/GetUserLog?domain=${domain}`);

        if (response.ok) {
            let data = await response.json();
            const datePart = data[0].split(`${domain} `)[1];

            const [date, time] = datePart.split(' ');
            const [day, month, year] = date.split('/');
            const formattedDateStr = `${year}-${month}-${day}T${time}`;
            const dateObj = new Date(formattedDateStr).getTime();

            return dateObj;
        } else {
            throw new Error('Failed to fetch data');
        }

    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}
import { useHellobarsStore } from "@/stores/hellobars.store.js";
import { setEditLogs } from "@/services/AppService.js";

// Retourne la liste des hellobars
export async function getHelloBars() {
    const response = await fetch("/hellobar/Get");
    return response.json();
}

export function setEditedHellobarInSessionStorage(id, title) {
    const hellobarsStore = useHellobarsStore();
    hellobarsStore.addEditedHellobar(id, title);
}

// Enregistre les modifications
export async function saveHelloBars(json) {
    const hellobarsStore = useHellobarsStore();
    const arr = hellobarsStore.modificationArray;
    let logStr = "";

    if (arr.length > 0) {
        arr.forEach((hellobar, index) => {
            if (index > 0) {
                logStr += ", ";
            }

            logStr += "Id : " + hellobar.id + " - Titre : " + hellobar.title;
        })
    }

    try {
        const response = await fetch('/hellobar/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });

        if (response.ok) {
            setEditLogs("Hellobars", logStr);
            hellobarsStore.modificationArray = [];
            const data = await response.json();
            return data;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Erreur : ' + error);
        throw error;
    }
}

export function getLastVersion() {
    const hellobarsStore = useHellobarsStore();
    sessionStorage.removeItem("connectionDateHellobars");
    hellobarsStore.lastModificationDate = null;
    location.reload();
}
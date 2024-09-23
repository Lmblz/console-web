import { useAppStore } from "@/stores/app.store";
import { useDynamicpagesStore } from "@/stores/dynamicpages.store";
import { useSnackbarStore } from "@/stores/snackbar.store";
import { setEditLogs } from "./AppService";
import Section from "../data/Section";

// Retourne la liste des pages dynamiques
export async function getDynamicpages() {
    const snackbarStore = useSnackbarStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const ssGlobal = sessionStorage;
    const ss = JSON.parse(sessionStorage.getItem('dynamicpages'));

    // On regarde si la liste des pages dynamiques est dans le session storage
    if (ss) {
        // On vient boucler sur tout le contenu du session storage et on regarde si leur key est du format "Dynamicpage + nombre"
        // Pour attribuer les titres dans la liste
        for (const [key, value] of Object.entries(ssGlobal)) {
            if (/Dynamicpage\d+/.test(key)) {
                const page = JSON.parse(value);
                const title = page.title;
                ss.find(el => el.directory == page.directory).title = title;
            }
        }
        // Si oui, on récupère le contenu et on le met dans le store
        dynamicpagesStore.setDynamicpages(ss);
    } else {
        // Si non, grosse requête à l'API
        let response;

        try {
            response = await fetch("/dynamicpages/GetList");
            if (response.ok) {
                const data = await response.json();
                const dynamicpages = data.pages;

                // On vient boucler sur tout le contenu du session storage et on regarde si leur key est du format "Dynamicpage + nombre"
                // Pour attribuer les titres dans la liste
                for (const [key, value] of Object.entries(ssGlobal)) {
                    if (/Dynamicpage\d+/.test(key)) {
                        const page = JSON.parse(value);
                        const title = page.title;
                        dynamicpages.find(el => el.directory == page.directory).title = title;
                    }
                }

                dynamicpagesStore.setDynamicpages(dynamicpages);
                setDynamicpagesInSessionStorage(dynamicpages);
            } else {
                console.error(response.statusText);
                throw new Error(response.statusText)
            }

        } catch (error) {

            snackbarStore.showSnackbar({
                title: "Erreur",
                color: "error",
                message: "Un problème est servenu à la récupération des pages dynamiques"
            })

            console.error(error);
            throw error;
        }
    }

    return dynamicpagesStore.getDynamicpages();
}

// Retourne le contenu d'une page dynamique
export async function getDynamicpageToEdit(directoryId) {
    const snackbarStore = useSnackbarStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const ss = JSON.parse(sessionStorage.getItem("Dynamicpage" + directoryId));

    // On regarde si la page dynamique est dans le session storage
    if (ss) {
        // Si oui, on met son contenu dans le store
        dynamicpagesStore.setDynamicpageToEdit(ss)
    } else {
        // Si non, requête API
        try {
            const response = await fetch("/dynamicpages/GetPage?directoryId=" + directoryId);
            if (response.ok) {
                const data = await response.json();
                dynamicpagesStore.setDynamicpageToEdit(data)
            } else {
                console.error(response.statusText);
                throw new Error(response.statusText);
            }
        } catch (error) {
            snackbarStore.showSnackbar({
                title: "Erreur",
                color: "error",
                message: "Un problème est servenu à la récupération de la page dynamique"
            })

            console.error(error)
            throw (error);
        }
    }

    return dynamicpagesStore.getDynamicpageToEdit()
}

// Crée une nouvelle page dynamique
export async function createDynamicpage() {
    const snackbarStore = useSnackbarStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    try {
        const response = await fetch("/dynamicpages/CreatePage?newId=" + newId, { method: "POST" })

        if (response.ok) {
            const data = await response.json();
            dynamicpagesStore.setDynamicpages(data.pages);
            removeDynamicpagesFromSessionStorage();
            return
        } else {
            console.error(response.statusText);
            throw new Error(response.statusText);
        }

    } catch (error) {

        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Un problème est servenu à la création de la nouvelle page dynamique"
        })

        console.error(error);
        throw error;
    }
}

// Ajoute la liste des pages dynamiques au session storage
export function setDynamicpagesInSessionStorage(dynamicpages) {
    sessionStorage.setItem('dynamicpages', JSON.stringify(dynamicpages))
}

// Ajoute une page dynamique au session storage
export function setDynamicpageInSessionStorage(dynamicpage) {
    sessionStorage.setItem("Dynamicpage" + dynamicpage.directory, JSON.stringify(dynamicpage))
}

// Supprime la liste des pages dynamiques au session storage
export function removeDynamicpagesFromSessionStorage() {
    sessionStorage.removeItem("dynamicpages");
}

// Supprime toutes les pages dynamiques du session storage
function removeAllDynamicpageFromSessionStorage() {
    const ss = sessionStorage;

    // On vient boucler sur tout le contenu du session storage et on regarde si leur key est du format "Dynamicpage + nombre"
    for (const [key, value] of Object.entries(ss)) {
        if (/Dynamicpage\d+/.test(key)) {
            sessionStorage.removeItem(key);
        }
    }
}

// Annule toutes les modifications
export function cancelAllModifications() {
    const snackbarStore = useSnackbarStore();

    // On vire tout du session storage
    removeDynamicpagesFromSessionStorage();
    removeAllDynamicpageFromSessionStorage();

    //location.reload();

    snackbarStore.showSnackbar({
        title: "Annulation réussie",
        color: "success",
        message: "Toutes vos modifications ont bien été annulées"
    })
}

// Enregistre les pages modifiées
export async function saveDynamicpages() {
    const snackbarStore = useSnackbarStore();
    const arr = [];
    const ss = sessionStorage;
    let logStr = "";

    // On vient boucler sur tout le contenu du session storage et on regarde si leur key est du format "Dynamicpage + nombre"
    for (const [key, value] of Object.entries(ss)) {
        if (/Dynamicpage\d+/.test(key)) {

            // Si la key match, on l'ajoute au tableau
            arr.push(JSON.parse(value));
        }
    }

    // Si le tableau est vide, pas la peine d'enregistrer
    if (arr.length == 0) {
        snackbarStore.showSnackbar({
            title: "Aucune modification",
            color: "warning",
            message: "Vous n'avez aucune modification à enregistrer"
        })

        return
    }

    arr.forEach((dynamicpage, index) => {
        dynamicpage.content.forEach((section, index) => {
            // On force explicitement le type de section  sinon plante à la désérialization
            section.content.$type = new Section().get$Type(section.name);
        })

        // Formattage du log 
        if (index > 0) logStr += ", "
        logStr += "Dossier: " + dynamicpage.directory + " Titre: " + dynamicpage.title;
    })

    const jsonString = JSON.stringify(arr);

    try {
        const response = await fetch("/dynamicpages/SavePages", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Content-Length": jsonString.length.toString(),
                "X-Custom-Header": "ProcessThisImmediately"
            },
            body: jsonString
        })

        if (response.ok) {

            const data = await response.json();

            if (!data.isValid) throw new Error(data.errorMessage);

            cancelAllModifications();

            snackbarStore.showSnackbar({
                title: "Réussite de l'enregistrement",
                color: "success",
                message: "Rendez-vous sur la <a href='https://preprod.maty.com'>preprod</a> pour visualiser vos modifications et sur la <a href='http://console.maty.local/Script/Index/MeLDynamicPages' target='_blank'>console MATY</a> pour publier vos changements en production"
            })

            setEditLogs("DynamicPages", logStr);

        } else {
            console.error(response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Une erreur est survenue lors de l'enregistrement des modifications"
        })

        console.error(error);
        throw error
    }
}

export function getLastVersion() {
    const dynamicpagesStore = useDynamicpagesStore();
    sessionStorage.removeItem("connectionDateDynamicPages");
    removeAllDynamicpageFromSessionStorage();
    removeDynamicpagesFromSessionStorage();
    dynamicpagesStore.lastModificationDate = null;
    location.reload();
}

export async function getEditedPages() {
    const appStore = useAppStore();
    const dynamicpagesStore = useDynamicpagesStore();
    try {
        const response = await fetch(`/navigation/GetUserLog?domain=DynamicPages`);

        if (response.ok) {
            let data = await response.json();
            const arr = [];

            data.forEach(el => {
                const datePart = el.split(`DynamicPages `)[1];
                const [date, time] = datePart.split(' ');
                const [day, month, year] = date.split('/');
                const formattedDateStr = `${year}-${month}-${day}T${time}`;
                const dateObj = new Date(formattedDateStr).getTime();

                if (dateObj > appStore.user.connectionDates.DynamicPages) {
                    const obj = { date: "", data: [] };
                    obj.date = dateObj;
                    const dossierPattern = /Dossier: (\d+)/g;
                    let match;
                    while ((match = dossierPattern.exec(el)) !== null) {
                        obj.data.push(Number(match[1]));
                    }

                    arr.push(obj);
                }
            })

            dynamicpagesStore.lastModificationDate = new Date().getTime();
            sessionStorage.removeItem("connectionDateDynamicPages");

            return arr;        
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

export async function replaceEditedPages(data) {
    removeDynamicpagesFromSessionStorage();
    await getDynamicpages();
    const pages = [];

    data.forEach(el => {
        el.data.forEach(page => {
            if (pages.findIndex(el => el == page) == -1) pages.push({ dir: page, hasConflict: false });
        })
    })

    pages.forEach(page => {
        const ss = sessionStorage.getItem("Dynamicpage" + page.dir);
        if (ss) page.hasConflict = true;
    })

    return pages;
}
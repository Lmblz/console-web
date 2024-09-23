import { useHomepageStore } from "@/stores/homepage.store";

import { setEditLogs } from "@/services/AppService.js";

// Retourne la liste des homepages
export async function getHomepages() {
    const homepageStore = useHomepageStore();
    const ss = JSON.parse(sessionStorage.getItem('homepages'));

    // On regarde si le session storage contient les homepages
    if (ss) {
        // Si oui, on les met dans le store
        homepageStore.setHomepages(ss);
    } else {
        // Si non, big requête
        const response = await fetch("/homepage/Get");
        const homepages = await response.json();

        // Puis dans le store
        homepageStore.setHomepages(homepages);

        // Puis dans le session storage
        setHomepagesInSessionStorage(homepages);
    }

    return homepageStore.getHomepages();
}

// Enregistre les homepages
export async function saveHomepages(json) {
    let editedHomepages = getEditedHomepagesInSessionStorage();
    let logStr = "";

    if (editedHomepages) {
        editedHomepages = JSON.parse(editedHomepages);

        editedHomepages.forEach((homepage, index) => {
            if (index > 0) logStr += ", ";
            logStr += "Id : " + homepage.id + " - Titre : " + homepage.title;
        })
    }

    try {
        const response = await fetch('/homepage/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });

        if (response.ok) {
            removeHomepagesFromSessionStorage();
            removeEditedHomepagesFromSessionStorage();

            setEditLogs("HomePages", logStr);

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

// Enregistre les homepages dans le session storage
export function setHomepagesInSessionStorage(homepages) {
    sessionStorage.setItem('homepages', JSON.stringify(homepages));
}

// Vire les homepages du session storage
export function removeHomepagesFromSessionStorage() {
    sessionStorage.removeItem('homepages');
}

// Vire une homepage du session storage
export function removeHomepageToEditFromSessionStorage() {
    sessionStorage.removeItem("homepageToEdit");
}

// Enregistre une homepage dans le session storage
export function setHomepageToEditInSessionStorage(homepage) {
    sessionStorage.setItem('homepageToEdit', JSON.stringify(homepage));
}

// Retourne la homepage à éditer
export async function getHomepageToEdit(id) {
    const homepageStore = useHomepageStore();
    if (!id) {
        return {
            isValid: false,
            detail: "Aucun id fourni"
        }
    }

    const ss = JSON.parse(sessionStorage.getItem('homepageToEdit'));

    // On regarde si la home est déjà dans le store
    if (!homepageStore.getHomepageToEdit()) {
        // Si non on regarde dans le session storage
        if (ss && ss.id == id) {
            // Si oui on la met dans le store
            homepageStore.setHomepageToEdit(ss);
        } else {
            // Sinon big call
            let homepages = await getHomepages();
            const homepage = homepages.find(el => el.id == id)

            // Puis on enregistre dans le store
            homepageStore.setHomepageToEdit(homepage)

            // Puis dans le session storage
            sessionStorage.setItem('homepageToEdit', JSON.stringify(homepage))
        }
    }

    return homepageStore.getHomepageToEdit();
}

export function getLastVersion() {
    const homepageStore = useHomepageStore();
    sessionStorage.removeItem("connectionDateHomePages");
    homepageStore.lastModificationDate = null;
    removeHomepageToEditFromSessionStorage();
    removeHomepagesFromSessionStorage();
    removeEditedHomepagesFromSessionStorage();
    location.reload();
}

export function setEditedHomepageInSessionStorage(id, title) {
    const ss = getEditedHomepagesInSessionStorage();
    let arr = [];

    if (ss) {
        arr = JSON.parse(ss);
        const index = arr.findIndex(el => el.id == id);
        if (index != -1) arr.splice(index, 1);
    }

    const obj = {
        id: id,
        title: title,
    }

    arr.push(obj);

    sessionStorage.setItem("editedHomepages", JSON.stringify(arr));
}

function getEditedHomepagesInSessionStorage() {
    return sessionStorage.getItem("editedHomepages");
}

function removeEditedHomepagesFromSessionStorage() {
    sessionStorage.removeItem("editedHomepages");
}
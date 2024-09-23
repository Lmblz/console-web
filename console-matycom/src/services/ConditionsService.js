import { useConditionStore } from "@/stores/conditions.store";

import { setEditLogs } from "@/services/AppService.js";

import conditionsList from "@/data/conditionsList.json";
import Condition from "../data/Condition";

// Retourne la liste des conditions
export function getConditionsList() {
    const conditionStore = useConditionStore();

    // On regarde si les conditions sont déjà enregistrées dans le store
    if (!conditionStore.conditions) {
        // Si non, on vient les attribuer
        conditionStore.setConditions(conditionsList);
    }

    // Puis on les retourne
    return conditionsList;
}

// Retourne les différentes versions d'une condition
export async function getConditionItems(param) {
    const conditionStore = useConditionStore();
    const title = conditionsList.find(el => el.url == param).title;
    const ssName = getSSName(title);
    const ss = JSON.parse(sessionStorage.getItem('ConditionItems' + ssName));
    let conditionItems;

    // On regarde si les conditions sont déjà enregistrées dans le store
    if (!conditionStore.conditions) {
    // Si non, on vient les attribuer
        getConditionsList();
    }

    // On regarde si les éléments de la condition sont déjà dans le session storage
    if (ss) {
        // Si oui on les récupère
        conditionItems = ss;
    } else {
        // Si non, requête à l'API
        try {
            const response = await fetch("/conditions/GetList?condition_name=" + conditionsList.find(el => el.title == title).query);

            if (response.ok) {
                conditionItems = await response.json();
                sessionStorage.setItem('ConditionItems' + ssName, JSON.stringify(conditionItems));
            } else {
                console.error(response.statusText);
                throw new Error(response.statusText);
            }

        } catch (error) {
            console.error("Erreur lors de la récupération de la liste : " + error);
            throw error;
        }
    }

    // On vient attribuer les éléments dans le store
    conditionStore.setConditionItems(title, conditionItems);

    return {
        data: conditionStore.getConditionItems(title),
        isValid: true
    }
}

// Retourne une version d'une condition
export async function getCondition(param, id) {
    const conditionStore = useConditionStore();

    // On regarde si le store a les conditions
    if (conditionStore.conditions == null) {
        // Si non on les récupère
        await getConditionItems(param);
    }

    const title = conditionsList.find(el => el.url == param).title;

    // On récupère la version de la condition
    const condition = conditionStore.getCondition(title, id);

    return condition;
}

// Met les versions d'une condition dans le session storage
export function setConditionItemsInSS(conditionItems) {
    const ssName = getSSName(conditionItems.title);
    sessionStorage.setItem('ConditionItems' + ssName, JSON.stringify(conditionItems.items));
}

// Supprime les modifications apportées à une condition
export function cancelConditionModifications(title) {
    const ssName = "ConditionItems" + getSSName(title);
    sessionStorage.removeItem(ssName);
}

export function cancelAllConditionsModifications() {
    const ss = sessionStorage;

    // On vient boucler sur tout le contenu du session storage et on regarde si leur key est du format "Dynamicpage + nombre"
    for (const [key, value] of Object.entries(ss)) {
        if (key.includes("ConditionItems")) {
            sessionStorage.removeItem(key);
        }
    }
}

// Enregistre les modifications d'une condition
export async function saveConditionModifications(title, param) {
    const response = await getConditionItems(param);
    const items = response.data;
    const query = conditionsList.find(el => el.title == title).query;
    const ssName = "ConditionItems" + getSSName(title);

    try {
        const response = await fetch('/conditions/SaveCondition?condition_name=' + query, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        });

        if (response.ok) {
            sessionStorage.removeItem(ssName);
            getConditionItems(param);

            setEditLogs("Conditions", title);

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

// Ajoute une nouvelle version d'une condition
export function addConditionItem(title, param) {
    const conditionStore = useConditionStore();

    // Crée une condition
    const newCondition = new Condition(title);

    // L'ajoute dans le store et dans le session storage
    conditionStore.setConditionItem(title, newCondition);
    const ssName = "ConditionItems" + getSSName(title);
    const conditionItems = conditionStore.getConditionItems(title);
    sessionStorage.setItem(ssName, JSON.stringify(conditionItems));
    return newCondition.id;
}

// Retourne le nom formaté d'une condition dans le session storage
function getSSName(title) {
    return title.replaceAll(' ', '');
}

// Génération du pdf de la condition
export async function generatePdf(title) {
    const query = conditionsList.find(el => el.title == title).query;

    try {
        const response = await fetch('/conditions/GeneratePdf?condition_name=' + query, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "",
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(response.statusText);
        }

    } catch (e) {
        console.error('Erreur : ' + error);
        throw error;
    }
}

export function getLastVersion() {
    const conditionsStore = useConditionStore();
    sessionStorage.removeItem("connectionDateConditions");
    cancelAllConditionsModifications();
    conditionsStore.lastModificationDate = null;
    location.reload();
}
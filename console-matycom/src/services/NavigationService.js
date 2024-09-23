import { useSnackbarStore } from "@/stores/snackbar.store";
import { useNavigationStore } from "@/stores/navigation.store";

export async function getList() {
    const snackbarStore = useSnackbarStore();
    const navigationStore = useNavigationStore();

    try {
        const ss = getNavigationFromSessionStorage();

        if (ss) {
            navigationStore.setNavigationList(ss);
            return ss;
        }

        const storeList = navigationStore.getNavigationList();

        if (storeList.length > 0) {
            setNavigationInSessionStorage(storeList)
            return storeList;
        }

        const response = await fetch("/nav/getList");

        if (response.ok) {
            const data = await response.json();
            navigationStore.setNavigationList(data.items);
            setNavigationInSessionStorage(data.items)
            return data.items;
        }
    } catch (e) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Un problème est servenu à la récupération des éléments de navigation"
        })

        console.error(e);
    }
}

export async function getNavigation(id) {
    const snackbarStore = useSnackbarStore();
    const navigationStore = useNavigationStore();

    try {
        if (navigationStore.list.length == 0) await getList();
        const ss = getNavigationFromSessionStorage();

        if (ss) {
            const item = ss.find(el => el.id == id);

            if (item !== undefined && item.items !== undefined) {
                navigationStore.list.find(el => el.id == id).items = item.items;
                navigationStore.editNav = item;
                return item;
            }
        }

        const storeItem = navigationStore.list.find(el => el.id == id);

        if (storeItem && storeItem.items !== undefined) {
            navigationStore.editNav = storeItem;
            return storeItem;
        }

        const response = await fetch(`/nav/getNavigation?id=${id}`);

        if (response.ok) {
            const data = await response.json();

            if (data.isValid) {
                navigationStore.list.find(el => el.id == id).items = data.item.items;
                navigationStore.editNav = data.item;
                return data.item;
            }
        }

        throw new Error(data.errorMessage);
    } catch (e) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Un problème est servenu à la récupération des éléments de navigation"
        })

        console.error(e);
    }
}

export async function saveNavigation() {
    const snackbarStore = useSnackbarStore();
    const navigationStore = useNavigationStore();

    try {
        const nav = navigationStore.editNav;
        const itemIndex = navigationStore.list.findIndex(el => el.id == nav.id);

        if (itemIndex !== -1) {
            navigationStore.list[itemIndex] = nav;
        }
        setNavigationInSessionStorage(navigationStore.list);

        return true;

    } catch (e) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Une erreur s'est produite lors de la sauvegarde, veuillez contacter le développeur en charge de la console."
        })

        console.error(e);

        return false;
    }
}

export async function saveNavigationItem(editNav) {
    const snackbarStore = useSnackbarStore();
    const navigationStore = useNavigationStore();

    try {
        if (navigationStore.list.length == 0) await getList();
        navigationStore.setEditedNav(editNav);
        setNavigationInSessionStorage(navigationStore.getNavigationList())

        return true;

    } catch (e) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Une erreur s'est produite lors de la sauvegarde, veuillez contacter le développeur en charge de la console."
        })

        console.error(e);

        return false;
    }
}

export async function saveAllModifications() {
    const snackbarStore = useSnackbarStore();
    const navigationStore = useNavigationStore();

    try {
        const list = navigationStore.getNavigationList();
        list.forEach(el => {
            el.datePublish = new Date(el.datePublish).toJSON();
            el.dateDelete = new Date(el.dateDelete).toJSON();
        })

        const response = await fetch("/nav/SaveNavigation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        });

        if (response.ok) {
            const data = await response.json();

            if (data.isValid) {
                snackbarStore.showSnackbar({
                    title: "Réussite de l'enregistrement",
                    color: "success",
                    message: "Rendez-vous sur la <a href='https://preprod.maty.com'>preprod</a> pour visualiser vos modifications et sur la <a href='http://console.maty.local/Script/Index/MeLHomepagesFull' target='_blank'>console MATY</a> pour publier vos changements en production"
                })

                removeNavigationFromSessionStorage();

                return;
            }
        }

        throw new Error(data.errorMessage);
    } catch (e) {
        snackbarStore.showSnackbar({
            title: "Erreur",
            color: "error",
            message: "Une erreur s'est produite lors de la sauvegarde, veuillez contacter le développeur en charge de la console."
        });

        console.error(e);
    }
}

export function cancelAllModifications() {
    const navigationStore = useNavigationStore();
    navigationStore.resetList();
    removeNavigationFromSessionStorage();
}

export function setNavigationInSessionStorage(data) {
    sessionStorage.setItem("navigation", JSON.stringify(data));
}

function getNavigationFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem("navigation"));
}

function removeNavigationFromSessionStorage() {
    sessionStorage.removeItem("navigation");
}
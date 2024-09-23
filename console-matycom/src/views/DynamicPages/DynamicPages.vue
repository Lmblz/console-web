<template>
    <search-add placeholder="Rechercher une page dynamique" titleAdd="Ajoute une page dynamique vide"
                contentAdd="Ajouter une page dynamique" @searchBtn="searchDynamicpage($event)" @resetBtn="searchDynamicpage({ search: '' })"
                @addBtn="addDynamicpage" />

    <div class="dynamicpages pa-2">
        <v-card class="mb-5 pb-1" :elevation="3">
            <v-card-title class="pb-0">
                Pages dynamiques
            </v-card-title>
            <v-data-table :headers="headers" :items="dynamicpagesArray" :disable-sort="true" style="overflow-x: auto"
                          :loading="dynamicpagesLoading" no-data-text="Aucune page dynamique" :items-per-page="15"
                          density="comfortable" items-per-page-text="Nombre d'éléments à afficher"
                          :hover="true">

                <template #item.title="{ item }">
                    <p data-column="title">{{ item.title }}</p>
                </template>

                <template #item.datePublish="{ item }">
                    <p>{{ new Date(item.datePublish).toLocaleString() }}</p>
                </template>

                <template #item.actions="{ item }">
                    <v-row class="ma-0 ga-1">
                        <action-button icon="mdi-pen" color="primary" @click="editDynamicpage(item.directory)" />
                        <action-button icon="mdi-eye" color="primary" variant="outlined" @click="previewDynamicpage(item.directory)" />
                    </v-row>
                </template>

            </v-data-table>
        </v-card>
    </div>

    <bottom-menu :items="bottomMenuItems" @cancelEvent="cancelAllModifications" @saveEvent="saveAllModifications" />
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";

    import SearchAdd from "../../components/common/search-add/SearchAdd.vue";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import ActionButton from "../../components/common/data-table/ActionButton.vue";

    import Homepage from "../../data/Homepage.js";
    import Section from "../../data/Section.js";

    import { getLastModificationDate } from "@/services/AppService.js";
    import * as DynamicpagesService from "@/services/DynamicpagesService";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store";
    import { useSnackbarStore } from "@/stores/snackbar.store";
    import { useAppStore } from "@/stores/app.store.js";

    const router = useRouter();

    const snackbarStore = useSnackbarStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const appStore = useAppStore();

    const bottomMenuItems = [
        {
            text: "Annuler toutes les modifications",
            variant: "plain",
            color: "danger",
            emit: "cancelEvent"
        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveEvent"
        }
    ];
    const headers = [
        {
            title: "Titre",
            key: "title",
            width: "50%",
        },
        {
            title: "N°",
            key: "directory",
            width: "25%"
        },
        {
            title: "Actions",
            key: "actions",
            width: "25%",
        },
    ];
    const dynamicpagesLoading = ref(false);
    const dynamicpages = ref([]);
    const dynamicpagesArray = ref([])

    onMounted(async () => {
        // On initialise la date de connexion
        appStore.initializeConnectionDate("DynamicPages");

        // Récupère la dernière date de modification
        dynamicpagesStore.lastModificationDate = await getLastModificationDate("DynamicPages");

        if (dynamicpagesStore.lastModificationDate > appStore.user.connectionDates["DynamicPages"]) {
            const pagesEdited = await DynamicpagesService.getEditedPages();

            if (pagesEdited && pagesEdited.length > 0) {
                const response = await DynamicpagesService.replaceEditedPages(pagesEdited);

                if (response.find(el => el.hasConflict == true)) {
                    const conflictPages = [];
                    let conflictString = ''
                    response.forEach(page => {
                        if (page.hasConflict) conflictPages.push(page.dir);
                    })

                    conflictPages.forEach((page, index) => {
                        if (index == 0) conflictString += page;
                        if (index !== 0 && index !== conflictString.length - 1) conflictString += ", " + page;
                        if (index == conflictString.length - 1) conflictString += " et " + page;
                    })

                    snackbarStore.showSnackbar({
                        title: "Conflit de version",
                        color: "warning",
                        message: `
                            Attention, votre version n'est pas à jour, une nouvelle version a été publiée à ${new Date(dynamicpagesStore.lastModificationDate).toLocaleTimeString()}
                            et votre session a démarré à ${new Date(appStore.user.connectionDates["DynamicPages"]).toLocaleTimeString()}.<br/>
                            ${conflictPages.length > 1 ? 'Les pages concernées sont les suivantes' : 'La page concernée est la suivante'} : <b>${conflictString}</b>, 
                            cliquez sur ce bouton pour perdre vos modifications et récupérer les pages. Vous pouvez aussi ignorer ce message et écraser les dernières modifications publiées.`,
                        button: {
                            text: "Récupérer les pages en conflit",
                            action: () => DynamicpagesService.getLastVersion()
                        },
                        timeout: "-1"
                    })
                }
            }
        }

        // Récupère la dernière date de modification
        dynamicpagesStore.lastModificationDate = await getLastModificationDate("DynamicPages");

        const response = await DynamicpagesService.getDynamicpages();
        dynamicpages.value = response;
        dynamicpagesArray.value = dynamicpages.value;
    })

    async function addDynamicpage() {
        await DynamicpagesService.createDynamicpage();
        dynamicpages.value = await DynamicpagesService.getDynamicpages();
        dynamicpagesArray.value = dynamicpages.value;
    }

    function editDynamicpage(directory) {
        router.push({ name: "DynamicPage", params: { directoryId: directory } })
    }

    function previewDynamicpage(directory) {
        window.open("https://preprod.maty.com/dynamicpage?id=" + directory, "_blank")
    }

    async function cancelAllModifications() {
        DynamicpagesService.cancelAllModifications();
        dynamicpages.value = await DynamicpagesService.getDynamicpages();
    }

    async function saveAllModifications() {
        DynamicpagesService.saveDynamicpages();
        dynamicpages.value = await DynamicpagesService.getDynamicpages();
    }

    function searchDynamicpage(event) {
        const search = event.search.toLowerCase().split(' ');
        const filteredDynamicpages = [];

        dynamicpages.value.forEach((dynamicpage) => {
            search.forEach((word) => {
                if (dynamicpage.title.toLowerCase().includes(word)) filteredDynamicpages.push(dynamicpage);
            })
        })

        dynamicpagesArray.value = filteredDynamicpages;
    }
</script>
<template>
    <search-add placeholder="Rechercher une navigation" titleAdd="Ajoute une navigation vide"
                contentAdd="Ajouter une navigation" @searchBtn="searchNavigation($event)" @resetBtn="searchNavigation({ search: '' })"
                @addBtn="addNavigation" />

    <div class="navigation pa-2">
        <slot v-for="array in navigationsPublicationArrays" :key="array.content.value">
            <v-card class="mb-5 pb-1" :elevation="3" v-if="array.content.length > 0">
                <v-card-title class="pb-0">
                    {{ array.title }}
                </v-card-title>
                <v-data-table :headers="headers" :items="array.content" :disable-sort="true" style="overflow-x: auto"
                              no-data-text="Aucune homepage" :items-per-page="10"
                              density="comfortable" :hide-default-footer="array.content.length < 10" items-per-page-text="Nombre d'éléments à afficher"
                              :hover="true">

                    <template #item.title="{ item }">
                        <div :style="{ width: '400px' }"><p data-column="title">{{ item.title }}</p></div>
                    </template>

                    <template #item.datePublish="{ item }">
                        <div :style="{ width: '200px' }"><p>{{ new Date(item.datePublish).toLocaleString() }}</p></div>
                    </template>

                    <template #item.actions="{ item }">
                        <div :style="{ width: '150px' }">
                            <v-row class="ma-0 ga-1">
                                <action-button icon="mdi-pen" color="primary" @click="editNavigation(item.id)" />
                                <action-button icon="mdi-content-duplicate" color="success" @click="cloneNavigation(item)" />
                                <action-button icon="mdi-trash-can-outline" color="danger" @click="deleteNavigation(item.id)" />
                                <action-button icon="mdi-eye" color="primary" variant="outlined" @click="previewNavigation(item)" v-if="array.value !== 'old'" />
                            </v-row>
                        </div>
                    </template>

                </v-data-table>
            </v-card>
        </slot>
    </div>

    <bottom-menu :items="bottomMenuItems" @saveNavigationEvent="saveAllModifications" @cancelNavigationEvent="cancelAllModifications" />
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import * as NavigationService from "@/services/NavigationService.js";
    import { useNavigationStore } from "@/stores/navigation.store.js";

    import SearchAdd from "../../components/common/search-add/SearchAdd.vue";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import ActionButton from "../../components/common/data-table/ActionButton.vue";

    import Navigation from "@/data/navigation.js";

    const router = useRouter();
    const route = useRoute();

    const navigationItems = ref([]);
    const navigationStore = useNavigationStore();

    const headers = [
        {
            title: "Titre",
            key: "title",
            width: "400px",
        },
        {
            title: "Date de publication",
            key: "datePublish",
            width: "200px",
        },
        {
            title: "Actions",
            key: "actions",
            width: "150px",
        },
    ];

    const navigationsPublicationArrays = ref([
        {
            title: "Navigation en cours",
            value: "now",
            content: []
        },
        {
            title: "Navigations futures",
            value: "next",
            content: []
        },

        {
            title: "Navigations passées",
            value: "old",
            content: []
        }
    ]);

    const bottomMenuItems = [
        {
            text: "Annuler les modifications non enregistrées",
            variant: "plain",
            color: "danger",
            emit: "cancelNavigationEvent",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveNavigationEvent",
            icon: "mdi-content-save"

        }
    ];

    onMounted(async () => {
        navigationItems.value = await NavigationService.getList();
        addNavigationsInPublicationArrays(navigationItems.value);
    })

    function editNavigation(id) {
        router.push("/navigation/" + id)
    }

    function addNavigationsInPublicationArrays(source) {
        //homepagesLoading.value = true;

        // On vide les tableaux de publication
        navigationsPublicationArrays.value.forEach(array => array.content = []);

        // Puis on les remplie à partir de la source passée en paramètre
        if (source.length > 0) {
            source.sort((a, b) => new Date(b.datePublish) - new Date(a.datePublish));
            let dateDelete;

            source.forEach((navigation, index) => {
                if (index == 0) {
                    navigation.dateDelete = new Date("2099/12/31 23:59:59").toISOString();
                    dateDelete = navigation.datePublish;
                } else {
                    navigation.dateDelete = dateDelete;
                    dateDelete = navigation.datePublish;
                }

                const d = new Date();
                const publication = {
                    datePublish: new Date(navigation.datePublish),
                    dateDelete: new Date(navigation.dateDelete),
                }

                if (publication.datePublish > d) {
                    // Navigations futures
                    navigationsPublicationArrays.value.find(el => el.value === "next").content.push(navigation);
                } else if (publication.dateDelete < d) {
                    // Navigations passées
                    navigationsPublicationArrays.value.find(el => el.value === "old").content.push(navigation);
                } else if (publication.datePublish < d && publication.dateDelete > d) {
                    // Navigations en cours
                    navigationsPublicationArrays.value.find(el => el.value === "now").content.push(navigation);
                } else {
                    console.error("Problème d'ajout de la navigation: " + navigation);
                }
            })
        }

        //homepagesLoading.value = false;
    }

    async function saveAllModifications() {
        NavigationService.saveAllModifications();
    }

    function cancelAllModifications() {
        NavigationService.cancelAllModifications();
        location.reload();
    }

    function addNavigation() {
        const dt = new Date();
        const now = new Date();
        const newNav = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            title: "Nouvelle navigation",
            items: [
                    new Navigation()
            ],
            datePublish: new Date(dt.setDate(now.getDate() + 1)).toISOString().slice(0, 19) + "Z",
            dateDelete: new Date(dt.setDate(now.getDate() + 2)).toISOString().slice(0, 19) + "Z"
        }

        navigationStore.addNewNavigation(newNav);
        NavigationService.setNavigationInSessionStorage(navigationStore.list);
        addNavigationsInPublicationArrays(navigationItems.value);
    }

    async function cloneNavigation(oldNav) {
        const dt = new Date();
        const now = new Date();

        const newNav = JSON.parse(JSON.stringify(oldNav));
        newNav.title += " - copie";
        newNav.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        newNav.datePublish = new Date(dt.setDate(now.getDate() + 1)).toISOString().slice(0, 19) + "Z";

        let items = oldNav.items;

        if (items == undefined) {
            const nav = await NavigationService.getNavigation(oldNav.id);
            items = nav.items;
        }

        newNav.items = items;
        
        navigationStore.list.push(newNav);
        NavigationService.setNavigationInSessionStorage(navigationStore.list);
        addNavigationsInPublicationArrays(navigationItems.value);
    }

    function deleteNavigation(id) {
        const itemIndex = navigationStore.list.findIndex(el => el.id == id);
        if (itemIndex != -1) {
            navigationStore.list.splice(itemIndex, 1);
        }

        NavigationService.setNavigationInSessionStorage(navigationStore.list);
        addNavigationsInPublicationArrays(navigationItems.value);
    }

    function previewNavigation(item) {
        const date = new Date(item.datePublish);
        // On fait la preview à seconde + 1 car si on preview au moment du changement ça tombe en erreur
        const ss = date.getSeconds() + 1;
        let matyUrl;
        window.location.origin == "https://consoleweb.maty.com"
            ? matyUrl = "https://preprod.maty.com"
            : matyUrl = "https://dev.maty.com";

        window.open(matyUrl + "/?dtconsult=" + new Date(date.setSeconds(ss)).toLocaleString(), '_blank');
    }
</script>
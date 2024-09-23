<template>
    <search-add placeholder="Rechercher une homepage" titleAdd="Ajoute une homepage vide"
                contentAdd="Ajouter une homepage" @searchBtn="searchHomepages($event)" @resetBtn="searchHomepages({ search: '' })"
                @addBtn="addHomepage" />

    <div class="homepages pa-2">
        <slot v-for="array in homepagesPublicationArrays" :key="array.value">
            <v-card class="mb-5 pb-1" :elevation="3" v-if="array.content.length > 0">
                <v-card-title class="pb-0">
                    {{ array.title }}
                </v-card-title>
                <v-data-table :headers="headers" :items="array.content" :disable-sort="true" style="overflow-x: auto"
                              :loading="homepagesLoading" no-data-text="Aucune homepage" :items-per-page="10"
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
                                <action-button icon="mdi-pen" color="primary" @click="editHomepage(item.id)" />
                                <action-button icon="mdi-content-duplicate" color="success" @click="cloneHomepage(item.id)" />
                                <action-button icon="mdi-trash-can-outline" color="danger" @click="deleteHomepage(item.id)" />
                                <action-button icon="mdi-eye" color="primary" variant="outlined" @click="previewHomepage(item)" v-if="array.value !== 'old'" />
                            </v-row>
                        </div>
                    </template>

                </v-data-table>
            </v-card>
        </slot>
    </div>

    <bottom-menu :items="bottomMenuItems" @cancelHomepagesEvent="cancelAllModifications" @saveHomepagesEvent="saveAllModifications" />
</template>

<script setup>
    import SearchAdd from "../../components/common/search-add/SearchAdd.vue";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import ActionButton from "../../components/common/data-table/ActionButton.vue";

    import Homepage from "../../data/Homepage.js";
    import Section from "../../data/Section.js";

    import { getLastModificationDate } from "@/services/AppService.js";
    import * as HomepagesService from "@/services/HomepagesService.js";
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useAppStore } from "@/stores/app.store.js";

    const router = useRouter();
    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const appStore = useAppStore();

    const homepages = ref([]);
    const homepagesLoading = ref(false);
    const homepagesPublicationArrays = ref([
        {
            title: "Homepages en cours",
            value: "now",
            content: []
        },
        {
            title: "Homepages futures",
            value: "next",
            content: []
        },

        {
            title: "Homepages passées",
            value: "old",
            content: []
        }
    ])
    const bottomMenuItems = [
        {
            text: "Annuler toutes les modifications",
            variant: "plain",
            color: "danger",
            emit: "cancelHomepagesEvent"
        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveHomepagesEvent"
        }
    ];
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

    onMounted(async () => {
        // On initialise la date de connexion
        appStore.initializeConnectionDate("HomePages");

        // Récupère la dernière date de modification
        homepageStore.lastModificationDate = await getLastModificationDate("HomePages");

        if (homepageStore.lastModificationDate > appStore.user.connectionDates["HomePages"]) {
            snackbarStore.showSnackbar({
                title: "Conflit de version",
                color: "warning",
                message: `
                    Attention, votre version n'est pas à jour, une nouvelle version a été publiée à 
                    ${new Date(homepageStore.lastModificationDate).toLocaleTimeString()} 
                    et votre session a démarré à ${new Date(appStore.user.connectionDates["HomePages"]).toLocaleTimeString()}
                `,
                button: {
                    text: "Récupérer la dernière version",
                    action: () => HomepagesService.getLastVersion()
                }
            })
        }

        homepagesLoading.value = true;

        // On vire une éventuelle homepage modifiée du session storage pour éviter tout conflit
        HomepagesService.removeHomepageToEditFromSessionStorage();

        // On récupère la liste des homes dans un tableau global
        homepages.value = await HomepagesService.getHomepages();
        // Qu'on vient trier dans les tableaux de publication
        addHomepagesInPublicationArrays(homepages.value);

        homepagesLoading.value = false;
    })

    function addHomepagesInPublicationArrays(source) {
        homepagesLoading.value = true;

        // On vide les tableaux de publication
        homepagesPublicationArrays.value.forEach(array => array.content = []);

        // Puis on les remplie à partir de la source passée en paramètre
        if (source.length > 0) {
            source.sort((a, b) => new Date(b.datePublish) - new Date(a.datePublish));
            let dateDelete;

            source.forEach((homepage, index) => {
                if (index == 0) {
                    homepage.dateDelete = new Date("2099/12/31 23:59:59").toISOString();
                    dateDelete = homepage.datePublish;
                } else {
                    homepage.dateDelete = dateDelete;
                    dateDelete = homepage.datePublish;
                }

                const d = new Date();
                const publication = {
                    datePublish: new Date(homepage.datePublish),
                    dateDelete: new Date(homepage.dateDelete),
                }

                if (publication.datePublish > d) {
                    // Homepages futures
                    homepagesPublicationArrays.value.find(el => el.value === "next").content.push(homepage);
                } else if (publication.dateDelete < d) {
                    // Homepages passées
                    homepagesPublicationArrays.value.find(el => el.value === "old").content.push(homepage);
                } else if (publication.datePublish < d && publication.dateDelete > d) {
                    // Homepages en cours
                    homepagesPublicationArrays.value.find(el => el.value === "now").content.push(homepage);
                } else {
                    console.error("Problème d'ajout de la homepage: " + homepage);
                }
            })
        }

        homepagesLoading.value = false;
    }

    function addHomepage() {
        // On vient ajouter une nouvelle home au tableau global qu'on trie dans les tableaux de publication
        const newHomepage = new Homepage({});
        homepages.value.push(newHomepage);
        addHomepagesInPublicationArrays(homepages.value);

        // On ajoute le tableau global au session storage
        HomepagesService.setHomepagesInSessionStorage(homepages.value);
    }

    function deleteHomepage(id) {
        // On vient supprimer la home du tableau global qu'on trie dans les tableaux de publication
        const homepageIndex = homepages.value.findIndex(el => el.id == id);
        homepages.value.splice(homepageIndex, 1);
        addHomepagesInPublicationArrays(homepages.value);

        // On ajoute le tableau global au session storage
        HomepagesService.setHomepagesInSessionStorage(homepages.value);
    }

    function cloneHomepage(id) {
        const homepage = homepages.value.find(el => el.id == id);
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(d.getHours() + 2);

        const homepageConstructor = {
            title: homepage.title + " - Copie",
            content: homepage.content,
            datePublish: d.toISOString().slice(0, 16)
        }

        // On vient ajouter une nouvelle home au tableau global qu'on trie dans les tableaux de publication
        const newHomepage = new Homepage(homepageConstructor);
        homepages.value.push(newHomepage);
        addHomepagesInPublicationArrays(homepages.value);

        // On ajoute le tableau global au session storage
        HomepagesService.setHomepagesInSessionStorage(homepages.value);
    }

    function editHomepage(id) {
        // On stock la homepage à modifier dans le store (qui renvoie dans le session storage) et on redirige le user
        const homepage = homepages.value.find(el => el.id == id);
        homepageStore.setHomepageToEdit(homepage);
        router.push("/homepage/" + id);
    }

    function previewHomepage(item) {
        const date = new Date(item.datePublish);
        // On fait la preview à seconde + 1 car si on preview au moment du changement ça tombe en erreur
        const ss = date.getSeconds() + 1;
        window.open("https://preprod.maty.com/?dtconsult=" + new Date(date.setSeconds(ss)).toLocaleString(), '_blank');
    }

    function searchHomepages(event) {
        // On récupère la recherche et on split sur les espaces
        const search = event.search.toLowerCase().split(' ');
        // On initialise un tableau vide
        const filteredHomepages = [];

        homepages.value.forEach((homepage) => {
            search.forEach((word) => {
                // Si le titre de la homepage contient un des mots de la recherche et n'est pas déjà présente dans le tableau, on l'y ajoute
                if (homepage.title.toLowerCase().includes(word) && filteredHomepages.findIndex(el => el.id == homepage.id) == -1) filteredHomepages.push(homepage);
            })
        })

        // On ajoute les homepages filtrées dans les tableaux de publication
        addHomepagesInPublicationArrays(filteredHomepages);
    }

    function cancelAllModifications() {
        homepagesLoading.value = true;
        HomepagesService.removeHomepagesFromSessionStorage();
        location.reload();
    }

    async function saveAllModifications() {
        homepagesLoading.value = true;

        homepages.value.forEach((homepage) => {
            homepage.content.forEach((section, index) => {
                // On force explicitement le type de section  sinon plante à la désérialization
                section.content.$type = new Section().get$Type(section.name);
            })
        })

        const homepagesString = JSON.stringify(homepages.value);
        try {
            const response = await HomepagesService.saveHomepages(homepagesString);
            if (response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Réussite de l'enregistrement",
                    color: "success",
                    message: "Rendez-vous sur la <a href='https://preprod.maty.com'>preprod</a> pour visualiser vos modifications et sur la <a href='http://console.maty.local/Script/Index/MeLHomepagesFull' target='_blank'>console MATY</a> pour publier vos changements en production"
                })
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            snackbarStore.showSnackbar({
                title: "Erreur",
                color: "error",
                message: "L'enregistrement des hellobars à échoué : <br/>" + error
            })
        }

        homepagesLoading.value = false;
    }
</script>
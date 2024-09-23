<template>
    <SearchAdd placeholder="Rechercher une hello bar" titleAdd="Ajoute une hello bar vide"
               contentAdd="Ajouter une hello bar" @searchBtn="searchHellobars($event)" @resetBtn="searchHellobars({ search: '' })"
               @addBtn="addHellobar" />

    <div class="hellobars pa-2">
        <slot v-for="array in hellobarsPublicationArrays" :key="array.value">
            <v-card class="mb-5 pb-1" :elevation="3" v-if="array.content.length > 0">
                <v-card-title class="pb-0">
                    {{ array.title }}
                </v-card-title>
                <v-data-table class="table-with-scroll" :headers="headers" :items="array.content" :disable-sort="true" style="overflow-x: auto"
                              :loading="hellobarsLoading" no-data-text="Aucune hellobar" :items-per-page="10"
                              density="comfortable" :hide-default-footer="array.content.length < 10" items-per-page-text="Nombre d'éléments à afficher"
                              :hover="true" fixed-header>

                    <template #item.title="{ item }">
                        <div :style="{ width: '200px' }" data-column="title">
                            {{ item.title }}
                            <v-tooltip :text="new Date(item.dateCount).toLocaleString()" v-if="item.dateCount">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" icon="mdi-timer-outline" size="x-small" color="warning" />
                                </template>
                            </v-tooltip>
                        </div>
                    </template>

                    <template #item.publication.datePublish="{ item }">
                        <div :style="{ width: '140px' }">{{ new Date(item.publication.datePublish).toLocaleString() }}</div>
                    </template>

                    <template #item.publication.dateDelete="{ item }">
                        <div :style="{ width: '140px' }">{{ new Date(item.publication.dateDelete).toLocaleString() }}</div>
                    </template>

                    <template #item.content="{ item }">
                        <div :style="{ width: '315px' }" data-column="content" class="hellobar__content mx-auto" v-html="item.content"></div>
                    </template>

                    <template #item.background="{ item }">
                        <div :style="{ width: '40px' }" class="mx-auto" @click="appStore.copyText(item.background)">
                            <v-tooltip :text="item.background">
                                <template v-slot:activator="{ props }">
                                    <v-avatar v-bind="props" :color="item.background" size="x-small" class="border-sm" />
                                </template>
                            </v-tooltip>
                        </div>
                    </template>

                    <template #item.color="{ item }">
                        <div :style="{ width: '40px' }" class="mx-auto" @click="appStore.copyText(item.color)">
                            <v-tooltip :text="item.color">
                                <template v-slot:activator="{ props }">
                                    <v-avatar v-bind="props" :color="item.color" size="x-small" class="border-sm mx-auto" />
                                </template>
                            </v-tooltip>
                        </div>
                    </template>

                    <template #item.actions="{ item }">
                        <div :style="{ width: '150px' }">
                            <v-row class="ma-0 ga-1">
                                <action-button icon="mdi-pen" color="primary" @click="editHellobar(item)" />
                                <action-button icon="mdi-content-duplicate" color="success" @click="cloneHellobar(item)" />
                                <action-button icon="mdi-trash-can-outline" color="danger" @click="deleteHellobar(item)" />
                                <action-button icon="mdi-eye" color="primary" @click="previewHellobar(item)" variant="outlined" v-if="array.value !=='old'" />
                            </v-row>
                        </div>

                    </template>

                </v-data-table>
            </v-card>
        </slot>
        <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
        <v-dialog class="edit-modal" v-model="showEditModal" max-width="500px" :retain-focus="false">
            <v-card :title="'Modification de la hellobar : ' + hellobarToEdit.title">
                <v-row class="ma-0 mb-4 w-100 px-4 ga-2 flex-row align-center justify-space-between" v-for="(item, index) in editModalElements" :key="index">
                    <p class="mb-1 edit-modal__param">{{ item.param }}</p>
                    <slot v-if="item.type == 'text'">
                        <v-text-field class="edit-modal__value" v-model="item.value" density="compact" variant="outlined" hide-details />
                    </slot>
                    <slot v-else-if="item.type == 'editor'">
                        <tiny-mce id="editor" v-model="item.value" style="width: 310px" :init="tinymceHellobarsConfig" />
                    </slot>

                    <slot v-else-if="item.type == 'date'">
                        <input type="datetime-local" v-model="item.value" class="px-4 py-2 v-field__input edit-modal__value" size="1" />
                    </slot>

                    <slot v-else-if="item.type == 'color'">
                        <input type="color" v-model="item.value" class="edit-modal__value" />
                    </slot>

                    <slot v-else-if="item.type == 'select'">
                        <v-select :items="supportSelect" density="compact" variant="outlined" v-model="item.value" hide-details />
                    </slot>
                </v-row>
                <v-card-actions>
                    <v-btn color="primary" text="Annuler" size="small" @click="cancelHellobarEdition" />
                    <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveHellobarEdition" />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

    <bottom-menu :items="bottomMenuItems" @cancelHellobarsEvent="cancelAllModifications" @saveHellobarsEvent="saveAllModifications" />
</template>
<script setup>
    import { ref, onMounted, watch } from "vue";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useAppStore } from "@/stores/app.store.js";
    import { useHellobarsStore } from "@/stores/hellobars.store.js";

    import ActionButton from "@/components/common/data-table/ActionButton.vue";
    import SearchAdd from '../../components/common/search-add/SearchAdd.vue';
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import TinyMce from "@/components/tinymce/TinyMce.vue";

    import { getLastModificationDate } from "@/services/AppService.js";
    import * as HellobarsService from "@/services/HellobarsService.js";
    import Hellobar from "@/data/Hellobar.js";
    import tinymceHellobarsConfig from "../../data/tinymce.hellobars.config";

    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    const hellobarsStore = useHellobarsStore();

    const headers = [
        {
            title: "Titre",
            key: "title",
            width: "200px"
        },
        {
            title: "Date de publication",
            key: "publication.datePublish",
            width: "140px"
        },
        {
            title: "Date de suppression",
            key: "publication.dateDelete",
            width: "140px"
        },
        {
            title: "Contenu",
            key: "content",
            width: "315px",
            align: "center",
        },
        {
            title: "Fond",
            key: "background",
            width: "40px",
            align: "center",
        },
        {
            title: "Texte",
            key: "color",
            width: "40px",
            align: "center",
        },
        {
            title: "Actions",
            key: "actions",
            width: "150px"
        },
    ]
    const hellobarsLoading = ref(true);
    const hellobars = ref([]);
    const hellobarsPublicationArrays = ref([
        {
            title: "Hellobars en cours",
            value: "now",
            content: []
        },
        {
            title: "Hellobars futures",
            value: "next",
            content: []
        },

        {
            title: "Hellobars passées",
            value: "old",
            content: []
        }
    ])
    const hellobarToEdit = ref({});
    const showEditModal = ref(false);
    const editModalElements = ref([
        {
            param: "Titre",
            key: "title",
            type: "text",
            value: ""
        },
        {
            param: "Contenu",
            key: "content",
            type: "editor",
            value: "",
        },
        {
            param: "Date de publication",
            key: "datePublish",
            type: "date",
            value: "",
        },
        {
            param: "Date de suppression",
            key: "dateDelete",
            type: "date",
            value: "",
        },
        {
            param: "Compte à rebours",
            key: "dateCount",
            type: "date",
            value: "",
        },
        {
            param: "Couleur de fond",
            key: "background",
            type: "color",
            value: "",
        },
        {
            param: "Couleur du texte",
            key: "color",
            type: "color",
            value: "",
        },
        {
            param: "Support d'affichage",
            key: "support",
            type: "select",
            value: "",
        },
    ]);
    const supportSelect = [
        {
            title: 'Desktop & mobile',
            value: 'both',
        },
        {
            title: 'Desktop uniquement',
            value: 'desktop',
        },

        {
            title: 'Mobile uniquement',
            value: 'mobile',
        },
    ]
    const bottomMenuItems = [
        {
            text: "Annuler les modifications",
            variant: "plain",
            color: "danger",
            emit: "cancelHellobarsEvent",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveHellobarsEvent",
            icon: "mdi-content-save"

        }
    ]

    onMounted(async () => {
        // Récupère la liste des hellobars
        hellobars.value = await HellobarsService.getHelloBars();

        // Tri des hellobars dans les tableaux de publication
        addHellobarsInPublicationArrays(hellobars.value);

        hellobarsLoading.value = false;
    })

    function addHellobarsInPublicationArrays(source) {
        // On vide les tableaux de publication
        hellobarsPublicationArrays.value.forEach(array => array.content = []);

        // Puis on les remplie à partir de la source passée en paramètre
        if (source.length > 0) {
            source.sort((a, b) => new Date(b.publication.datePublish) - new Date(a.publication.datePublish))

            source.forEach((hellobar) => {
                const d = new Date();
                const publication = {
                    datePublish: new Date(hellobar.publication.datePublish),
                    dateDelete: new Date(hellobar.publication.dateDelete),
                }

                if (publication.datePublish > d) {
                    // Hellobars futures
                    hellobarsPublicationArrays.value.find(el => el.value === "next").content.push(hellobar);
                } else if (publication.dateDelete < d) {
                    // Hellobars passées
                    hellobarsPublicationArrays.value.find(el => el.value === "old").content.push(hellobar);
                } else if (publication.datePublish < d && publication.dateDelete > d) {
                    // Hellobars en cours
                    hellobarsPublicationArrays.value.find(el => el.value === "now").content.push(hellobar);
                } else {
                    console.error("Problème d'ajout de la hellobar: " + hellobar);
                }
            })
        }
    }

    function searchHellobars(event) {
        const search = event.search.toLowerCase().split(' ');
        const filteredHellobars = [];

        // Utile pour lire le contenu des hellobars puisque est écrit en html
        const el = document.createElement('html');

        hellobars.value.forEach((hellobar) => {
            // Obligé de lire le innerText de l'élément html, sinon vient lire le contenu des liens et on n'en a pas besoin
            el.innerHTML = hellobar.content;
            const title = hellobar.title.toLowerCase();
            const content = el.textContent.toLowerCase();

            search.forEach((word) => {
                if (title.includes(word) || content.includes(word)) {
                    filteredHellobars.push(hellobar);
                }
            })
        })

        addHellobarsInPublicationArrays(filteredHellobars);
    }

    function addHellobar() {
        const newHellobar = new Hellobar({});
        editHellobar(newHellobar);
    }

    function cloneHellobar(hellobar) {
        const hellobarConstructor = { ...hellobar };

        hellobarConstructor.id = null
        hellobarConstructor.title += " - Copie";
        hellobarConstructor.datePublish = hellobar.publication.datePublish;
        hellobarConstructor.dateDelete = hellobar.publication.dateDelete;

        // On ajoute la nouvelle hellobar dans le tableau global
        hellobars.value.splice(0, 0, new Hellobar(hellobarConstructor));

        // Puis on les retri dans les tableaux de publication
        addHellobarsInPublicationArrays(hellobars.value);
    }

    function editHellobar(hellobar) {
        hellobarToEdit.value = hellobar;
        for (const [key, value] of Object.entries(hellobarToEdit.value)) {
            // Cas particulier pour publication qui est un objet
            if (key == "publication") {
                const publication = hellobarToEdit.value.publication;
                for (const [publi, date] of Object.entries(publication)) {
                    editModalElements.value.find(el => el.key == publi).value = date;
                    continue;
                }
            }

            const el = editModalElements.value.find(el => el.key == key);
            if (el) editModalElements.value.find(el => el.key == key).value = value
        }
        showEditModal.value = true;
    }

    function deleteHellobar(hellobar) {
        // On supprime la hellobar du tableau global
        const indexMainHellobar = hellobars.value.findIndex(el => el.id == hellobar.id);
        hellobars.value.splice(indexMainHellobar, 1);

        // Puis on les retri dans les tableaux de publication
        addHellobarsInPublicationArrays(hellobars.value);
    }

    function previewHellobar(item) {
        const date = new Date(item.publication.datePublish);
        // On fait la preview à seconde + 1 car si on preview au moment du changement ça tombe en erreur
        const ss = date.getSeconds() + 1;
        window.open("https://preprod.maty.com/?dtconsult=" + new Date(date.setSeconds(ss)).toLocaleString(), '_blank');
    }

    function saveHellobarEdition() {
        const idHellobar = hellobarToEdit.value.id;
        const indexMainHellobar = hellobars.value.findIndex(el => el.id == idHellobar);

        const hellobarConstructor = {
            id: hellobarToEdit.value.id,
            publication: {}
        }

        // On vient construire notre "nouvelle hellobar"
        editModalElements.value.forEach((item) => hellobarConstructor[item.key] = item.value)
        const hellobar = new Hellobar(hellobarConstructor)

        // On la remplace dans le tableau principal
        hellobars.value.splice(indexMainHellobar, 1, hellobar)

        // On les re-rempli
        addHellobarsInPublicationArrays(hellobars.value)

        // On vient garder une trace de la hellobar modifiée pour les logs
        HellobarsService.setEditedHellobarInSessionStorage(hellobar.id, hellobar.title)

        // On ferme tout
        showEditModal.value = false;

        // Obligé d'attendre de la durée de l'animation de la modale sinon on voit l'affichage péter
        setTimeout(() => {
            hellobarToEdit.value = {};
        }, 200)

    }

    function cancelHellobarEdition() {
        showEditModal.value = false;

        // On attend avant de reset l'objet de la durée de la transition de la modal,
        // sinon on voit l'affichage qui change
        setTimeout(() => {
            hellobarToEdit.value = {};
        }, 200)
    }

    function cancelAllModifications() {
        location.reload();
    }

    async function saveAllModifications() {
        let error = false;

        hellobars.value.forEach((hellobar) => {
            // On vient chercher si un champ de la hellobar est vide
            for (const [key, value] of Object.entries(hellobar)) {
                if (value == "" && key != "dateCount") {
                    error = true;
                    snackbarStore.showSnackbar({
                        title: "Une hellobar est vide !",
                        color: "danger",
                        message: "La hellobar \"" + hellobar.title + "\" est vide"
                    })
                }
            }

            // On regarde si la date de suppression est inférieure à la date de publication
            if (new Date(hellobar.publication.datePublish) > new Date(hellobar.publication.dateDelete)) {
                error = true;
                snackbarStore.showSnackbar({
                    title: "Erreur de dates",
                    color: "danger",
                    message: "Les dates de publication de la hellobar \"" + hellobar.title + "\" ne sont pas cohérentes"
                })
            }
        })

        if (error) return;

        const hellobarsString = JSON.stringify(hellobars.value);
        try {
            const response = await HellobarsService.saveHelloBars(hellobarsString);
            if (response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Réussite de l'enregistrement",
                    color: "success",
                    message: "Rendez-vous sur la <a href='https://preprod.maty.com'>preprod</a> pour visualiser vos modifications et sur la <a href='http://console.maty.local/Script/Index/MeLHellobars'>console MATY</a> pour publier vos changements en production"
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
    }
</script>

<style lang="scss">
    .v-table--density-comfortable {
        --v-table-header-height: 30px !important;
    }

    .hellobars {
        .hellobar {
            &__content {
                * {
                    color: inherit !important;
                    text-decoration: inherit !important;
                    font-weight: inherit !important;
                    font-style: inherit !important;
                }
            }
        }
    }

    .hellobar-editor {
        .ck-editor {
            width: 310px !important;
        }
    }
</style>
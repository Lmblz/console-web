<template>
    <v-card elevation="2" class="mt-n5 pt-3 pb-2 pl-2 position-sticky rounded-0 page-title">
        <template #title>
            Édition de la Homepage {{ homepage.title}}
            <v-btn size="x-small" variant="plain" icon="mdi-pen" color="primary" @click="editMainInfos" />
        </template>
    </v-card>

    <h4 v-if="homepage.content && homepage.content.length === 0" class="pa-4">
        Il n'y a aucun contenu dans la page, veuillez ajouter une section à l'aide du bouton "SECTIONS" situé en haut à droite de la page
    </h4>

    <v-hover v-slot="{ isHovering, props }" v-for="(section, index) in homepage.content" :key="index">
        <v-card v-bind="props" class="my-4 mx-6 py-2 card-section" elevation="0">
            <div class="main-wrapper">
                <main id="main-content">
                    <div class="homepage">
                        <div class="homepage-wrapper">
                            <page-section :data="section" :showModal="showSectionModal[section.id]" @onCloseModal="showSectionModal[section.id] = false" />
                        </div>
                    </div>
                </main>
            </div>

            <v-overlay :model-value="isHovering" contained opacity=".3" class="height-100 d-flex justify-center align-center cursor-pointer hover-buttons" @click="clickOverlay($event, section)">
                <v-row class="ma-0 ga-3 height-100 align-center justify-center">
                    <v-btn size="small" color="primary" icon="mdi-pen" @click="editSection(section)"></v-btn>
                    <v-btn size="small" color="success" icon="mdi-content-duplicate" @click="cloneSection(section)"></v-btn>
                    <v-btn size="small" color="danger" icon="mdi-delete" @click="deleteSection(section)"></v-btn>
                    <v-btn size="small" color="white" icon="mdi-chevron-up" @click="moveSection(section, 'up')"></v-btn>
                    <v-btn size="small" color="white" icon="mdi-chevron-down" @click="moveSection(section, 'down')"></v-btn>
                </v-row>
            </v-overlay>
        </v-card>
    </v-hover>

    <bottom-menu :items="bottomMenuItems" @cancelHomepageEvent="cancelAllModifications" @saveHomepageEvent="saveAllModifications" />
    <side-sections-panel />

    <v-dialog class="edit-modal" v-model="showEditModal" max-width="500px">
        <v-card :title="homepage.title">
            <v-row class="ma-0 mb-4 w-100 px-4 ga-2 flex-row align-center justify-space-between" v-for="(item, index) in editModalElements" :key="index">
                <p class="mb-1 edit-modal__param">{{ item.param }}</p>
                <slot v-if="item.type == 'text'">
                    <v-text-field class="edit-modal__value" v-model="item.value" density="compact" variant="outlined" hide-details />
                </slot>

                <slot v-else-if="item.type == 'date'">
                    <input type="datetime-local" v-model="item.value" class="px-4 py-2 v-field__input edit-modal__value" size="1" />
                </slot>

                <slot v-else-if="item.type == 'textarea'">
                    <v-textarea class="edit-modal__value" v-model="item.value" density="compact" variant="outlined" hide-details auto-grow rows="1" />
                </slot>
            </v-row>
            <v-card-actions>
                <v-btn color="primary" text="Annuler" size="small" @click="cancelHomepageEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveHomepageEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted, nextTick, watch } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js"
    import { useAppStore } from "@/stores/app.store.js";

    import Section from "../../data/Section.js";

    import * as HomepagesService from "@/services/HomepagesService.js";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import SideSectionsPanel from "@/components/sections/SideSectionsPanel.vue";
    import PageSection from "@/components/sections/PageSection.vue";

    const route = useRoute();
    const router = useRouter();
    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const appStore = useAppStore();

    const homepageId = route.params.id;
    const homepage = ref({});
    const stylesheetUrls = [
        "https://www.maty.com/dist/css/main-layout.min-20220809.01.css",
        "https://www.maty.com/dist/css/homepage.min-20220809.01.css",
    ];
    const bottomMenuItems = [
        {
            text: "Annuler les modifications non enregistrées",
            variant: "plain",
            color: "danger",
            emit: "cancelHomepageEvent",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveHomepageEvent",
            icon: "mdi-content-save"

        }
    ];
    const showEditModal = ref(false);
    const editModalElements = ref([
        {
            param: "Titre",
            key: "title",
            type: "text",
            value: ""
        },
        {
            param: "Date de publication",
            key: "datePublish",
            type: "date",
            value: "",
        },
        {
            param: "Contenu dans le head",
            key: "headContent",
            type: "textarea",
            value: ""
        },
        {
            param: "Contenu dans le script",
            key: "scriptContent",
            type: "textarea",
            value: "",
        },
    ]);
    const renderComponent = ref(true);
    const showSectionModal = ref({});

    onMounted(async () => {
        // On récupère la homepage
        homepage.value = await HomepagesService.getHomepageToEdit(homepageId);

        // Trick qui permet de re-rendre les composants car il arrive qu'ils bug
        renderComponent.value = false;
        renderComponent.value = true;

        // On vient ajouter les styles de maty.com
        stylesheetUrls.forEach((el, index) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = el;
            document.head.appendChild(link);
        });

        // Initialisation des modales d'édition des sections
        initializeShowSectionModal();
    })

    function initializeShowSectionModal() {
        // On vient ajouter à l'objet des prioriétés en key l'id de la section
        // et en value un boolean
        homepage.value.content.forEach(section => {
            showSectionModal.value[section.id] = false;
        })
    }

    function cancelAllModifications() {
        router.push("/homepage");
    }

    async function saveAllModifications() {
        const response = await homepageStore.saveHomepageEdited();

        if (!response.ok) {
            snackbarStore.showSnackbar({
                title: "Erreur",
                message: "Il y a eu une erreur lors de l'enregistrement",
                color: "error"
            })
        } else {
            router.push("/homepage");
        }

    }

    function clickOverlay(event, section) {
        if (event.target.classList.contains("v-overlay__scrim")) editSection(section)
    }

    function editSection(section) {
        // On ajoute dans le store la section à modifier
        sectionsStore.setSectionToEdit(section);

        // On affiche la modal liée à la section
        showSectionModal.value[section.id] = true;
    }

    function deleteSection(section) {
        // On supprime la section de la homepage
        const sectionIndex = homepage.value.content.findIndex(el => el.id == section.id);
        homepage.value.content.splice(sectionIndex, 1);

        // Trick pour forcer le re-rendu des composants, autrement peut provoquer des bugs visuels
        renderComponent.value = false;
        nextTick(() => {
            renderComponent.value = true;
        })
    }

    async function cloneSection(section) {
        // On récupère la section à éditer
        const sectionIndex = homepage.value.content.findIndex(el => el.id == section.id);
        // On la clone
        const newSection = { ...section };
        // On lui réattribu un id
        newSection.id = new Section().getId();
        // On l'ajoute à la suite de la section initiale
        homepage.value.content.splice(sectionIndex + 1, 0, newSection);

        // Trick pour forcer le re-rendu des composants, autrement peut provoquer des bugs visuels
        renderComponent.value = false;
        await nextTick(() => {
            renderComponent.value = true;
        })

        appStore.scrollToSectionById(newSection.id);
    }

    async function moveSection(section, direction) {
        // On récupère la section à bouger
        const sectionIndex = homepage.value.content.findIndex(el => el.id == section.id);
        let newIndex = sectionIndex;

        if ((newIndex == homepage.value.content.length - 1 && direction == "down") || (newIndex == 0 && direction == "up")) {
            snackbarStore.showSnackbar({
                title: "Attention",
                color: "warning",
                message: "Vous ne pouvez pas déplacer cette section dans cette direction"
            })

            return;
        }

        // Si on veut la monter, on diminue son index, si on veut la descendre on l'augmente
        direction == "up" ? newIndex-- : newIndex++

        // On vient supprimer la section et l'insérer à son nouvel index
        homepage.value.content.splice(sectionIndex, 1);
        homepage.value.content.splice(newIndex, 0, section);

        // Trick pour forcer le re-rendu des composants, autrement peut provoquer des bugs visuels
        renderComponent.value = false;
        await nextTick(() => {
            renderComponent.value = true;
        })

        appStore.scrollToSectionById(section.id);
    }

    function editMainInfos() {
        // On vient récupérer les infos principales de la home et on les clone, permet de ne pas travailler directement sur l'objet principal
        editModalElements.value.forEach(el => {
            const property = homepage.value[el.key];
            if (property) el.value = property;
        })

        showEditModal.value = true;
    }

    function cancelHomepageEdition() {
        // Si on annule les modifs, on vient réinitialiser les infos
        showEditModal.value = false;

        editModalElements.value.forEach(el => {
            el.value = "";
        })
    }

    function saveHomepageEdition() {
        // Si on enregistre, on vient remplacer les infos dans l'objet principale
        editModalElements.value.forEach(el => {
            homepage.value[el.key] = el.value;
        })

        showEditModal.value = false;
    }

</script>

<style lang="scss">
    .page-title {
        z-index: 5;
        top: calc(var(--v-layout-top) - 20px);

        .v-card-item {
            padding: 0;
        }
    }

    .card-section {
        background: rgba(0,0,0,0);

        .homepage-wrapper {
            & > section {
                margin-bottom: 0 !important;
            }
        }
    }
</style>
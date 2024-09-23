<template>
    <v-card elevation="2" class="mt-n5 pt-3 pb-2 pl-2 position-sticky ounded-0 page-title">
        <template #title>
            Édition de la Page Dynamique {{ dynamicpage.title}}
            <v-btn size="x-small" variant="plain" icon="mdi-pen" color="primary" @click="editMainInfos" />
        </template>
    </v-card>

    <slot v-if="dynamicpage.content && dynamicpage.content.length === 0">
        <h4 class="pa-4">
            Il n'y a aucun contenu dans la page, veuillez ajouter une section à l'aide du bouton "SECTIONS" situé en haut à droite de la page, ou copiez le contenu d'une autre page dynamique en cliquant sur ce bouton :
        </h4>
        <v-row class="justify-center">
            <v-btn color="primary" @click="copyDynamicPage" size="small">Copier une page dynamique</v-btn>
            <v-dialog v-model="showCopyModal" max-width="500px">
                <v-card title="Copier une page dynamique">
                <v-card-text>
                    <v-text-field label="N° de la page à copier :" density="compact" variant="outlined" v-model="idToCopy" hide-details />
                </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" size="small" @click="showCopyModal = false">Annuler</v-btn>
                        <v-btn color="primary" variant="elevated" size="small" :disabled="disableButton" @click="cloneDynamicPage">Copier le contenu</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>

    </slot>

    <v-hover v-slot="{ isHovering, props }" v-for="(section, index) in dynamicpage.content" :key="'element' + index">
        <v-card v-bind="props" class="my-4 mx-6 py-2 card-section" elevation="0">
            <div class="main-wrapper">
                <main id="main-content">
                    <div class="-dynamicpage">
                        <!--rend le composant en fonction de object.name-->
                        <page-section :data="section" :showModal="showSectionModal[section.id]" @onCloseModal="showSectionModal[section.id] = false" />
                    </div>
                </main>
            </div>

            <v-overlay :model-value="isHovering" contained opacity=".3" class="height-100 d-flex justify-center align-center cursor-pointer hover-buttons" @click="clickOverlay($event, section)">
                <v-row class="ma-0 ga-3 height-100 align-center justify-center">
                    <v-btn size="small" color="primary" icon="mdi-pen" @click.prevent="editSection(section)"></v-btn>
                    <v-btn size="small" color="success" icon="mdi-content-duplicate" @click.prevent="cloneSection(section)"></v-btn>
                    <v-btn size="small" color="danger" icon="mdi-delete" @click.prevent="deleteSection(section)"></v-btn>
                    <v-btn size="small" color="white" icon="mdi-chevron-up" @click.prevent="moveSection(section, 'up')"></v-btn>
                    <v-btn size="small" color="white" icon="mdi-chevron-down" @click.prevent="moveSection(section, 'down')"></v-btn>
                </v-row>
            </v-overlay>
        </v-card>
    </v-hover>

    <bottom-menu :items="bottomMenuItems" @cancelEvent="cancelAllModifications" @saveEvent="saveAllModifications" />
    <side-sections-panel />

    <v-dialog class="edit-modal" v-model="showEditModal" max-width="500px">
        <v-card :title="dynamicpage.title">
            <v-row class="ma-0 mb-4 w-100 px-4 ga-2 flex-row align-center justify-space-between" v-for="(item, index) in editModalElements" :key="'editModalElement' + index">
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
                <v-btn color="primary" text="Annuler" size="small" @click="cancelDynamicpageEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveDynamicpageEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted, nextTick, watch } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useAppStore } from "@/stores/app.store.js";

    import Section from "../../data/Section.js";

    import * as DynamicpagesService from "@/services/DynamicpagesService.js";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import SideSectionsPanel from "@/components/sections/SideSectionsPanel.vue";
    import PageSection from "@/components/sections/PageSection.vue";

    const route = useRoute();
    const router = useRouter();
    const dynamicpagesStore = useDynamicpagesStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const appStore = useAppStore();

    const dynamicpageId = route.params.directoryId;
    const dynamicpages = ref([]);
    const dynamicpage = ref({});
    const stylesheetUrls = [
        "https://www.maty.com/dist/css/main-layout.min.css",
        "https://www.maty.com/dist/css/homepage.min.css",
        "https://www.maty.com/dist/css/dynamicpage.min-20240718.01.css",
    ];
    const bottomMenuItems = [
        {
            text: "Annuler les modifications non enregistrées",
            variant: "plain",
            color: "danger",
            emit: "cancelEvent",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveEvent",
            icon: "mdi-content-save"

        }
    ];
    const showEditModal = ref(false);
    const showCopyModal = ref(false);
    const idToCopy = ref("");
    const disableButton = ref(true);
    const editModalElements = ref([
        {
            param: "Titre",
            key: "title",
            type: "text",
            value: ""
        },
        {
            param: "Id de page Sparkow",
            key: "sparkowId",
            type: "text",
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
    const showSectionModal = ref({})

    onMounted(async () => {
        const dp = await DynamicpagesService.getDynamicpageToEdit(dynamicpageId);
        if (dp.sparkowId == "" || !dp.sparkowId.includes("/C-")) dp.sparkowId = "/C-" + dp.sparkowId;
        dynamicpagesStore.setDynamicpageToEdit(dp);
        dynamicpage.value = dp;

        dynamicpages.value = dynamicpagesStore.getDynamicpages();

        if (dynamicpages.value == null) {
            dynamicpages.value = await DynamicpagesService.getDynamicpages();
            dynamicpagesStore.setDynamicpages(dynamicpages.value)
        }

        renderComponent.value = false;
        renderComponent.value = true;

        stylesheetUrls.forEach((el, index) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = el;
            document.head.appendChild(link);
        });

        initializeShowSectionModal();
    })

    watch(idToCopy, async (newValue, oldValue) => {
        const index = dynamicpages.value.findIndex(el => el.directory == newValue);

        if (index == -1) {
            disableButton.value = true;
            return;
        }

        disableButton.value = false;
    })

    function initializeShowSectionModal() {
        dynamicpage.value.content.forEach(section => {
            showSectionModal.value[section.id] = false;
        })
    }

    function cancelAllModifications() {
        router.push("/dynamicpages");
    }

    async function saveAllModifications() {
        const response = await dynamicpagesStore.saveDynamicpageEdited();

        if (!response.ok) {
            snackbarStore.showSnackbar({
                title: "Erreur",
                message: "Il y a eu une erreur lors de l'enregistrement",
                color: "error"
            })
        } else {
            router.push("/dynamicpages");
        }

    }

    function copyDynamicPage() {
        showCopyModal.value = true;
    }

    async function cloneDynamicPage() {
        const dynamicpageToClone = await DynamicpagesService.getDynamicpageToEdit(idToCopy.value);

        if (!dynamicpageToClone) {
            snackbarStore.showSnackbar({
                title: "Erreur",
                color: "warning",
                message: "Il y a eu un problème lors de la copie des données de la page"
            })

            return
        }

        const newId = new Section().getId();
        dynamicpageToClone.id = newId;
        dynamicpageToClone.directory = dynamicpageId;
        dynamicpage.value = dynamicpageToClone;
    }

    function clickOverlay(event, section) {
        if (event.target.classList.contains("v-overlay__scrim")) editSection(section)
    }

    function editSection(section) {
        sectionsStore.setSectionToEdit(section);
        showSectionModal.value[section.id] = true;
    }

    function deleteSection(section) {
        const sectionIndex = dynamicpage.value.content.findIndex(el => el.id == section.id);
        dynamicpage.value.content.splice(sectionIndex, 1);

        renderComponent.value = false;

        nextTick(() => {
            renderComponent.value = true;
        })
    }

    async function cloneSection(section) {
        const sectionIndex = dynamicpage.value.content.findIndex(el => el.id == section.id);
        const newSection = { ...section };
        newSection.id = new Section().getId();
        dynamicpage.value.content.splice(sectionIndex + 1, 0, newSection);

        renderComponent.value = false;
        await nextTick(() => {
            renderComponent.value = true;
        })

        appStore.scrollToSectionById(newSection.id);
    }

    async function moveSection(section, direction) {
        const sectionIndex = dynamicpage.value.content.findIndex(el => el.id == section.id);
        let newIndex = sectionIndex;

        if ((newIndex == dynamicpage.value.content.length - 1 && direction == "down") || (newIndex == 0 && direction == "up")) {
            snackbarStore.showSnackbar({
                title: "Attention",
                color: "warning",
                message: "Vous ne pouvez pas déplacer cette section dans cette direction"
            })

            return;
        }

        direction == "up" ? newIndex-- : newIndex++

        dynamicpage.value.content.splice(sectionIndex, 1);
        dynamicpage.value.content.splice(newIndex, 0, section);

        renderComponent.value = false;
        await nextTick(() => {
            renderComponent.value = true;
        })

        appStore.scrollToSectionById(section.id);
    }

    function editMainInfos() {
        editModalElements.value.forEach(el => {
            const property = dynamicpage.value[el.key];
            if (property) el.value = property;
        })

        showEditModal.value = true;
    }

    function cancelDynamicpageEdition() {
        showEditModal.value = false;

        editModalElements.value.forEach(el => {
            el.value = "";
        })
    }

    function saveDynamicpageEdition() {
        editModalElements.value.forEach(el => {
            dynamicpage.value[el.key] = el.value;
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

        section {
            margin-bottom: 0 !important;
        }
    }
</style>
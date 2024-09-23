<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section de texte simple" class="px-2 pb-2" color="background">
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Paramètre de la section</h4>
                        </v-row>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Id de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.id" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H1</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.titleH1.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H2</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.titleH2.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H3</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.titleH3.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Contenu de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce id="editor" :init="tinymceSectionsConfig" v-model="tempSection.description.text" />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-card-actions>
                <v-btn color="primary" text="Annuler" size="small" @click="cancelSectionEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveSectionEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { useRoute } from "vue-router";
    import { onMounted, ref, toRaw } from "vue";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";

    import TinyMce from "@/components/tinymce/TinyMce.vue";
    import tinymceSectionsConfig from "@/data/tinymce.sections.config.js";

    import Section from "@/data/Section";

    const route = useRoute();
    const emit = defineEmits(["closeModal"])

    const homepageStore = useHomepageStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const sectionToEdit = ref({});
    const tempSection = ref({})

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
    })

    function eventSection(event, item) {
        const itemIndex = tempSection.value.entries.findIndex(el => el.text == item.text);

        if (event == "up" || event == "down") {
            if ((itemIndex == 0 && event == "up") || (itemIndex == tempSection.value.entries.length - 1 && event == "down")) {
                snackbarStore.showSnackbar({
                    message: "Vous ne pouvez pas déplacer l'élément dans cette direction",
                    color: "warning",
                    title: "Attention"
                })
                return
            }

            const newIndex = event == "up" ? itemIndex - 1 : itemIndex + 1;

            tempSection.value.entries.splice(itemIndex, 1);
            tempSection.value.entries.splice(newIndex, 0, item);
        }

        if (event == "delete") {
            if (tempSection.value.entries.length == 1) {
                snackbarStore.showSnackbar({
                    message: "Il doit obligatoirement y avoir au minimum un élément dans cette section",
                    color: "warning",
                    title: "Attention"
                })

                return
            }
            tempSection.value.entries.splice(itemIndex, 1);
        }
    }

    function saveSectionEdition() {
        if (route.path.includes("homepage")) {
            homepageStore.saveSectionEdited(tempSection.value);
        } else {
            dynamicpagesStore.saveSectionEdited(tempSection.value);

        }
        emit("closeModal");
    }

    function cancelSectionEdition() {
        emit("closeModal");
    }
</script>

<style lang="scss">
    .v-input {
        .v-selection-control-group {
            &[role=radiogroup] {
                justify-content: space-between;
            }
        }

        &.media-type {
            .v-selection-control-group[role=radiogroup] {
                justify-content: space-evenly;
            }
        }
    }

    .actions-section {
        z-index: 10
    }
</style>
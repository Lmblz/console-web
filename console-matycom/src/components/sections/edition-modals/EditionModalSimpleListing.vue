<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section de listage de contenu simple" class="px-2 pb-2" color="background">
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètres de la section</h4>
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
                                <p>Titre de la section (H2)</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-for="(item, index) in tempSection.content" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Contenu n°{{ index + 1 }} - {{ item.title.text }}</h4>
                            <v-row class="ma-0 justify-end ga-2 pr-4 actions-section">
                                <p @click.native.stop="eventSection('up', item)" class="text-caption text-decoration-underline">Monter</p>
                                <p @click.native.stop="eventSection('down', item)" class="text-caption text-decoration-underline">Descendre</p>
                                <p @click.native.stop="eventSection('delete', item)" class="text-caption text-decoration-underline">Supprimer</p>
                            </v-row>
                        </v-row>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H2</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce :id="'editor' + index" :init="tinymceSectionsConfig" v-model="item.description.text" />
                            </v-col>
                        </v-row>
                        <v-expansion-panels class="mt-4">
                            <v-expansion-panel>
                                <template #title>
                                    <v-row class="ma-0 align-center">
                                        <h4>Paramètres de l'image</h4>
                                        <v-row class="ma-0 justify-end ga-2 pr-4 actions-section">
                                            <p @click.native.stop="eventSection('delete', item)" class="text-caption text-decoration-underline">Supprimer</p>
                                        </v-row>
                                    </v-row>
                                </template>
                                <template #text>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Url de l'image desktop</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-row>
                                                <v-col cols="9">
                                                    <v-text-field v-model="item.picture.desktopPicture.url" density="compact" variant="outlined" hide-details />
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                              v-model="item.picture.desktopPicture.extension" />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Url de l'image mobile</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-row>
                                                <v-col cols="9">
                                                    <v-text-field v-model="item.picture.mobilePicture.url" density="compact" variant="outlined" hide-details />
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                              v-model="item.picture.mobilePicture.extension" />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-btn variant="plain" color="primary" text="Ajouter un contenu" @click="tempSection.content.push(new Section().getEmptyElement(tempSection._type));" />
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


    const emit = defineEmits(["closeModal"]);

    const route = useRoute();
    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const sectionToEdit = ref({});
    const tempSection = ref({});

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content;
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
    });

    function eventSection(event, item) {
        if (event == "delete") {
            tempSection.value.content = null;
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
        z-index: 10;
    }
</style>
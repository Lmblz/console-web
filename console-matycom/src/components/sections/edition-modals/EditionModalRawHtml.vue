<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section raw Html" class="px-2 pb-2" color="background">
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <h4>Zone Raw HTML</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="12">
                                <tiny-mce id="editor" :init="tinymceSectionsConfig" v-model="tempSection.html" />
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
    import Editor from '@tinymce/tinymce-vue';
    import { useRoute } from "vue-router";
    import { onMounted, ref, toRaw } from "vue";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";

    import TinyMce from "@/components/tinymce/TinyMce.vue";
    import tinymceSectionsConfig from "@/data/tinymce.sections.config.js";

    import Section from "@/data/Section";

    const emit = defineEmits(["closeModal"])

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
    })

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
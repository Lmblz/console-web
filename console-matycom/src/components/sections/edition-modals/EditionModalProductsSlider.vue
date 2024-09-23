<template>
    <v-dialog width="80%">
        <v-card title="Édition du slider de produits" class="px-2 pb-2" color="background">
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètres de la section</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-checkbox v-model="grayBackground"
                                        color="primary"
                                        hide-details
                                        style="--v-medium-emphasis-opacity: 1;">
                                <template #label>
                                    <p>Couleur de fond de la section en gris ?</p>
                                </template>
                            </v-checkbox>
                        </v-row>
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
                                <p>Titre de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.description.title" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Code de la zone de merch</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.merchandisingActionCode" density="compact" variant="outlined" hide-details />
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
    import { ref, onMounted, watch, toRaw } from "vue";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";

    import Section from "@/data/Section";

    const emit = defineEmits(["closeModal"])

    const route = useRoute();
    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const sectionToEdit = ref({});
    const tempSection = ref({});

    const grayBackground = ref(true);

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content;
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
        
        tempSection.value.backgroundColor == "#f2f2f2" 
            ? grayBackground.value = true 
            : grayBackground.value = false;
    })

    watch(() => grayBackground.value, (newValue, oldValue) => {
        newValue 
            ? tempSection.value.backgroundColor = "#f2f2f2"
            : tempSection.value.backgroundColor = "#ffffff";
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

    function isBackgroundGray() {
        tempSection.value.backgroundColor = "#ffffff";
        return tempSection.value.backgroundColor == "#f2f2f2";
    }
</script>

<style lang="scss">
    body {
       
    }
</style>
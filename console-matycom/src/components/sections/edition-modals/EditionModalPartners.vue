<template>
    <v-dialog width="80%">
        <v-card title="Édition des partenaires" class="px-2 pb-2" color="background">
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
                                <p>Titre de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="8">
                                        <v-text-field v-model="tempSection.descriptionArea.button.encodedUrl" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="4">
                                        <v-row class="ma-0 h-100 ga-2">
                                            <v-btn class="h-100" color="primary" text="Encoder" variant="tonal" size="small" @click="tempSection.descriptionArea.button.encodedUrl = Buffer.from(tempSection.descriptionArea.button.encodedUrl).toString('base64')" />
                                            <v-btn class="h-100 w-auto rounded-xl" color="primary" variant="tonal" size="small">
                                                <v-icon icon="mdi-help" />
                                                <v-tooltip activator="parent"
                                                           location="start">
                                                    {{ Buffer.from(tempSection.descriptionArea.button.encodedUrl, 'base64').toString('utf-8') }}
                                                </v-tooltip>
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte du bouton</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.descriptionArea.button.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-for="(item, index) in tempSection.items" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Élément n°{{ index + 1 }} - {{ item.description.text }}</h4>
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
                                <p>Nom du partenaire</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.description.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url de l'image</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="9">
                                        <v-text-field v-model="item.logo.picture.desktopPicture.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                  v-model="item.logo.picture.desktopPicture.extension" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte alternatif</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.logo.picture.alt" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-btn variant="plain" color="primary" text="Ajouter un nouveau partenaire" @click="tempSection.items.push(new Section().getEmptyElement(tempSection._type))" />
            <v-card-actions>
                <v-btn color="primary" text="Annuler" size="small" @click="cancelSectionEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveSectionEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { useRoute } from "vue-router";
    import { ref, onMounted, toRaw } from "vue";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";
    import { Buffer } from "buffer";

    import Section from "@/data/Section";

    const emit = defineEmits(["closeModal"])

    const route = useRoute();
    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const sectionsStore = useSectionsStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const sectionToEdit = ref({});
    const tempSection = ref({})

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content;
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
    })

    function eventSection(event, item) {
        const itemIndex = tempSection.value.items.findIndex(el => el.id == item.id);
        if (event == "up" || event == "down") {
            if ((itemIndex == 0 && event == "up") || (itemIndex == tempSection.value.items.length - 1 && event == "down")) {
                snackbarStore.showSnackbar({
                    message: "Vous ne pouvez pas déplacer l'élément dans cette direction",
                    color: "warning",
                    title: "Attention"
                })
                return
            }

            const newIndex = event == "up" ? itemIndex - 1 : itemIndex + 1;

            tempSection.value.items.splice(itemIndex, 1);
            tempSection.value.items.splice(newIndex, 0, item);
        }

        if (event == "delete") {
            if (tempSection.value.items.length == 1) {
                snackbarStore.showSnackbar({
                    message: "Il doit obligatoirement y avoir au minimum un élément dans cette section",
                    color: "warning",
                    title: "Attention"
                })

                return
            }
            tempSection.value.items.splice(itemIndex, 1);
        }
    }

    function saveSectionEdition() {
        tempSection.value.items.forEach(item => {
            item.logo.picture.mobilePicture = item.logo.picture.desktopPicture
        })

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
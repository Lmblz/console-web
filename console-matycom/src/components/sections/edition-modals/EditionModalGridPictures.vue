<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section image / contenu" class="px-2 pb-2" color="background">
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
                                <p>Titre H2 de la section</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.titleH2.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-for="(item, index) in tempSection.items" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Ligne n°{{ index + 1 }} - {{ item.title.text }}</h4>
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
                                <p>Type de média</p>
                            </v-col>
                            <v-col cols="8">
                                <v-radio-group v-model="item.mediaType" inline hide-details>
                                    <v-radio color="primary" label="Image" value="Picture" />
                                    <v-radio color="primary" label="Vidéo" value="Video" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Format du média</p>
                            </v-col>
                            <v-col cols="8">
                                <v-radio-group v-model="item.mediaFormat" inline hide-details>
                                    <v-radio color="primary" label="Demi banner" value="DemiBanner" />
                                    <v-radio color="primary" label="Story" value="Story" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <slot v-if="item.mediaType == 'Picture'">
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
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Texte alternatif</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="item.picture.alt" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                        </slot>
                        <slot v-else-if="item.mediaType == 'Video'">
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url de la vidéo desktop</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="9">
                                            <v-text-field v-model="item.video.desktopVideo.url" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-select label="extension" :items="['mp4', 'webm']" density="compact" variant="outlined" hide-details
                                                      v-model="item.video.desktopVideo.extension" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url du poster desktop</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="9">
                                            <v-text-field v-model="item.video.desktopVideo.poster.url" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                      v-model="item.video.desktopVideo.poster.extension" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url de la vidéo mobile</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="9">
                                            <v-text-field v-model="item.video.mobileVideo.url" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-select label="extension" :items="['mp4', 'webm']" density="compact" variant="outlined" hide-details
                                                      v-model="item.video.mobileVideo.extension" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url du poster mobile</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="9">
                                            <v-text-field v-model="item.video.mobileVideo.poster.url" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                      v-model="item.video.mobileVideo.poster.extension" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </slot>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H3</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Contenu de la ligne</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce :id="'editor' + index" :init="tinymceSectionsConfig" v-model="item.description.text" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-expansion-panels>
                                <v-expansion-panel v-for="(button, btnIndex) in item.buttons" :key="btnIndex">
                                    <template #title>
                                        <v-row class="ma-0 align-center">
                                            <h4>Bouton n°{{ index + 1 }} - {{ button.text }}</h4>
                                            <v-row class="ma-0 justify-end ga-2 pr-4 actions-section">
                                                <p @click.native.stop="eventSection('up', item, button)" class="text-caption text-decoration-underline">Monter</p>
                                                <p @click.native.stop="eventSection('down', item, button)" class="text-caption text-decoration-underline">Descendre</p>
                                                <p @click.native.stop="eventSection('delete', item, button)" class="text-caption text-decoration-underline">Supprimer</p>
                                            </v-row>
                                        </v-row>
                                    </template>
                                    <template #text>
                                        <v-row class="align-center border-t">
                                            <v-col cols="4">
                                                <p>Contenu du bouton</p>
                                            </v-col>
                                            <v-col cols="8">
                                                <v-text-field v-model="button.text" density="compact" variant="outlined" hide-details />
                                            </v-col>
                                        </v-row>
                                        <v-row class="align-center border-t">
                                            <v-col cols="4">
                                                <p>Url du bouton</p>
                                            </v-col>
                                            <v-col cols="8">
                                                <v-row>
                                                    <v-col cols="9">
                                                        <v-text-field v-model="button.encodedUrl" density="compact" variant="outlined" hide-details />
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-row class="ma-0 h-100 ga-2">
                                                            <v-btn class="h-100" color="primary" text="Encoder" variant="tonal" size="small" @click="button.encodedUrl = Buffer.from(button.encodedUrl).toString('base64')" />
                                                            <v-btn class="h-100 w-auto rounded-xl" color="primary" variant="tonal" size="small">
                                                                <v-icon icon="mdi-help" />
                                                                <v-tooltip activator="parent"
                                                                           location="start">
                                                                    {{ Buffer.from(button.encodedUrl, 'base64').toString('utf-8') }}
                                                                </v-tooltip>
                                                            </v-btn>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <v-btn variant="plain" color="primary" text="Ajouter un nouveau bouton" class="mx-auto" @click="item.buttons.push(new Section().getEmptyCta())" />
                        </v-row>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-btn variant="plain" color="primary" text="Ajouter un nouvel élément" @click="tempSection.items.push(new Section().getEmptyElement(tempSection._type))" />
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
    const tempSection = ref({})

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content;
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
    })

    function eventSection(event, row, button) {
        let root;
        let itemIndex;
        let item;
        const rowIndex = tempSection.value.items.findIndex(el => el.id == row.id)

        if (!button) {
            root = tempSection.value.items;
            itemIndex = rowIndex;
            item = row;
        } else {
            root = tempSection.value.items[rowIndex].buttons;
            itemIndex = root.findIndex(el => el.text == button.text);
            item = button;
        }

        if (event == "up" || event == "down") {
            if ((itemIndex == 0 && event == "up") || (itemIndex == root.length - 1 && event == "down")) {
                snackbarStore.showSnackbar({
                    message: "Vous ne pouvez pas déplacer l'élément dans cette direction",
                    color: "warning",
                    title: "Attention"
                })
                return
            }

            const newIndex = event == "up" ? itemIndex - 1 : itemIndex + 1;

            root.splice(itemIndex, 1);
            root.splice(newIndex, 0, item);
        }

        if (event == "delete") {
            if (root.length == 1 && !button) {
                snackbarStore.showSnackbar({
                    message: "Il doit obligatoirement y avoir au minimum un élément dans cette section",
                    color: "warning",
                    title: "Attention"
                })

                return
            }
            root.splice(itemIndex, 1);
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
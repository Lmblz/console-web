<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section cartes / slider" class="px-2 pb-2" color="background">
            <!-- Cards -->
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
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètres des cartes</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre des cartes</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.cards.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-for="(item, index) in tempSection.cards.cards" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Carte n°{{ index + 1 }} - {{ item.content.title }}</h4>
                            <v-row class="ma-0 justify-end ga-2 pr-4 actions-section">
                                <p @click.native.stop="eventSection('up', item, 'card')" class="text-caption text-decoration-underline">Monter</p>
                                <p @click.native.stop="eventSection('down', item, 'card')" class="text-caption text-decoration-underline">Descendre</p>
                                <p @click.native.stop="eventSection('delete', item, 'card')" class="text-caption text-decoration-underline">Supprimer</p>
                            </v-row>
                        </v-row>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre de la carte</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.title" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Description de la carte</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.text.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url de l'image</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="9">
                                        <v-text-field v-model="item.image.picture.desktopPicture.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                  v-model="item.image.picture.desktopPicture.extension" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte alternatif de l'image</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.image.picture.alt" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte du bouton</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.button.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url du bouton</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.url" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-btn variant="plain" color="primary" text="Ajouter une nouvelle carte" @click="tempSection.cards.cards.push(new Section().getEmptyElement(tempSection._type, 'card'))" />
            <!-- Sliders -->
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètres du slider</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H1 du slider</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.slider.titleH1.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H2 du slider</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.slider.titleH2.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url du titre H2 du slider</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.slider.titleH2.url" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H3 du slider</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.slider.titleH3.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url du titre H3 du slider</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.slider.titleH3.url" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Largeur des éléments</p>
                            </v-col>
                            <v-col cols="8">
                                <v-number-input v-model="tempSection.slider.slider.sizeItems" :reverse="false" controlVariant="default" label="" :hideInput="false" inset density="compact" variant="outlined" hide-details /> 
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-if="!tempSection.slider.slider.isSliderInsta" v-for="(item, index) in tempSection.slider.slider.items" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Élément n°{{ index + 1 }} - {{ item.content.title.text }}</h4>
                            <v-row class="ma-0 justify-end ga-2 pr-4 actions-section">
                                <p @click.native.stop="eventSection('up', item, 'slide')" class="text-caption text-decoration-underline">Monter</p>
                                <p @click.native.stop="eventSection('down', item,'slide')" class="text-caption text-decoration-underline">Descendre</p>
                                <p @click.native.stop="eventSection('delete', item, 'slide')" class="text-caption text-decoration-underline">Supprimer</p>
                            </v-row>
                        </v-row>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url de l'image</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="9">
                                        <v-text-field v-model="item.image.picture.desktopPicture.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                  v-model="item.image.picture.desktopPicture.extension" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Texte alternatif de l'image</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.image.picture.alt" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre de l'élément</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.title.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Description de l'élément</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce :id="'editor_slider' + index" :init="tinymceSectionsConfig" v-model="item.content.description.text" />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Contenu du bouton</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="item.content.button.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url du lien</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="8">
                                        <v-text-field v-model="item.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="4">
                                        <v-row class="ma-0 h-100 ga-2">
                                            <v-btn class="h-100" color="primary" text="Encoder" variant="tonal" size="small" @click="item.url = Buffer.from(item.url).toString('base64')" />
                                            <v-btn class="h-100 w-auto rounded-xl" color="primary" variant="tonal" size="small">
                                                <v-icon icon="mdi-help" />
                                                <v-tooltip activator="parent"
                                                           location="start">
                                                    {{ Buffer.from(item.url, 'base64').toString('utf-8') }}
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
            <v-btn v-if="tempSection.slider.slider.isInstaSlider !== true" variant="plain" color="primary" text="Ajouter une nouvelle image" @click="tempSection.slider.slider.items.push(new Section().getEmptyElement(tempSection._type, 'slide'))" />
            <v-card-actions>
                <v-btn color="primary" text="Annuler" size="small" @click="cancelSectionEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveSectionEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { useRoute } from "vue-router";
    import { ref, toRaw } from "vue";
    import { useHomepageStore } from "@/stores/homepage.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";
    import { Buffer } from "buffer";
    import { VNumberInput } from 'vuetify/labs/VNumberInput'

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

    sectionToEdit.value = sectionsStore.getSectionToEdit().content;
    tempSection.value = structuredClone(toRaw(sectionToEdit.value));

    function eventSection(event, item, type) {
        let root;

        if (type == "card") {
            root = tempSection.value.cards.cards;
        } else if (type == "slide") {
            root = tempSection.value.slider.slider.items;            
        }

        const itemIndex = root.findIndex(el => el.id == item.id);

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
            if (root.length == 1 && type !== "card") {
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
        if (tempSection.value.cards.cards.length > 0) {
            tempSection.value.cards.cards.forEach(card => {
                card.image.picture.mobilePicture = card.image.picture.desktopPicture;
                const encodedUrl = Buffer.from(card.content.url).toString('base64');
                card.content.button.encodedUrl = encodedUrl;
                card.image.url = encodedUrl;
            });
        }

        if (!tempSection.value.slider.slider.isInstaSlider) {
            tempSection.value.slider.slider.items.forEach(slide => {
                slide.image.picture.mobilePicture = slide.image.picture.desktopPicture
            });
        }

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
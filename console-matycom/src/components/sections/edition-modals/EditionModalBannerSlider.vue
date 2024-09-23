<template>
    <v-dialog width="80%">
        <v-card title="Édition du slider de bannières" class="px-2 pb-2" color="background">
            <v-expansion-panels>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètres de la section</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center">
                            <v-col cols="4">
                                <p>Durée de l'autoplay</p>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field v-model="tempSection.autoplayTimeout" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel v-for="(item, index) in tempSection.items" :key="index">
                    <template #title>
                        <v-row class="ma-0 align-center">
                            <h4>Bannière n°{{ index + 1 }} - {{ item.titleH1.text }}</h4>
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
                                <v-text-field v-model="item.titleH1.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center justify-center border-t">
                            <v-checkbox v-model="item.titleH1.hasShadow"
                                        color="primary"
                                        hide-details
                                        style="--v-medium-emphasis-opacity: 1;">
                                <template #label>
                                    <p>Ombre sur le titre H1 ?</p>
                                </template>
                            </v-checkbox>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Titre H2</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce :id="'editor_banner' + index" :init="tinymceSectionsConfig" v-model="item.titleH2.text" />
                            </v-col>
                        </v-row>
                        <v-row class="align-center justify-center border-t">
                            <v-checkbox v-model="item.titleH2.hasShadow"
                                        color="primary"
                                        hide-details
                                        style="--v-medium-emphasis-opacity: 1;">
                                <template #label>
                                    <p>Ombre sur le titre H2 ?</p>
                                </template>
                            </v-checkbox>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url du bouton</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="8">
                                        <v-text-field v-model="item.button.encodedUrl" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="4">
                                        <v-row class="ma-0 h-100 ga-2">
                                            <!-- Buffer permet de gérer l'encodage en base64 -->
                                            <v-btn class="h-100" color="primary" text="Encoder" variant="tonal" size="small" @click="item.button.encodedUrl = Buffer.from(item.button.encodedUrl).toString('base64')" />
                                            <v-btn class="h-100 w-auto rounded-xl" color="primary" variant="tonal" size="small">
                                                <v-icon icon="mdi-help" />
                                                <v-tooltip activator="parent"
                                                           location="start">
                                                    {{ Buffer.from(item.button.encodedUrl, 'base64').toString('utf-8') }}
                                                </v-tooltip>
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Type de bannière</p>
                            </v-col>
                            <v-col cols="8">
                                <v-radio-group v-model="item.type" inline hide-details @change="changeBannerType(item)">
                                    <v-radio color="primary" label="Plein" value="full" />
                                    <v-radio color="primary" label="Scindé" value="scind" />
                                    <v-radio color="primary" label="Asymétrique" value="asym" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-expansion-panels class="mt-4">
                            <v-expansion-panel v-for="(image, index) in item.desktopContent" :key="index" :title="'Contenu desktop n°' + (index + 1)">
                                <template #title>
                                    <h4>Contenu desktop n°{{index + 1}}</h4>
                                </template>
                                <template #text>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Type de contenu</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-radio-group v-model="image.isPicture" inline hide-details class="media-type">
                                                <v-radio color="primary" label="Image" :value="true" />
                                                <v-radio color="primary" label="Vidéo" :value="false" />
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Url du contenu</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="image.desktopUrl" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                    </v-row>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Texte alternatif</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="image.alt" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <template #title>
                                    <h4>Contenu mobile</h4>
                                </template>
                                <template #text>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Type de contenu</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-radio-group v-model="item.mobileContent.isPicture" inline hide-details class="media-type">
                                                <v-radio color="primary" label="Image" :value="true" />
                                                <v-radio color="primary" label="Vidéo" :value="false" />
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                    <v-row class="align-center border-t">
                                        <v-col cols="4">
                                            <p>Url du contenu</p>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="item.mobileContent.mobileUrl" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-btn variant="plain" color="primary" text="Ajouter une nouvelle bannière" @click="tempSection.items.push(new Section().getEmptyElement(tempSection._type));" />
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
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store.js";
    import { useSectionsStore } from "@/stores/sections.store.js";
    import { Buffer } from "buffer";

    import TinyMce from "@/components/tinymce/TinyMce.vue";
    import tinymceSectionsConfig from "@/data/tinymce.sections.config.js";

    import Section from "@/data/Section";

    const emit = defineEmits(["closeModal"])
    const route = useRoute();

    const homepageStore = useHomepageStore();
    const snackbarStore = useSnackbarStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const sectionsStore = useSectionsStore();
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

    function changeBannerType(item) {
        const newType = item.type;
        if (newType == "scind" && item.desktopContent.length == 1) {
            item.desktopContent.push(new Section().getEmptyElement("BannerSlider").desktopContent[0]);
        }

        if (newType == "full" && item.desktopContent.length == 2) {
            item.desktopContent.splice(1, 1);
        }

        if (newType == "asym" && item.desktopContent.length == 1) {
            const newEl = new Section().getEmptyElement("BannerSlider").desktopContent[0]
            // Quand asymétrique, l'image de droite est l'image au dimension mobile donc on lui force l'url de l'image identique à l'image mobile
            newEl.desktopUrl = new Section().getEmptyElement("BannerSlider").mobileContent.mobileUrl;
            item.desktopContent.push(newEl);
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
<template>
    <!-- Retain focus à false obligatoire, sinon vole le focus à tiny -->
    <v-dialog width="80%" :retain-focus="false">
        <v-card title="Édition de la section Image / Carte" class="px-2 pb-2" color="background">
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
                                <v-text-field v-model="tempSection.titleH2.text" density="compact" variant="outlined" hide-details />
                            </v-col>
                        </v-row>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Contenu de la description</p>
                            </v-col>
                            <v-col cols="8">
                                <tiny-mce id="editor" :init="tinymceSectionsConfig" v-model="tempSection.description.text" />
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètre de l'image</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Url de l'image desktop</p>
                            </v-col>
                            <v-col cols="8">
                                <v-row>
                                    <v-col cols="9">
                                        <v-text-field v-model="tempSection.image.picture.desktopPicture.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                  v-model="tempSection.image.picture.desktopPicture.extension" />
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
                                        <v-text-field v-model="tempSection.image.picture.mobilePicture.url" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                  v-model="tempSection.image.picture.mobilePicture.extension" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel>
                <v-expansion-panel>
                    <template #title>
                        <h4>Paramètre de la card</h4>
                    </template>
                    <template #text>
                        <v-row class="align-center border-t">
                            <v-col cols="4">
                                <p>Type de la carte</p>
                            </v-col>
                            <v-col cols="8">
                                <v-radio-group v-model="tempSection.typeCard" inline hide-details>
                                    <v-radio color="primary" label="Produit" value="ProductCard" />
                                    <v-radio color="primary" label="Simple" value="SimpleCard" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <slot v-if="tempSection.typeCard == 'ProductCard'">
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url de la card</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="8">
                                            <v-text-field v-model="tempSection.card.encodedUrl" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="4">
                                            <v-row class="ma-0 h-100 ga-2">
                                                <!-- Buffer permet de gérer l'encodage en base64 -->
                                                <v-btn class="h-100" color="primary" text="Encoder" variant="tonal" size="small" @click="tempSection.card.encodedUrl = Buffer.from(tempSection.card.encodedUrl).toString('base64')" />
                                                <v-btn class="h-100 w-auto rounded-xl" color="primary" variant="tonal" size="small">
                                                    <v-icon icon="mdi-help" />
                                                    <v-tooltip activator="parent"
                                                               location="start">
                                                        {{ Buffer.from(tempSection.card.encodedUrl, 'base64').toString('utf-8') }}
                                                    </v-tooltip>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url de l'image</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-row>
                                        <v-col cols="9">
                                            <v-text-field v-model="tempSection.card.picture.url" density="compact" variant="outlined" hide-details />
                                        </v-col>
                                        <v-col cols="3">
                                            <v-select label="extension" :items="['jpg', 'png', 'gif']" density="compact" variant="outlined" hide-details
                                                      v-model="tempSection.card.picture.extension" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Marque du produit</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.card.brand" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Titre du produit</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.card.title" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Prix de vente du produit</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.card.price.sellingPrice" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                            <v-row class="align-center justify-center border-t">
                                <v-checkbox v-model="tempSection.card.price.hasDiscount"
                                            color="primary"
                                            hide-details
                                            style="--v-medium-emphasis-opacity: 1;">
                                    <template #label>
                                        <p>Prix remisé ?</p>
                                    </template>
                                </v-checkbox>
                            </v-row>
                            <slot v-if="tempSection.card.price.hasDiscount">
                                <v-row class="align-center border-t">
                                    <v-col cols="4">
                                        <p>Montant de remise du produit</p>
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field v-model="tempSection.card.price.discountAmount" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                </v-row>
                                <v-row class="align-center border-t">
                                    <v-col cols="4">
                                        <p>Taux de remise du produit</p>
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field v-model="tempSection.card.price.discountRate" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                </v-row>
                                <v-row class="align-center border-t">
                                    <v-col cols="4">
                                        <p>Prix d'origine du produit</p>
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field v-model="tempSection.card.price.crossedOutPrice" density="compact" variant="outlined" hide-details />
                                    </v-col>
                                </v-row>
                            </slot>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Texte du bouton</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.card.button.text" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                        </slot>
                        <slot v-else-if="tempSection.typeCard == 'SimpleCard'">
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Titre H3</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.simpleCard.titleH3.text" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Contenu de la description</p>
                                </v-col>
                                <v-col cols="8">
                                    <tiny-mce id="editorSimpleCard" :init="tinymceSectionsConfig" v-model="tempSection.simpleCard.description.text" />
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Texte du bouton</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.simpleCard.button.text" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                            <v-row class="align-center border-t">
                                <v-col cols="4">
                                    <p>Url du bouton</p>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-model="tempSection.simpleCard.button.url" density="compact" variant="outlined" hide-details />
                                </v-col>
                            </v-row>
                        </slot>
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
    const tempSection = ref({});

    onMounted(() => {
        sectionToEdit.value = sectionsStore.getSectionToEdit().content;
        tempSection.value = structuredClone(toRaw(sectionToEdit.value));
    })

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
        z-index: 10
    }
</style>
<template>
    <v-expansion-panel ref="nestedElement" :id="element.id">
        <template #title>
            <v-row class="ma-0 align-center">
                <h4>{{ element.title }} <span class="text-caption" v-if="parent && element.depth > 0"> - Enfant de {{ parent.title }}</span></h4>
                <v-row class="ma-0 justify-end ga-2 pr-4 actions-element">
                    <v-btn v-if="parent" @click.native.stop="eventElement('left', element)" class="text-caption text-decoration-underline" size="x-small" variant="text"><v-icon icon="mdi-arrow-left-thin" /> Sortir</v-btn>
                    <v-btn v-if="element.depth < 2" @click.native.stop="eventElement('right', element)" class="text-caption text-decoration-underline" size="x-small" variant="text"><v-icon icon="mdi-arrow-right-bottom" /> Rentrer</v-btn>
                    <v-btn @click.native.stop="eventElement('up', element)" class="text-caption text-decoration-underline" size="x-small" variant="text"><v-icon icon="mdi-arrow-up-thin" /> Monter</v-btn>
                    <v-btn @click.native.stop="eventElement('down', element)" class="text-caption text-decoration-underline" size="x-small" variant="text"><v-icon icon="mdi-arrow-down-thin" /> Descendre</v-btn>
                    <v-btn @click.native.stop="eventElement('delete', element)" class="text-caption text-decoration-underline" size="x-small" variant="text"><v-icon icon="mdi-close" /> Supprimer</v-btn>
                </v-row>
            </v-row>
        </template>
        <template #text>
            <v-row class="align-center justify-center border-t" v-if="element.depth > 0">
                <v-checkbox v-model="element.newCol"
                            color="primary"
                            hide-details
                            style="--v-medium-emphasis-opacity: 1;">
                    <template #label>
                        <p>Nouvelle colonne ?</p>
                    </template>
                </v-checkbox>
            </v-row>
            <v-row class="align-center border-t">
                <v-col cols="4">
                    <p>Titre de l'élément</p>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="element.title" density="compact" variant="outlined" hide-details />
                </v-col>
            </v-row>
            <v-row class="align-center border-t">
                <v-col cols="4">
                    <p>Class HTML</p>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="element.class" density="compact" variant="outlined" hide-details />
                </v-col>
            </v-row>
            <v-row class="align-center border-t">
                <v-col cols="4">
                    <p>Url de l'élement</p>
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="element.url" density="compact" variant="outlined" hide-details />
                </v-col>
            </v-row>
            <v-row class="align-center justify-center border-t">
                <v-checkbox v-model="element.isEncoded"
                            color="primary"
                            hide-details
                            style="--v-medium-emphasis-opacity: 1;">
                    <template #label>
                        <p>Forcer l'encodage de l'élément ?</p>
                    </template>
                </v-checkbox>
            </v-row>
            <slot v-if="element.depth > 0">
                <v-row class="align-center justify-center border-t">
                    <v-checkbox v-model="element.customElement"
                                color="primary"
                                hide-details
                                style="--v-medium-emphasis-opacity: 1;">
                        <template #label>
                            <p>Personnaliser le contenu de l'élément ?</p>
                        </template>
                    </v-checkbox>
                </v-row>
            </slot>
            <slot v-if="element.customElement">
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Contenu HTML</p>
                    </v-col>
                    <v-col cols="8">
                        <tiny-mce :id="'editor' + element.id" :init="tinymceSectionsConfig" v-model="element.customHTML" />
                    </v-col>
                </v-row>
            </slot>
            <v-row class="align-center justify-center border-t" v-if="element.depth == 0">
                <v-checkbox v-model="element.hasMerch"
                            color="primary"
                            hide-details
                            style="--v-medium-emphasis-opacity: 1;">
                    <template #label>
                        <p>A une zone de merch ?</p>
                    </template>
                </v-checkbox>
            </v-row>
            <slot v-if="element.hasMerch">
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Url de l'image de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.imageUrl" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Texte alternatif de l'image de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.imageAlt" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Url de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.url" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Description de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.description" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Texte du bouton de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.button.text" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
                <v-row class="align-center border-t">
                    <v-col cols="4">
                        <p>Class HTML du bouton de la zone de merch</p>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="element.merchContent.button.class" density="compact" variant="outlined" hide-details />
                    </v-col>
                </v-row>
            </slot>
            <v-row>
                <nested-list :items="element.items" />
            </v-row>
            <slot v-if="element.depth < 2">
                <v-row class="mt-4" :class="[ element.items.length == 0 ? 'border-t': '' ]">
                    <v-btn variant="plain" color="primary" :text="'Ajouter un sous-élément à ' + element.title" class="mx-auto pt-1" @click="addElement(element)" />
                </v-row>
            </slot>
        </template>
    </v-expansion-panel>
</template>

<script setup>
    import { ref, nextTick } from "vue";

    import TinyMce from "@/components/tinymce/TinyMce.vue";
    import tinymceSectionsConfig from "@/data/tinymce.sections.config.js";

    import NestedList from "@/components/nav/nested-list/NestedList.vue";
    import { useAppStore } from "@/stores/app.store.js";
    import { useNavigationStore } from "@/stores/navigation.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import Navigation from "@/data/navigation.js";

    const appStore = useAppStore();
    const navigationStore = useNavigationStore();
    const snackbarStore = useSnackbarStore();

    const nestedElement = ref(null);

    const props = defineProps({
        element: Object,
    })

    const parent = navigationStore.getDirectParent(props.element.id);

    async function eventElement(event, item) {
        let arr;
        if (parent) {
            arr = parent.items;
        } else {
            arr = navigationStore.editNav.items;
        }

        const itemIndex = arr.findIndex(el => el.id == item.id);

        if (event == "up" || event == "down") {

            if ((event == "up" && itemIndex == 0) || (event == "down" && itemIndex == arr.length - 1)) {
                snackbarStore.showSnackbar({
                    message: "Vous ne pouvez pas déplacer l'élément dans cette direction",
                    color: "warning",
                    title: "Attention"
                });

                return;
            }

            const newIndex = event == "up" ? itemIndex - 1 : itemIndex + 1;

            arr.splice(itemIndex, 1);
            arr.splice(newIndex, 0, item);

            await nextTick(() => {
                const newParentElement = document.getElementById(item.id);
                newParentElement.querySelector(".v-expansion-panel-title").click();
            })
        }

        if (event == "left") {
            let grandParent = navigationStore.getDirectParent(parent.id);
            let gpArr;

            if (grandParent)
                gpArr = grandParent.items
            else
                gpArr = navigationStore.editNav.items;

            const parentIndex = gpArr.findIndex(el => el.id == parent.id);
            parent.items.splice(itemIndex, 1);
            item.depth--;
            gpArr.splice(parentIndex, 0, item);

        }

        if (event == "right") {
            if (!arr[itemIndex + 1]) {
                snackbarStore.showSnackbar({
                    message: "Vous ne pouvez pas rentrer un élément qui n'a pas d'élément frère",
                    color: "warning",
                    title: "Attention"
                });

                return;
            }

            arr.splice(itemIndex, 1);
            item.depth++;
            arr[itemIndex].items.splice(0, 0, item);
            const brotherId = arr[itemIndex].id;

            await nextTick(() => {
                const newParentElement = document.getElementById(brotherId);
                newParentElement.querySelector(".v-expansion-panel-title").click();
            })
        }

        if (event == "delete") {
            arr.splice(itemIndex, 1);
        }
    }

    function addElement(element) {
        const newElement = new Navigation();
        newElement.id = appStore.getUniqueId();
        newElement.depth = element.depth + 1;
        element.items.push(newElement);
    }
</script>

<style lang="scss" scoped>
    .actions-element {
        z-index: 10;
    }

    .v-expansion-panel {
        &.v-expansion-panel--active {
            border: solid 1px rgb(var(--v-theme-primary));
        }
    }
</style>

<style lang="scss">
    .actions-element {
        .v-btn {
            &__content {
                align-items: baseline !important;
            }
        }
    }
</style>
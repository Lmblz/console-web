<template>
    <v-card elevation="2" class="mt-n5 pt-3 pb-2 pl-2 position-sticky rounded-0 page-title">
        <template #title>
            Édition de la Navigation {{ nav.title }}
            <v-btn size="x-small" variant="plain" icon="mdi-pen" color="primary" @click="editMainInfos" />
        </template>
    </v-card>

    <div class="navigation pa-2">
        <nested-list :items="nav.items" />
        <v-row class="mt-2">
            <v-btn variant="plain" color="primary" text="Ajouter un nouvel élément" class="mx-auto pt-1" @click="addItem" />
        </v-row>    
    </div>

    <v-dialog class="edit-modal" v-model="showEditModal" max-width="500px">
        <v-card :title="nav.title">
            <v-row class="ma-0 mb-4 w-100 px-4 ga-2 flex-row align-center justify-space-between" v-for="(item, index) in editModalElements" :key="index">
                <p class="mb-1 edit-modal__param">{{ item.param }}</p>
                <slot v-if="item.type == 'text'">
                    <v-text-field class="edit-modal__value" v-model="item.value" density="compact" variant="outlined" hide-details />
                </slot>

                <slot v-else-if="item.type == 'date'">
                    <input type="datetime-local" v-model="item.value" class="px-4 py-2 v-field__input edit-modal__value" size="1" />
                </slot>

                <slot v-else-if="item.type == 'textarea'">
                    <v-textarea class="edit-modal__value" v-model="item.value" density="compact" variant="outlined" hide-details auto-grow rows="1" />
                </slot>
            </v-row>
            <v-card-actions>
                <v-btn color="primary" text="Annuler" size="small" @click="cancelNavigationEdition" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="saveNavigationEdition" />
            </v-card-actions>
        </v-card>
    </v-dialog>

    <bottom-menu :items="bottomMenuItems" @saveNavigationEvent="saveNavigation" @cancelNavigationEvent="cancelNavigation" />
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { useNavigationStore } from "@/stores/navigation.store.js";
    import NestedList from "@/components/nav/nested-list/NestedList.vue";
    import Navigation from "@/data/navigation.js";
    import * as NavigationService from "@/services/NavigationService.js";

    import BottomMenu from "@/components/common/bottom-menu/BottomMenu.vue";

    const navigationStore = useNavigationStore();
    const nav = ref({})
    const items = ref([]);
    const route = useRoute();
    const router = useRouter();
    const navId = route.params.id;

    const bottomMenuItems = [
        {
            text: "Annuler les modifications non enregistrées",
            variant: "plain",
            color: "danger",
            emit: "cancelNavigationEvent",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveNavigationEvent",
            icon: "mdi-content-save"

        }
    ];

    const showEditModal = ref(false); 

    const editModalElements = ref([
        {
            param: "Titre",
            key: "title",
            type: "text",
            value: ""
        },
        {
            param: "Date de publication",
            key: "datePublish",
            type: "date",
            value: "",
        }
    ]);

    onMounted(async () => {
        //items.value = navigationStore.getNavigationItems();
        await NavigationService.getNavigation(navId);
        nav.value = navigationStore.editNav;
    })

    function addItem() {
        const arr = navigationStore.list.find(el => el.id == navId).items;
        arr.push(new Navigation());
    }

    async function saveNavigation() {
        const success = await NavigationService.saveNavigation();
        if (success) router.push("/navigation");
    }

    function cancelNavigation() {
        nav.value = {};
        router.push("/navigation");
    }

    function editMainInfos() {
        // On vient récupérer les infos principales de la home et on les clone, permet de ne pas travailler directement sur l'objet principal
        editModalElements.value.forEach(el => {
            const property = nav.value[el.key];
            if (property) el.value = property;
        })

        showEditModal.value = true;
    }

    function cancelNavigationEdition() {
        // Si on annule les modifs, on vient réinitialiser les infos
        showEditModal.value = false;

        editModalElements.value.forEach(el => {
            el.value = "";
        })
    }

    function saveNavigationEdition() {
        // Si on enregistre, on vient remplacer les infos dans l'objet principale
        editModalElements.value.forEach(el => {
            nav.value[el.key] = el.value;
        })

        showEditModal.value = false;
    }
</script>

<style lang="scss">
    .page-title {
        z-index: 5;
        top: calc(var(--v-layout-top) - 20px);

        .v-card-item {
            padding: 0;
        }
    }
</style>
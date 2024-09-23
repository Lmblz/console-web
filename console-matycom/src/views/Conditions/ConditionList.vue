<template>
    <div class="conditions pa-2">
        <v-card class="mb-5 pb-1" :elevation="3">
            <v-card-title class="pb-0">
                <v-row class="ma-0 pb-2 justify-space-between">
                    Liste des {{ title }}
                    <v-btn size="small" color="primary" @click="addNewCondition">Ajouter une {{ title }}</v-btn>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :items="conditionItems" :disable-sort="true" style="overflow-x: auto"
                          :loading="conditionsLoading" density="comfortable" :hide-default-footer="true"
                          :hover="true">

                <template #item.datePublish="{ item }">
                    <b v-if="item.isActive">{{ new Date(item.datePublish).toLocaleString() }} - En cours</b>
                    <p v-else>{{ new Date(item.datePublish).toLocaleString() }}</p>
                </template>

                <template #item.dateDelete="{ item }">
                    <b v-if="item.isActive">{{ new Date(item.dateDelete).toLocaleString() }}</b>
                    <p v-else>{{ new Date(item.dateDelete).toLocaleString() }}</p>
                </template>

                <template #item.lastModified="{ item }">
                    <b v-if="item.isActive">{{ new Date(item.lastModified).toLocaleString() }}</b>
                    <p v-else>{{ new Date(item.lastModified).toLocaleString() }}</p>
                </template>

                <template #item.actions="{ item }">
                    <v-row class="ma-0 ga-1">
                        <action-button icon="mdi-pen" color="primary" :to="{ name: 'EditCondition', params: { id: item.id } }" />
                    </v-row>
                </template>

            </v-data-table>
        </v-card>
    </div>

    <bottom-menu :items="bottomMenuItems" @returnConditionEvent="router.push('/conditions')" @cancelConditionEvent="cancelConditionModifications" @saveConditionEvent="saveConditionModifications" />
</template>

<script setup>
    import { useRoute, useRouter } from "vue-router";
    import { ref, onMounted } from "vue";
    import { useConditionStore } from "@/stores/conditions.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import * as ConditionsService from "@/services/ConditionsService.js";
    import Condition from "@/data/Condition";

    import ActionButton from "@/components/common/data-table/ActionButton.vue";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";

    const conditionStore = useConditionStore();
    const snackbarStore = useSnackbarStore();

    const headers = [
        {
            title: "Date de publication",
            key: "datePublish",
            width: "30%",
        },
        {
            title: "Date de suppression",
            key: "dateDelete",
            width: "30%",
        },
        {
            title: "Dernière modification",
            key: "lastModified",
            width: "30%",
        },
        {
            title: "Actions",
            key: "actions",
        },
    ];

    const bottomMenuItems = [
        {
            text: "Retourner à la liste des conditions",
            variant: "plain",
            color: "primary",
            emit: "returnConditionEvent",
            icon: "mdi-keyboard-return"
        },
        {
            text: "Annuler les modifications",
            variant: "plain",
            color: "danger",
            emit: "cancelConditionEvent",
            icon: "mdi-cancel"
        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "saveConditionEvent",
            icon: "mdi-content-save"
        },
    ];

    const conditionsLoading = ref(true);
    const route = useRoute();
    const router = useRouter()
    const conditionItems = ref([]);
    const title = ref('');

    onMounted(async () => {
        let response;
        try {
            response = await ConditionsService.getConditionItems(route.params.condition);

            if (!response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Échec de la récupération",
                    color: "error",
                    message: "La récupération de la liste a échoué"
                })
            }
        } catch (error) {
            snackbarStore.showSnackbar({
                title: "Échec de la récupération",
                color: "error",
                message: "La récupération de la liste a échoué " + error
            })
        }

        conditionItems.value = response.data;
        title.value = conditionStore.getConditionTitle(route.params.condition);
        conditionsLoading.value = false;
    })

    async function addNewCondition() {
        const newConditionId = ConditionsService.addConditionItem(title.value, route.params.condition);
        let response;

        try {
            response = await ConditionsService.getConditionItems(route.params.condition);

            if (!response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Échec de la récupération",
                    color: "error",
                    message: "La récupération de la liste a échoué"
                })
            }
        } catch (error) {
            snackbarStore.showSnackbar({
                title: "Échec de la récupération",
                color: "error",
                message: "La récupération de la liste a échoué " + error
            })
        }

        conditionItems.value = response.data;

        router.push(newConditionId)
    }

    async function cancelConditionModifications() {
        conditionsLoading.value = true;
        ConditionsService.cancelConditionModifications(title.value);
        let response;

        try {
            response = await ConditionsService.getConditionItems(route.params.condition);

            if (!response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Échec de la récupération",
                    color: "error",
                    message: "La récupération de la liste a échoué"
                })
            }
        } catch (error) {
            snackbarStore.showSnackbar({
                title: "Échec de la récupération",
                color: "error",
                message: "La récupération de la liste a échoué " + error
            })
        }

        conditionItems.value = response.data;

        snackbarStore.showSnackbar({
            title: "Annulation réussie",
            color: "success",
            message: "Les modifications ont bien été annulées"
        })
        conditionsLoading.value = false;
    }

    async function saveConditionModifications() {
        conditionsLoading.value = true;

        try {
            const responseSave = await ConditionsService.saveConditionModifications(title.value, route.params.condition);
            const responsePdf = await ConditionsService.generatePdf(title.value);
            if (responseSave.isValid && responsePdf.isValid) {
                snackbarStore.showSnackbar({
                    title: "Enregistrement réussi",
                    color: "success",
                    message: "L'enregistrement des modifications des <b>" + title.value + "</b> et la génération du pdf est un succès"
                })
            } else {
                if (responseSave.isValid && !responsePdf.isValid) {
                    snackbarStore.showSnackbar({
                        title: "Génération du pdf échouée",
                        color: "warning",
                        message: "L'enregistrement des modifications des <b>" + title.value + "</b> a réussi mais la génération du pdf a échoué"
                    })

                    console.error(responsePdf.errorMessage);

                } else {
                    snackbarStore.showSnackbar({
                        title: "Erreur",
                        color: "error",
                        message: "L'enregistrement des <b>" + title.value + "</b> a échoué"
                    })

                    console.error(responseSave.statusText);
                    throw new Error(responseSave.statusText);
                }
            }
        } catch (e) {
            snackbarStore.showSnackbar({
                title: "Erreur",
                color: "error",
                message: "L'enregistrement des <b>" + title.value + "</b> a échoué"
            })

            console.error(e);
        }

        let response;

        try {
            response = await ConditionsService.getConditionItems(route.params.condition);

            if (!response.isValid) {
                snackbarStore.showSnackbar({
                    title: "Échec de la récupération",
                    color: "error",
                    message: "La récupération de la liste a échoué"
                })
            }
        } catch (error) {
            snackbarStore.showSnackbar({
                title: "Échec de la récupération",
                color: "error",
                message: "La récupération de la liste a échoué " + error
            })
        }

        conditionItems.value = response.data;
        conditionsLoading.value = false;

        router.push("/conditions")
    }
</script>
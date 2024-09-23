<template>
    <div class="conditions pa-2">
        <v-card class="mb-5 pb-1" :elevation="3">
            <v-card-title class="pb-0">
                Liste des pages modifiables
            </v-card-title>
            <v-data-table :headers="headers" :items="conditionsList" :disable-sort="true" style="overflow-x: auto"
                          :loading="conditionsLoading" density="comfortable" :hide-default-footer="true"
                          :hover="true">

                <template #item.title="{ item }">
                    <p data-column="title">{{ item.title }}</p>
                </template>

                <template #item.datePublish="{ item }">
                    <p>{{ new Date(item.datePublish).toLocaleString() }}</p>
                </template>

                <template #item.actions="{ item }">
                    <v-row class="ma-0 ga-1">
                        <action-button icon="mdi-pen" color="primary" :to="'/conditions/' + item.url + '/liste'" />
                    </v-row>
                </template>

            </v-data-table>
        </v-card>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import * as ConditionsService from "@/services/ConditionsService";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useConditionStore } from "@/stores/conditions.store.js";
    import { useAppStore } from "@/stores/app.store.js";
    import { getLastModificationDate } from "@/services/AppService.js";

    import ActionButton from "@/components/common/data-table/ActionButton.vue";

    const snackbarStore = useSnackbarStore();
    const conditionsStore = useConditionStore();
    const appStore = useAppStore();

    const headers = [
        {
            title: "Titre",
            key: "title",
            width: "90%",
        },
        {
            title: "Actions",
            key: "actions",
        },
    ];

    const bottomMenuItems = [
        {
            text: "Tout annuler",
            variant: "plain",
            color: "danger",
            emit: "cancel"
        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "save"
        },
    ];

    const conditionsLoading = ref(false);
    const conditionsList = ref([]);

    onMounted(async () => {
        // On initialise la date de connexion
        appStore.initializeConnectionDate("Conditions");

        // Récupère la dernière date de modification
        conditionsStore.lastModificationDate = await getLastModificationDate("Conditions");

        if (conditionsStore.lastModificationDate > appStore.user.connectionDates["Conditions"]) {
            snackbarStore.showSnackbar({
                title: "Conflit de version",
                color: "warning",
                message: `
                    Attention, votre version n'est pas à jour, une nouvelle version a été publiée à 
                    ${new Date(conditionsStore.lastModificationDate).toLocaleTimeString()} 
                    et votre session a démarré à ${new Date(appStore.user.connectionDates["Conditions"]).toLocaleTimeString()}
                `,
                button: {
                    text: "Récupérer la dernière version",
                    action: () => ConditionsService.getLastVersion()
                }
            })
        }

        // Récupère la dernière date de modification
        conditionsStore.lastModificationDate = await getLastModificationDate("Conditions");

        conditionsList.value = ConditionsService.getConditionsList();
    })
</script>
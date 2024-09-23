<template>
    <v-form @submit.prevent>
        <v-row class="ma-2 mb-6 justify-space-between ga-xs-4">
            <v-row class="ma-0" v-if="showSearch != false">
                <v-text-field :label="props.placeholder" variant="outlined" density="compact" v-model="search" class="mr-2" hide-details />
                <action-button type="submit" icon="mdi-magnify" title="Rechercher" @click="searchEvent" class="mr-1" />
                <action-button icon="mdi-restart" title="Supprimer la recherche" @click="resetEvent" />
            </v-row>
            <v-spacer class="d-xs-none" />
            <v-btn class="w-xs-100" :text="props.contentAdd" color="primary" @click="addEvent" />
        </v-row>
    </v-form>
</template>

<script setup>
    import { ref } from "vue";
    import ActionButton from "./ActionButton.vue";

    const search = ref('');

    const props = defineProps({
        placeholder: String,
        titleAdd: String,
        contentAdd: String,
        showSearch: {
            type: Boolean, 
            default: true
        }
    })

    const emit = defineEmits([
        "searchBtn",
        "resetBtn",
        "addBtn"
    ])

    // #region Emits
    function searchEvent() {
        emit('searchBtn', { search: search.value });
    }

    function resetEvent() {
        search.value = "";
        emit('resetBtn');
    }

    function addEvent() {
        emit('addBtn');
    }
    // #endregion
</script>

<script>
    export default {
        name: 'SearchAdd',
        props: [
            'titleAdd',
            'contentAdd'
        ]
    }
</script>
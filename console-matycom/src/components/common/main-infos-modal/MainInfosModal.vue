<template>
    <v-dialog class="edit-modal" max-width="500px">
        <v-card :title="title">
            <v-row class="ma-0 mb-4 w-100 px-4 ga-2 flex-row align-center justify-space-between" v-for="(item, index) in items" :key="index">
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
                <v-btn color="primary" text="Annuler" size="small" @click="throwCancelEvent" />
                <v-btn color="primary" text="Enregistrer" size="small" variant="elevated" @click="throwSaveEvent" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    const props = defineProps({
        items: Array,
        title: String
    })

    const emit = defineEmits(['cancel', 'save'])

    function throwCancelEvent() {
        emit('cancel', props.items);
    }

    function throwSaveEvent() {
        emit('save', props.items);
    }
</script>

<style lang="scss">
    .edit-modal {
        &__param {
            width: 150px;
        }

        &__value {
            width: 310px !important;
        }
    }
</style>
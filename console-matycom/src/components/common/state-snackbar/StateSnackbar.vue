<template>
    <v-snackbar location="top right"
                variant="flat"
                max-width="600px"
                class="state-snackbar"
                :timeout="timeout">
        <template v-slot:actions>
            <v-btn icon="mdi-close" @click="closeSnackbarEvent" />
        </template>
        <h3>{{ title }}</h3>
        <p v-html="message"></p>
        <v-btn class="mt-2" size="small" v-if="button" @click="button.action" :text="button.text" variant="flat" block />
    </v-snackbar>
</template>

<script setup>
    const props = defineProps({
        title: String,
        message: String,
        button: Object,
        timeout: {
            type: String,
            default: "5000"
        },
    });

    const emit = defineEmits(["closeSnackbarEvent"])

    function closeSnackbarEvent() {
        emit('closeSnackbarEvent')
    }
</script>

<style lang="scss">
    .state-snackbar {
        a {
            color: inherit;
        }
    }
</style>
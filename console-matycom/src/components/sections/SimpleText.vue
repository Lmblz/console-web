<template>
    <div class="text__wrapper">
        <h1 v-if="contentData.titleH1 && contentData.titleH1.text !== ''">{{ contentData.titleH1.text }}</h1>
        <h2 v-if="contentData.titleH2 && contentData.titleH2.text !== ''">{{ contentData.titleH2.text }}</h2>
        <h3 v-if="contentData.titleH3 && contentData.titleH3.text !== ''">{{ contentData.titleH3.text }}</h3>
        <div class="text__content" v-html="contentData.description.text">
        </div>
        <a v-if="contentData.button.text !== ''" :href="contentData.button.url" :class="contentData.button.class" class="-center">{{ contentData.button.text }}</a>
    </div>

    <slot v-if="showModal">
        <edition-modal-simple-text v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalSimpleText from "@/components/sections/edition-modals/EditionModalSimpleText.vue";

    const props = defineProps({
        contentData: Object,
        showEditModal: Boolean
    })
    const emit = defineEmits([
        "onCloseModal",
    ])
    const showModal = ref(false);

    watch(() => props.showEditModal, (newValue, oldValue) => {
        newValue == true ? showModal.value = true : showModal.value = false;
    })

    watch(() => showModal.value, (newValue, oldValue) => {
        if (newValue == false) emit("onCloseModal");
    })

    function closeModal() {
        emit('onCloseModal');
    }
</script>

<style lang="scss">
    .simple-text {
        margin-left: auto !important;
        margin-right: auto !important;
    }
</style>
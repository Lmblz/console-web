<template>
    <h2>{{ contentData.description.title }}</h2>
    <h3>{{ contentData.merchandisingActionCode }}</h3>

    <slot v-if="showModal">
        <edition-modal-products-slider v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalProductsSlider from "@/components/sections/edition-modals/EditionModalProductsSlider.vue";

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
    section.products-slider {
        text-align: center;
    }    
</style>
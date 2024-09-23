<template>
    <div v-html="contentData.html"></div>

    <slot v-if="showModal">
        <edition-modal-raw-html v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalRawHtml from "@/components/sections/edition-modals/EditionModalRawHtml.vue";

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
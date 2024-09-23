<template>
    <div class="entries-list__wrapper">
        <div class="entries-list__item" v-for="(item, index) in contentData.entries">
            <a href="/bijoux/bagues.html" :class="item.class" data-mastertag="" data-trigger="autopromo" data-options="action_type:link;zone:search-highlights-bague">
                <p><b>{{item.text}}</b></p>
            </a>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-entries-list v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalEntriesList from "@/components/sections/edition-modals/EditionModalEntriesList.vue";

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
    .entries-list {
        height: inherit !important;

        .entries-list__wrapper {
            flex-wrap: wrap;
            gap: 1rem;
            overflow: hidden !important;
        }
    }
</style>
<template>
    <div class="simple-listing__wrapper">
        <h2 v-if="contentData.title.text !== ''">{{ contentData.title.text }}</h2>
        <div class="simple-listing__content">
            <div class="content__item" v-for="(item, index) in contentData.content">
                <div class="item__title">
                    <h3 v-if="item.title.text !== ''">{{ item.title.text }}</h3>
                </div>
                <div class="item__content">
                    <p v-html="item.description.text"></p>
                </div>
                <div class="item__image">
                    <img v-if="item.picture.desktopPicture !== null && item.picture.desktopPicture.url !== ''" :src="'https://preprod.maty.com' + item.picture.desktopPicture.url + '.' + item.picture.desktopPicture.extension" />
                </div>
            </div>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-simple-listing v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalSimpleListing from "@/components/sections/edition-modals/EditionModalSimpleListing.vue";

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
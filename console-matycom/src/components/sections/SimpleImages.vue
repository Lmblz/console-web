<template>
    <h2>{{ contentData.title.text }}</h2>
    <p v-html="contentData.description.text"></p>
    <div class="simple-images__wrapper">
        <div class="simple-images__item" v-for="(item, index) in contentData.images">
            <picture>
                <img :src="'https://preprod.maty.com' + item.picture.desktopPicture.url + '.' + item.picture.desktopPicture.extension" :width="item.picture.desktopPicture.width" :height="item.picture.desktopPicture.height" />
            </picture>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-simple-images v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalSimpleImages from "@/components/sections/edition-modals/EditionModalSimpleImages.vue";

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
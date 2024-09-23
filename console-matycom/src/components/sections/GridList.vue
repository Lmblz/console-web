<template>
    <h2 v-if="contentData.title !== null">{{ contentData.title.text}}</h2>
    <div class="grid-list__wrapper">
        <div class="grid-list__item" v-for="(item, index) in contentData.grids">
            <div class="item__image">
                <img :src="'https://preprod.maty.com' + item.image.picture.desktopPicture.url + '.' + item.image.picture.desktopPicture.extension" :width="item.image.picture.desktopPicture.width" :height="item.image.picture.desktopPicture.height" style="width: 100%;" />
            </div>
            <div class="item__content">
                <div class="content__main-infos">
                    <a class="text-decoration-none" :href="'https://www.maty.com' + item.content.url">
                        <h3 v-html="item.content.title"></h3>
                    </a>
                </div>
                <div v-if="item.content.urlMoreInfo !== ''" class="content__secondary-infos">
                    <p>
                        <span>En savoir plus !</span>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-grid-list v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalGridList from "@/components/sections/edition-modals/EditionModalGridList.vue";

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
    .grid-list {
        h3 {
            
    }
}
</style>
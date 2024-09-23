<template>
    <div class="banner__wrapper">
        <h1 v-if="contentData.title">{{contentData.title.text}}</h1>
        <div class="banner__media" :class="{'-shadow': contentData.content !== null}">
            <picture>
                <img :src="'https://preprod.maty.com' + contentData.picture.desktopPicture.url + '.' + contentData.picture.desktopPicture.extension" />
            </picture>

            <div v-if="contentData.content" class="media__overlay-text">
                <div class="overlay-text__wrapper">
                    <h2>
                        {{contentData.content.titleH2.text}}
                    </h2>
                    <p v-html="contentData.content.description.text"></p>
                    <a v-if="contentData.content.button.text !== ''" :href="contentData.content.button.url" :class="contentData.content.button.class">
                        {{contentData.content.button.text}}
                    </a>
                </div>
            </div>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-banner-media v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalBannerMedia from "@/components/sections/edition-modals/EditionModalBannerMedia.vue";

    const props = defineProps({
        contentData: Object,
        showEditModal: Boolean
    })

    const emit = defineEmits([
        "onCloseModal",
    ])
    const showModal = ref(false);
    const slider = ref(null);

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
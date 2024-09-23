<template>
    <div class="grid-pictures__wrapper">
        <h2 v-if="contentData.titleH2.text != ''">{{ contentData.titleH2.text }}</h2>
        <div class="grid-pictures__content">
            <div class="content__row" :class="{'-reverse': index%2!==0}, '-' + item.mediaFormat.toLowerCase()" v-for="(item, index) in contentData.items" :key="index">
                <div class="row__item -image">
                    <div class="item__wrapper">
                        <img v-if="item.mediaType == 'Picture'" :src="'https://preprod.maty.com' + item.picture.desktopPicture.url + '.' + item.picture.desktopPicture.extension" />
                        <video v-else-if="item.mediaType == 'Video'" autoplay muted :src="'https://preprod.maty.com' + item.video.desktopVideo.url + '.' + item.video.desktopVideo.extension" :poster="'https://preprod.maty.com' + item.video.desktopVideo.poster.url + '.' + item.video.desktopVideo.poster.extension" />
                    </div>
                </div>
                <div class="row__item -description">
                    <div class="item__wrapper">
                        <div class="item__content">
                            <h3 v-if="item.title">{{item.title.text}}</h3>
                            <p v-if="item.description" v-html="item.description.text"></p>
                            <div class="content__buttons">
                                <span v-for="(button, index) in item.buttons" :key="index" class="fbo" :class="button.class" data-href="button.encodedUrl"><b v-html="button.text"></b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-grid-pictures v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalGridPictures from "@/components/sections/edition-modals/EditionModalGridPictures.vue";

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
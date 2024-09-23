<template>
    <div class="partners__wrapper">
        <h2>{{ contentData.title.text }}</h2>
        <div class="partners__logo">
            <div class="logo__wrapper">
                <div class="logo__item" v-for="(item, index) in contentData.items">
                    <div class="item__image">
                        <picture>
                            <img :src="'https://preprod.maty.com' + item.logo.picture.desktopPicture.url + '.' + item.logo.picture.desktopPicture.extension" :width="item.logo.picture.desktopPicture.width" :height="item.logo.picture.desktopPicture.height" />
                        </picture>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <slot v-if="showModal">
        <edition-modal-partners v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalPartners from "@/components/sections/edition-modals/EditionModalPartners.vue";

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
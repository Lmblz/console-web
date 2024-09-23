<template>
    <div class="subesctions-entries__wrapper" v-for="(item, index) in contentData.entries" :class="[ index == 0 ? '-active' : '' ]" ref="subsections">
        <div class="subsections-entries__titles disable_scrollbars">
            <div class="titles__item">
                <h2>{{ item.title.text }}</h2>
            </div>
        </div>
        <div class="subsections-entries__content">
            <div class="content__item -active" :data-subsection="index + 1">
                <div class="item__wrapper">
                    <article v-for="(category, index) in item.content.items">
                        <picture>
                            <img :src="'https://preprod.maty.com' + category.picture.desktopPicture.url + '.' + category.picture.desktopPicture.extension" alt="" />
                        </picture>
                        <h3>{{ category.title }}</h3>
                    </article>
                </div>
            </div>
        </div>
    </div>

    <div class="slider-actions">
        <v-btn variant="elevated" icon="mdi-chevron-left" class="owl-prev position-absolute" @click="changeSlide('prev')" />
        <v-btn variant="elevated" icon="mdi-chevron-right" class="owl-next position-absolute" @click="changeSlide('next')" />
    </div>

    <slot v-if="showModal">
        <edition-modal-subsections-entries v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalSubsectionsEntries from "@/components/sections/edition-modals/EditionModalSubsectionsEntries.vue";

    const props = defineProps({
        contentData: Object,
        showEditModal: Boolean
    })
    const emit = defineEmits([
        "onCloseModal",
    ])
    const showModal = ref(false);
    const subsections = ref(null);

    watch(() => props.showEditModal, (newValue, oldValue) => {
        newValue == true ? showModal.value = true : showModal.value = false;
    })

    watch(() => showModal.value, (newValue, oldValue) => {
        if (newValue == false) emit("onCloseModal");
    })

    function closeModal() {
        emit('onCloseModal');
    }

    function changeSlide(direction) {
        let activeSubsection;
        let activeIndex;
        let nextIndex;

        subsections.value.forEach((subsection, index) => {
            if (subsection.classList.contains("-active")) {
                subsection.classList.remove("-active");
                activeIndex = index;
                activeSubsection = subsection;
                return;
            }
        })

        if (direction == "next") {
            if (activeIndex == subsections.value.length - 1) {
                nextIndex = 0;
            } else {
                nextIndex = activeIndex + 1;
            }
        } else if (direction == "prev") {
            if (activeIndex == 0) {
                nextIndex = subsections.value.length - 1;
            } else {
                nextIndex = activeIndex - 1;
            }
        }

        subsections.value.forEach((subsection, index) => {
            if (index == nextIndex) {
                subsection.classList += ' -active'
            } else {
                subsection.classList = 'subesctions-entries__wrapper'
            }
        })
    }
</script>

<style lang="scss">
    .subsections-entries {
        .subesctions-entries__wrapper {
            &:not(.-active) {
                display: none !important;
            }
        }
    }
</style>
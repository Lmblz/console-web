<template>
    <div class="banner-slider__wrapper owl-loaded owl-theme" ref="slider">
        <div class="banner-slider__item" v-for="(item, index) in contentData.items">
            <div class="item__description">
                <h1 class="-white" :class="[ item.titleH1.hasShadow ? '-shadow': '' ]">{{ item.titleH1.text }}</h1>
                <h2 class="-white" :class="[ item.titleH2.hasShadow ? '-shadow': '' ]" v-html="item.titleH2.text"></h2>
                <a :class="item.button.class">{{ item.button.text }}</a>
            </div>
            <div class="-desktop" v-for="(content, index) in item.desktopContent">
                <div class="item__content" :class="[ content.isPicture ? '-picture' : '-video']">
                    <picture v-if="content.isPicture == true || content.isPicture == 'true'">
                        <img class="" :src="'https://preprod.maty.com' + content.desktopUrl + '.jpg'" alt="" width="1920" height="500">
                    </picture>
                    <video v-else class="" autoplay="" muted="" loop="" playsinline="" data-poster="" data-mobile-poster="" poster="">
                        <source :src="'https://preprod.maty.com' + content.desktopUrl + '.mp4'" type="video/mp4">
                    </video>
                </div>
            </div>
        </div>
    </div>

    <div class="banner-slider__controls">
        <div class="controls__wrapper">
            <a href="#" aria-label="Controls image slider" class="controls__play-pause" data-state="play"></a>
            <div class="controls__prev-next">
                <div class="prev"></div>
                <div class="next"></div>
            </div>
        </div>
    </div>

    <div class="slider-actions">
        <v-btn variant="elevated" icon="mdi-chevron-left" class="owl-prev position-absolute" @click="changeSlide('prev')" />
        <v-btn variant="elevated" icon="mdi-chevron-right" class="owl-next position-absolute" @click="changeSlide('next')" />
    </div>

    <slot v-if="showModal">
        <edition-modal-banner-slider v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalBannerSlider from "@/components/sections/edition-modals/EditionModalBannerSlider.vue";

    // On récupère la data via props
    const props = defineProps({
        contentData: Object,
        showEditModal: Boolean
    })

    const emit = defineEmits([
        "onCloseModal",
    ])

    const showModal = ref(false);
    const slider = ref(null);

    // L'affichage est géré depuis EditHpView.vue et on fait passer l'état dans une props alors on met un watcher dessus
    watch(() => props.showEditModal, (newValue, oldValue) => {
        newValue == true ? showModal.value = true : showModal.value = false;
    })

    // La fermeture de la modal est géré dans la vue de la section, alors on emit pour remonter vers EditHpView.vue
    watch(() => showModal.value, (newValue, oldValue) => {
        if (newValue == false) emit("onCloseModal");
    })

    function closeModal() {
        emit('onCloseModal');
    }

    // Fonction pour changer de slide (on retrouve dans plusieurs sections, chacune est adaptée)
    function changeSlide(direction) {
        let distanceToScroll = slider.value.children[0].offsetWidth;
        let scrolledDistance = slider.value.scrollLeft;

        direction === "next"
            ? slider.value.scroll(distanceToScroll + scrolledDistance, 0)
            : slider.value.scroll(scrolledDistance - distanceToScroll, 0)
    }
</script>

<style lang="scss" scoped>
    .banner-slider__wrapper {
        display: flex;
        overflow: hidden;

        .item__content {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
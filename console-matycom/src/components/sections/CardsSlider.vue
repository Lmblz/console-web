<template>
    <div class="cards-slider__wrapper" :class="[ !contentData.cards || contentData.cards.cards.length == 0 ? '-no-cards': '' ]">
        <div class="cards-slider__cards" v-if="contentData.cards.cards.length > 0">
            <span class="-title-h2">{{ contentData.cards.title.text }}</span>
            <div class="cards__wrapper">
                <div class="cards__item" v-for="(item, index) in contentData.cards.cards" ref="cards">
                    <div class="item__image">
                        <picture>
                            <img :src="'https://preprod.maty.com' + item.image.picture.desktopPicture.url + '.' + item.image.picture.desktopPicture.extension" />
                        </picture>
                    </div>
                    <div class="item__content">
                        <div class="content__wrapper">
                            <a class="-title-h3">{{ item.content.title }}</a>
                            <p v-html="item.content.text.text"></p>
                            <a class="button -black -bgtransparent -big"><p><b v-html="item.content.button.text"></b></p></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cards-slider__slider">
            <h1 v-if="contentData.slider.titleH1 && contentData.slider.titleH1.text !== ''" v-html="contentData.slider.titleH1.text"></h1>
            <div style="display: flex; gap: .3125rem; justify-content: center;"><img v-if="contentData.slider.logo !== ''" :src="'https://www.maty.com' + contentData.slider.logo + '.png'" /><h2 v-if="contentData.slider.titleH2.text !== ''" v-html="contentData.slider.titleH2.text"></h2></div>
            <h3 v-if="contentData.slider.titleH3 && contentData.slider.titleH3.text !== ''" v-html="contentData.slider.titleH3.text"></h3>

            <div class="slider__wrapper" style="display: flex;" v-if="!contentData.slider.slider.isInstaSlider" ref="slider">
                <article class="slider__item" v-for="(item, index) in contentData.slider.slider.items" ref="slides">
                    <div class="item__image">
                        <div class="image__primary">
                            <picture>
                                <img :src="'https://preprod.maty.com' + item.image.picture.desktopPicture.url + '.' + item.image.picture.desktopPicture.extension" :width="item.image.picture.desktopPicture.width" :height="item.image.picture.desktopPicture.height" />
                            </picture>
                        </div>
                    </div>
                    <div class="item__content">
                        <h3>{{ item.content.title.text }}</h3>
                        <p v-html="item.content.description.text"></p>
                        <a :class="item.content.button.class" v-html="item.content.button.text"></a>
                    </div>
                </article>
            </div>
            <div v-else>
                <div class="instagram-feed-backup">
                    <img class="" src="https://www.maty.com/images/Instagram/hp-bloc-instagram-backup.jpg" alt="">
                </div>
            </div>
        </div>
    </div>

    <div class="slider-actions -cards">
        <v-btn variant="elevated" icon="mdi-chevron-left" class="owl-prev position-absolute" @click="changeSlide('prev')" />
        <v-btn variant="elevated" icon="mdi-chevron-right" class="owl-next position-absolute" @click="changeSlide('next')" />
    </div>

    <slot v-if="showModal">
        <edition-modal-cards-slider v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch, onMounted } from "vue";

    import EditionModalCardsSlider from "@/components/sections/edition-modals/EditionModalCardsSlider.vue";

    const props = defineProps({
        contentData: Object,
        showEditModal: Boolean
    })
    const emit = defineEmits([
        "onCloseModal",
    ])
    const showModal = ref(false);
    const slides = ref(null);
    const slider = ref(null);
    const cards = ref(null)

    watch(() => props.showEditModal, (newValue, oldValue) => {
        newValue == true ? showModal.value = true : showModal.value = false;
    })

    watch(() => showModal.value, (newValue, oldValue) => {
        if (newValue == false) emit("onCloseModal");
    })

    onMounted(() => {
        if (cards.value) {
            const nbCards = cards.value.length;
            let zIndex = nbCards;
            cards.value.forEach((card) => {
                card.style.zIndex = zIndex;
                zIndex--;
            })
        }
    })

    function closeModal() {
        emit('onCloseModal');
    }

    function changeSlide(direction) {
        if (cards.value) {
            // On change le zIndex des cartes pour les faire passer les unes devant les autres
            // magie vaudou qui fonctionne
            const activeCardIndex = cards.value.findIndex(el => el.style.zIndex == cards.value.length);
            let nextCardIndex;

            if (direction == "next") {
                if (activeCardIndex == cards.value.length - 1) {
                    nextCardIndex = 0;
                } else {
                    nextCardIndex = activeCardIndex + 1;
                }
            } else if (direction == "prev") {
                if (activeCardIndex == 0) {
                    nextCardIndex = cards.value.length - 1;
                } else {
                    nextCardIndex = activeCardIndex - 1;
                }
            }

            cards.value.forEach((card, index) => {
                if (index == nextCardIndex) {
                    card.style.zIndex = cards.value.length
                } else {
                    card.style.zIndex = 0
                }
            })
        }

        // Si c'est un slider insta, on va pas naviguer dans le slider
        if (!props.contentData.slider.slider.isInstaSlider) {
            let distanceToScroll = slider.value.children[0].offsetWidth;
            let scrolledDistance = slider.value.scrollLeft;

            direction === "next"
                ? slider.value.scroll(distanceToScroll + scrolledDistance + 50, 0)
                : slider.value.scroll(scrolledDistance - distanceToScroll, 0)
        }
    }
</script>

<style lang="scss">
    .slider__wrapper {
    overflow: hidden;
    }
</style>
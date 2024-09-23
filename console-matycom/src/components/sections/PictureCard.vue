<template>
    <div class="picture-card__wrapper">
        <h2>{{ contentData.titleH2.text }}</h2>
        <p v-html="contentData.description.text"></p>

        <div class="picture-card__items">
            <div class="items__picture">
                <div class="simple-images__item -image" data-href="" data-mastertag="" data-trigger="autopromo" data-options="action_type:link;zone:banner-0">
                    <img :src="'https://preprod.maty.com' + contentData.image.picture.desktopPicture.url + '.' + contentData.image.picture.desktopPicture.extension" />
                </div>
            </div>
            <div class="items__card" :class="'-' + contentData.typeCard.toLowerCase()">
                <slot v-if="contentData.typeCard == 'ProductCard'">
                    <div class="item__image">
                        <picture>
                            <img :src="contentData.card.picture.url + '.' + contentData.card.picture.extension" width="250" height="250" />
                        </picture>
                    </div>
                    <div class="item__content">
                        <p class="title">{{ contentData.card.brand }}</p>
                        <p class="name">
                            {{ contentData.card.title }}
                        </p>

                        <div v-if="contentData.card.price.crossedOutPrice > 0 && contentData.card.price.hasDiscount" class="content__bottom -has-promo">
                            <p class="discount">-{{ contentData.card.price.discountRate }}%</p>
                            <p class="crossedout">{{ contentData.card.price.crossedOutPrice }}€</p>
                            <p class="price">{{ contentData.card.price.sellingPrice }}€</p>
                        </div>

                        <div v-else class="content__bottom">
                            <p class="price">{{ contentData.card.price.sellingPrice }}€</p>
                        </div>

                        <a v-if="contentData.card.button && contentData.card.button.text !== ''" class="button -black -bgtransparent -fw fbo">
                            <b>{{ contentData.card.button.text }}</b>
                        </a>
                    </div>
                </slot>
                <slot v-else-if="contentData.typeCard == 'SimpleCard'">
                    <div class="item__content">
                        <h3>{{ contentData.simpleCard.titleH3.text }}</h3>
                        <p v-html="contentData.simpleCard.description.text"></p>
                        <a :class="contentData.simpleCard.button.class">{{ contentData.simpleCard.button.text }}</a>
                    </div>
                </slot>
            </div>
        </div>
    </div>
    <slot v-if="showModal">
        <edition-modal-picture-card v-model="showModal" v-bind="$attrs" @closeModal="closeModal" />
    </slot>
</template>

<script setup>
    import { ref, watch } from "vue";

    import EditionModalPictureCard from "@/components/sections/edition-modals/EditionModalPictureCard.vue";

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

<style lang="scss">
    // Supprimer après passage en prod
    section {
        &.picture-card {
            text-align: center;
            padding: 0 6.25rem;
            display: flex;
            flex-direction: column;

            .picture-card__wrapper {
                & > h2,
                & > p {
                    padding: 0 1.25rem;
                }

                & > p {
                    margin: 1.5625rem auto;
                }

                .picture-card__items {
                    display: flex;
                    gap: 1rem;

                    .items__picture {
                        .simple-images__item {
                            height: 100%;

                            img {
                                height: 100%;
                                width: 100%;
                                object-fit: cover;
                            }
                        }
                    }

                    .items__card {
                        width: 20.625rem;
                        background: white;
                        padding: 1.25rem 1.875rem;
                        box-shadow: 0 3px 6px #00000016;

                        .item__image {
                            height: 270px;
                            width: 270px;
                        }

                        .item__content {
                            text-align: left;

                            a {
                                text-decoration: none;
                            }

                            .name {
                                min-height: 2.5rem;
                            }

                            .content__bottom {
                                margin-top: 1rem;
                                height: 2.5rem;

                                .price {
                                    font-weight: bold;
                                    font-size: 1.125rem;
                                }

                                &:not(.-has-promo) {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: flex-end;
                                }

                                &.-has-promo {
                                    display: grid;
                                    grid-template-rows: 1fr 1fr;
                                    grid-template-columns: 2.5rem auto;
                                    column-gap: 0.625rem;

                                    .discount {
                                        grid-column: 1/2;
                                        grid-row: 1/3;
                                        align-self: center;
                                        background: #333;
                                        height: 2.5rem;
                                        width: 2.5rem;
                                        border-radius: 50%;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        color: white;
                                        font-weight: bold;
                                    }

                                    .crossedout {
                                        text-decoration: line-through;
                                    }
                                }
                            }

                            .button {
                                margin-top: .875rem !important;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
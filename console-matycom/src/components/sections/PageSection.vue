<template>
    <section :class="data.class" :id="data.id">
        <!-- Voir commentaires dans BannerSlider.vue -->
        <component :is="components[data.name]" :contentData="data.content" :showEditModal="showModal" @onCloseModal="closeModal" />
    </section>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";

    import BannerMedia from "./BannerMedia.vue";
    import BannerSlider from "./BannerSlider.vue";
    import CardsSlider from "./CardsSlider.vue";
    import EntriesList from "./EntriesList.vue";
    import SimpleText from "./SimpleText.vue";
    import GridList from "./GridList.vue";
    import Partners from "./Partners.vue";
    import SimpleImages from "./SimpleImages.vue";
    import SubsectionsEntries from "./SubsectionsEntries.vue";
    import ProductsSliderSection from "./ProductsSlider.vue";
    import RawHtml from "./RawHtml.vue";
    import GridPictures from "./GridPictures.vue";
    import SimpleListing from "./SimpleListing.vue";
    import PictureCard from "./PictureCard.vue";

    // Obligé de déclarer les composants, sinon se met en erreur
    const components = {
        BannerMedia,
        BannerSlider,
        CardsSlider,
        EntriesList,
        SimpleText,
        GridList,
        GridPictures,
        Partners,
        SimpleImages,
        SubsectionsEntries,
        ProductsSliderSection,
        RawHtml,
        SimpleListing,
        PictureCard
    }

    // On récupère les datas de chaque section par props dans EditHpView.vue
    const props = defineProps({
        data: Object,
        showModal: Boolean,
    })

    const emit = defineEmits([
        "onCloseModal",
    ])

    // Quand on récupère l'evt onCloseModal, on emit au parent le même evt
    // permet de maintenir à jour l'objet showSectionModal
    function closeModal() {
        emit("onCloseModal");
    }
</script>

<style lang="scss">
    .slider-actions {
        // Obligé de rappeler certains styles pour overwrite le style de matycom
        button.v-btn[type=button] {
            width: calc(var(--v-btn-height) + 12px) !important;
            height: calc(var(--v-btn-height) + 12px) !important;
            padding: 0px !important;
            padding-left: 0px !important;
            z-index: 9999;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            &.owl-next {
                right: 10px;
            }

            &.owl-prev {
                left: 10px;
            }
        }
    }
</style>
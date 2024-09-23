<template>
    <v-card elevation="2" class="mt-n5 pt-3 pb-2 pl-2 position-sticky ounded-0 page-title">
        <template #title>
            <span class="text-caption">
                {{ condition.title }} du {{ new Date(condition.datePublish).toLocaleString() }} au {{ new Date(condition.dateDelete).toLocaleString() }}
            </span>
            <v-btn size="x-small" variant="plain" icon="mdi-pen" color="primary" @click="editMainInfos" />
        </template>
    </v-card>
    <div class="condition pa-2">
        <p class="my-4">Dernière modification, le {{ new Date(condition.lastModified).toLocaleString() }}</p>

        <tiny-mce id="content"  v-model="condition.content" :init="tinymceConditionConfig" />
    </div>

    <main-infos-modal :items="editModalElements" :title="condition.title" v-model="showEditModal" @cancel="cancelMainInfosEdition" @save="saveMainInfosEdition" />

    <bottom-menu :items="bottomMenuItems" @cancel="cancelAllModifications" @save="saveAllModifications" />

</template>

<script setup>
    import { useRoute, useRouter } from "vue-router";
    import { ref, onMounted } from "vue";
    import { useConditionStore } from "@/stores/conditions.store";
    import * as ConditionService from "@/services/ConditionsService";
    import MainInfosModal from "@/components/common/main-infos-modal/MainInfosModal.vue";
    import BottomMenu from "../../components/common/bottom-menu/BottomMenu.vue";
    import tinymceConditionConfig from '@/data/tinymce.condition.config';
    import TinyMce from "@/components/tinymce/TinyMce.vue";

    const store = useConditionStore();
    const route = useRoute();
    const router = useRouter();
    const condition = ref({});
    const showEditModal = ref(false);
    const editModalElements = ref([
        {
            param: "Date de publication",
            key: "datePublish",
            type: "date",
            value: "",
        },
    ]);
    const bottomMenuItems = [
        {
            text: "Annuler les modifications non enregistrées",
            variant: "plain",
            color: "danger",
            emit: "cancel",
            icon: "mdi-cancel"

        },
        {
            text: "Enregistrer les modifications",
            variant: "elevated",
            color: "primary",
            emit: "save",
            icon: "mdi-content-save"

        }
    ];
    let id;
    let param;



    onMounted(async () => {
        if (route.params) {
            id = route.params.id;
            param = route.params.condition
        }

        condition.value = await ConditionService.getCondition(param, id);
    });

    function editMainInfos() {
        editModalElements.value.forEach(el => {
            const property = condition.value[el.key];
            if (property) el.value = property;
        })

        showEditModal.value = true;
    }


    function cancelMainInfosEdition() {
        showEditModal.value = false;

        editModalElements.value.forEach(el => {
            el.value = "";
        })
    }

    function saveMainInfosEdition(items) {
        items.forEach(el => {
            condition.value[el.key] = el.value;
        })

        showEditModal.value = false;
    }

    function cancelAllModifications() {
        router.push({
            name: "ConditionList"
        })
    }

    async function saveAllModifications() {
        buildTableOfContent();
        store.saveConditionEdited(param, id, condition.value);
        router.push({
            name: "ConditionList"
        })
    }

    function buildTableOfContent() {
        const transliteration = require('transliteration');
        let content = condition.value.content;
        let parser = new DOMParser();
        let htmlContent = parser.parseFromString(content, 'text/html');
        let listArticles = htmlContent.querySelectorAll('article.article');
        let newContent = "";
        let titlesList = htmlContent.querySelectorAll('h1, h2, h3');
        let newList = htmlContent.createElement('ul');
        let anchorLastHref = "";
        let newTableOfContent = "";
        newList.classList.add('breadcrumb__list');


        for (let article of listArticles) {
            let maintitle = article.querySelector('h1.maintitle');
            let title = article.querySelector('h2.title');
            let subtitles = article.querySelectorAll('h3.subtitle');
            let formatedTitle = '';

            if (maintitle !== null) {
                let formatedMaintitle = transliteration.slugify(maintitle.innerHTML, { lowercase: true }).replace(/\s+/g, '-');
                maintitle.setAttribute('data-url', formatedMaintitle);
                article.setAttribute('id', formatedMaintitle);
            } else if (title !== null) {
                formatedTitle = transliteration.slugify(title.innerHTML, { lowercase: true }).replace(/\s+/g, '-');
                title.setAttribute('data-url', formatedTitle);
                article.setAttribute('id', formatedTitle);
            }

            for (let subtitle of subtitles) {
                let formatedSubtitle = transliteration.slugify(subtitle.innerHTML, { lowercase: true }).replace(/\s+/g, '-');
                subtitle.setAttribute('id', formatedTitle + '-' + formatedSubtitle);
            }
            newContent += article.outerHTML;
        }

        condition.value.content = newContent;

        for (let title of titlesList) {
            let newElement = htmlContent.createElement('li');
            let anchor = htmlContent.createElement('a');
            let newClass;

            if (title.classList.contains('title')) {
                newClass = "-title"
                anchor.href = '#' + title.getAttribute('data-url');
                //anchorLastHref = '#' + title.getAttribute('data-url');
            } else if (title.classList.contains('subtitle')) {
                newClass = "-subtitle"
                anchor.href = '#' + title.getAttribute('id');
                title.innerHTML = title.innerHTML.replace(' :', '');
            } else if (title.classList.contains('maintitle')) {
                newClass = "-maintitle"
                anchor.href = '#' + title.getAttribute('data-url');
            }

            newElement.classList.add("list__item", newClass);
            anchor.innerHTML = title.innerHTML.toLowerCase();
            newElement.appendChild(anchor);

            newList.appendChild(newElement)
        }

        newTableOfContent = newList.outerHTML;
        condition.value.tableOfContent = newTableOfContent;

    }
</script>

<style lang="scss">
    .page-title {
        z-index: 5;
        top: calc(var(--v-layout-top) - 20px);

        .v-card-item {
            padding: 0;
        }
    }

    .tox-tinymce {
        border-radius: 5px !important;

        .tox-editor-header {
            top: 134px !important;
        }
    }

    .tox-tinymce-aux {
        .tox-collection__group {
            .tox-collection__item-label {
                article {
                    font-weight: bold !important;
                    text-decoration: underline !important;
                }
            }
        }
    }
</style>
<template>
    <v-menu v-model="showMenu"
            transition="slide-y-transition"
            :close-on-content-click="false"
            @update:modelValue="updateIconButtonMenu($event)">
        <template v-slot:activator="{ props }">
            <v-btn color="primary"
                   v-bind="props"
                   class="position-fixed"
                   size="small"
                   style="top: calc(var(--v-layout-top) - 4px); right: 10px; z-index: 5;">
                <v-icon :icon="iconMenu" />
                Sections
            </v-btn>
        </template>

        <v-card class="mr-2" width="400px" height="400px">
            <v-list>
                <v-list-item class="border-b text-center">
                    <b class="text-caption">Survolez les sections ci-dessous pour obtenir plus d'informations sur celles-ci</b>
                </v-list-item>
                <v-list-item v-for="(section, index) in sections" :key="index">
                    <v-row>
                        <v-col cols="8">
                            <v-tooltip :text="section.description" location="bottom" width="400px">
                                <template v-slot:activator="{ props }">
                                    <v-list-item-title v-bind="props">
                                        {{ section.displayedTitle }}
                                    </v-list-item-title>
                                </template>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="4">
                            <v-list-item-action class="justify-end">
                                <v-btn color="primary" size="small" @click="addSection(section)">Ajouter</v-btn>
                            </v-list-item-action>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script setup>
    import { ref, nextTick } from "vue";
    import { useSectionsStore } from "@/stores/sections.store";
    import { useRoute } from "vue-router";
    import { useHomepageStore } from "@/stores/homepage.store";
    import { useDynamicpagesStore } from "@/stores/dynamicpages.store";
    import { useAppStore } from "@/stores/app.store"

    import Section from "@/data/Section";

    const route = useRoute();
    const emit = defineEmits();
    const sectionsStore = useSectionsStore();
    const homepageStore = useHomepageStore();
    const dynamicpagesStore = useDynamicpagesStore();
    const appStore = useAppStore();
    const showMenu = ref(false);
    const iconMenu = ref('mdi-menu-open');
    const sections = ref(sectionsStore.getSectionsList());

    function updateIconButtonMenu(isOpen) {
        isOpen ? iconMenu.value = "mdi-menu-close" : iconMenu.value = "mdi-menu-open";
    }

    async function addSection(section) {
        const newSection = new Section(section.title);

        if (route.path.includes("homepage")) {
            homepageStore.addSection(newSection);
        } else {
            dynamicpagesStore.addSection(newSection);
        }

        await nextTick(() => {
            appStore.scrollToSectionById(newSection.id);
        })
    }

    function sendEvent(item) {
        emit(item.emit);
    }
</script>
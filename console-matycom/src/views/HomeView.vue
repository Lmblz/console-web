<template>
  <v-row class="ma-2 mt-0">
      <h3>Bienvenue sur la console web</h3>
  </v-row>
    <v-row class="pa-2">
        <v-col cols="12" lg="3" md="4" sm="6" v-for="(card, index) in cards" :key="index">
            <v-card :title="card.meta.navTitle" :to="card.path" elevation="4" class="text-center h-100">
                <v-card-text>
                    <component :is="images[card.meta.cardImage]" width="33%" class="mx-auto" />
                    <p class="text-caption mt-2">{{ card.meta.cardText }}</p>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
    import { useRouter } from "vue-router";
    import HellobarsSvg from "@/components/svg/HellobarsSvg.vue";
    import HomepageSvg from "@/components/svg/HomepageSvg.vue";
    import ConditionsSvg from "@/components/svg/ConditionsSvg.vue";
    import DynamicpagesSvg from "@/components/svg/DynamicpagesSvg.vue";
    import NavigationSvg from "@/components/svg/NavigationSvg.vue";

    const router = useRouter();
    const routes = router.getRoutes();

    // Find images here : https://fr.freepik.com/auteur/vectorjuice
    const cards = routes.filter(el => el.meta.showInNav == true);

    const images = {
        hellobars: HellobarsSvg,
        homepage: HomepageSvg,
        conditions: ConditionsSvg,
        dynamicpages: DynamicpagesSvg,
        navigation: NavigationSvg
    }
</script>

<style scoped lang="scss">
    body {
        overflow: hidden;
    }
</style>
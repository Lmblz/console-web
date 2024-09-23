<template>
    <v-expansion-panels elevation="4">
        <nested-element v-for="(item, index) in items" :key="'element' + index" :element="item" />
    </v-expansion-panels>
</template>

<script setup>
    import NestedElement from "@/components/nav/nested-list/NestedElement.vue";
    const props = defineProps({
        items: Array,
    })
</script>
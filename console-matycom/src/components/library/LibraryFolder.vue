<template>
    <div>
        <v-card class="folder-card position-relative" max-width="150" max-height="139" elevation="5" color="background" :to="pathFolder">
            <v-img src="/dist/assets/images/folder.png" />
            <slot name="loader"></slot>
            <p class="pa-1 text-center text-truncate folder-name">{{ title }}</p>
        </v-card>
    </div>
</template>

<script setup>
    import { computed } from "vue";
    import "@/assets/folder.png";

    const props = defineProps({
        title: String,
        path: String,
    })

    const pathFolder = computed(() => {
        return {
            name: "Library",
            params: { directory: props.path },
            meta: {
                directory: props.path
            }
        }
    })
</script>
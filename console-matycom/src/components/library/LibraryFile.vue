<template>
    <div>
        <v-card class="folder-card position-relative" max-width="150" max-height="139" elevation="5" color="background" :hover="true" @click="throwClickEvent">

            <v-img class="file-image" :src="imagePath" :aspect-ratio="10 / 7" max-height="107" max-width="150" />

            <p class="pa-1 text-center text-truncate folder-name">{{ title }}</p>
        </v-card>
    </div>
</template>

<script setup>
    import { computed } from "vue";

    const props = defineProps({
        title: String,
        path: String,
    })

    const emit = defineEmits(["fileClicked"])

    const imagePath = computed(() => {
        const preprodRoot = "https://preprod.maty.com/images/";
        const pathWithoutRoot = props.path.replace("\\\\dev-frontiis01\\preprod-images$\\", "").replace("\\", "/");
        return preprodRoot + pathWithoutRoot;
    })

    function throwClickEvent() {
        emit('fileClicked')
    }
</script>
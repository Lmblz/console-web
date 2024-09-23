<template>
    <p>coucou</p>
</template>
<script setup>
    import { onMounted } from "vue";

    onMounted(async () => {
        const response = await fetch("/Library/GetDirectories");
        const data = await response.json();
        console.log(data);
    })
</script>
<template>
    <div class="404 text-center">
        <h2>Erreur 404</h2>
        <h3 v-if="route.query.url == undefined">La page demandée n'existe pas</h3>
        <h3 v-else>La page "/{{ route.query.url }}" n'existe pas</h3>
        <v-btn color="primary" variant="outlined" to="/" class="mt-4">Retour à l'accueil</v-btn>
    </div>
</template>
<script setup>
    import { useRoute } from "vue-router";
    const route = useRoute();
</script>

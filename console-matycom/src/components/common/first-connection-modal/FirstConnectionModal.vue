<template>
    <v-dialog v-model="showModal" max-width="500px" class="first-connexion-modal" @afterLeave="router.push('/help')">
        <v-card title="Première connexion">
            <v-card-text>
                <p>Ceci est votre première connexion sur ce navigateur, merci de consulter la rubrique <span @click="showModal = false" class="text-decoration-underline cursor-pointer">Aide</span> de la console pour comprendre son fonctionnement avant de commencer à opérer des modifications.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="showModal = false" color="primary" variant="elevated">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    const router = useRouter();
    const showModal = ref(true);
</script>
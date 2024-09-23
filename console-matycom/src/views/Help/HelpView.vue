<template>
    <div class="pa-2">
        <h2>Besoin d'aide ?</h2>
        <v-card :elevation="4" prepend-icon="mdi-alert" title="Avant de commencer" color="primary" class="mt-4 help-card">
            <v-card-text>
                <v-row class="flex-nowrap ma-1">
                    <v-col cols="auto pa-1">
                        <v-icon icon="mdi-circle-small" />
                    </v-col>
                    <v-col cols="auto pa-1 px-4">
                        <p> Avant de pousser n'importe laquelle de vos modifications en production (via la console MATY), merci de <b>vérifier sur la <a href="https://preprod.maty.com">preprod</a></b> que vos modifications vous conviennent et fonctionnent.</p>
                    </v-col>
                </v-row>
                <v-row class="flex-nowrap ma-1">
                    <v-col cols="auto pa-1">
                        <v-icon icon="mdi-circle-small" />
                    </v-col>
                    <v-col cols="auto pa-1 px-4">
                        <p>En cas de demande (bug, problème, demande d'évolution, ...) merci d'adresser votre demande <b><a href="https://tickets.maty.fr/otobo/index.pl" target="_blank">par ticket</a> au service des Études Informatiques</b>.</p>
                    </v-col>
                </v-row>
                <v-row class="flex-nowrap ma-1">
                    <v-col cols="auto pa-1">
                        <v-icon icon="mdi-circle-small" />
                    </v-col>
                    <v-col cols="auto pa-1 px-4">
                        <p>Des informations sur votre activité sont enregistrées dans votre navigateur, cela permet de conserver vos modifications malgré les refresh (F5) de pages. Pour cette raison, pour éviter les conflits de version, merci de <b>fermer l'onglet du navigateur après avoir fini vos modifications</b>.</p>
                    </v-col>
                </v-row>
                <v-row class="flex-nowrap ma-1">
                    <v-col cols="auto pa-1">
                        <v-icon icon="mdi-circle-small" />
                    </v-col>
                    <v-col cols="auto pa-1 px-4">
                        <p>Les actions réalisables sur les pages (enregistrement, annulation, etc...) sont accessibles à l'aide du bouton flottant situé en bas à droite de l'application et signalé par cette icone: <i class="mdi-menu-close mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>. Cliquer dessus dévoilera les actions possibles.</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card class="mt-10" :elevation="4" color="background">
            <v-tabs v-model="tab" bg-color="primary">
                <v-tab v-for="(item, index) in items" :key="index" :value="index">
                    {{ item.title }}
                </v-tab>
            </v-tabs>
            <v-card-text>
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item v-for="(item, index) in items" :key="index" :value="index">
                        <v-expansion-panels :elevation="4">
                            <v-expansion-panel v-for="(step, index) in item.steps" :key="index">
                                <template #title>
                                    <h3>{{ step.title }}</h3>
                                </template>
                                <template #text>
                                    <v-row v-for="(description, index) in step.list" class="flex-nowrap ma-1">
                                        <v-col cols="auto px-1 py-0">
                                            <v-icon icon="mdi-circle-small" />
                                        </v-col>
                                        <v-col cols="auto px-4 py-0">
                                            <p v-html="description"></p>
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const tab = ref(null);

    const items = [
        {
            title: "Hellobars",
            steps: [
                {
                    title: "Informations générales",
                    list: [
                        `Si une hellobar possède une icône de chronomètre: <i class="mdi-timer-outline mdi v-icon notranslate v-theme--light v-icon--size-x-small text-warning"></i> à côté de son titre, cela signifie qu'un compte à rebours est programmé.`,
                        "Survoler les cercles de couleurs fera apparaître le code hexadécimal de celles-ci. Cliquer dessus copiera le code dans le presse-papier.",
                        `Le bouton avec l'icône œil: <i class="mdi-eye mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> permet de prévisualiser la hellobar sur la preprod. S'il s'agit d'une hellobar programmée dans le futur, le paramètre sera automatiquement passé dans l'url de la fenêtre ce qui vous permettra de la visualiser. En revanche s'il s'agit d'une hellobar en cours, la preprod va s'ouvrir de façon classique.`
                    ]
                },
                {
                    title: "Ajouter une hellobar",
                    list: [
                        "Cliquer sur le bouton \"AJOUTER UNE HELLOBAR\" situé en haut à droite de la page.",
                        "Une fenêtre d'édition va alors s'ouvrir.",
                        "Apporter les modifications souhaitées.",
                        "NB : Si une date est affichée pour le compte à rebours (sur les appareils Apple notamment) alors qu'un compte à rebours n'est pas souhaité, indiquez une date passée.",
                        "Une fois les modifications terminées, cliquer sur le bouton \"ENREGISTRER\" situé en bas à gauche de la fenêtre. Si le bouton \"ANNULER\" est cliqué, la hellobar sera automatiquement supprimée."
                    ]
                },
                {
                    title: "Modifier une hellobar",
                    list: [
                        `Cliquer sur le bouton avec l'icône stylo: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true"></i> situé sur la ligne de la hellobar à modifier.`,
                        "La fenêtre d'édition va alors s'ouvrir.",
                        "Apporter les modifications souhaitées.",
                        "NB : Si une date est affichée pour le compte à rebours (sur les appareils Apple notamment) alors qu'un compte à rebours n'est pas souhaité, indiquez une date passée.",
                        "Une fois les modifications terminées, cliquer sur le bouton \"ENREGISTRER\" situé en bas à gauche de la fenêtre. Si le bouton \"ANNULER\" est cliqué, les modifications seront annulées."
                    ]
                },
                {
                    title: "Dupliquer une hellobar",
                    list: [
                        `Il suffit de cliquer sur le bouton avec l'icône de duplication: <i class="mdi-content-duplicate mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> situé sur la ligne de la hellobar à modifier.`,
                        "La ligne va alors être dupliquée et la nouvelle hellobar portera le même nom que l'originale avec la mention \"- Copie\"."
                    ]
                },
                {
                    title: "Supprimer une hellobar",
                    list: [
                        `Il suffit de cliquer sur le bouton avec l'icône de poubelle: <i class="mdi-trash-can-outline mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> situé sur la ligne de la hellobar à modifier.`,
                        "La ligne va alors être supprimée."
                    ]
                },
                {
                    title: "Rechercher une hellobar",
                    list: [
                        `Il est possible de rechercher une hellobar à partir de son titre ou de son contenu, pour cela il suffit de taper du texte dans la barre de recherche située en haut de page.`,
                        `Une fois la barre remplie, il suffit de presser la touche \"ENTER\" du clavier, ou le bouton avec l'icône loupe: <i class="mdi-magnify mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, les tableaux vont alors se mettre à jour.`,
                        `Pour annuler la recherche, il suffit de cliquer sur le bouton de réinitialisation de recherche avec cette icône: <i class="mdi-restart mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, ou alors de vider la barre de recherche et effectuer une recherche vide.`
                    ]
                },
                {
                    title: "Annuler les modifications",
                    list: [
                        `Cliquer sur le bouton \"ANNULER LES MODIFICATIONS\" du menu d'action en bas à droite fera perdre toutes les modifications.`
                    ]
                },
                {
                    title: "Enregistrer les modifications",
                    list: [
                        `Cliquer sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite enregistrera les modifications sur la preprod et permettra de visualiser les modifications dans l'environnement définitif.`,
                        `Il est important de vérifier sur la preprod car les environnements de MATY.COM et de la console sont différents, il peut y avoir des différences d'affichage.`,
                        `Après recette sur la preprod, se rendre sur la console maty et exécuter ce <a href="http://console.maty.local/Script/Index/MeLHellobars">script</a> pour pousser les modifications sur la production.`
                    ]
                }
            ]
        },
        {
            title: "Homepages",
            steps: [
                {
                    title: "Informations générales",
                    list: [
                        `Le bouton avec l'icône œil: <i class="mdi-eye mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> permet de prévisualiser la homepage sur la preprod. S'il s'agit d'une homepage programmée dans le futur, le paramètre sera automatiquement passé dans l'url de la fenêtre ce qui vous permettra de la visualiser. En revanche s'il s'agit d'une homepage en cours, la preprod va s'ouvrir de façon classique.`,
                        "Les images doivent être placées dans le répertoire prévu à cet effet : \\\\dev-frontiis01\\preprod-imagesHomepages$."
                    ]
                },
                {
                    title: "Ajouter une homepage",
                    list: [
                        "Cliquer sur le bouton \"AJOUTER UNE HOMEPAGE\" situé en haut à droite de la page.",
                        "Une nouvelle homepage va alors apparaître, elle aura pour titre \"Nouvelle Homepage\" et pour date de publication le lendemain du jour auquel l'action est effectuée."
                    ]
                },
                {
                    title: "Modifier une homepage",
                    list: [
                        `Cliquer sur le bouton avec l'icône stylo: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true"></i> situé sur la ligne de la homepage à modifier.`,
                        "Une nouvelle page va alors s'ouvrir.",
                        "ATTENTION : tout refresh de cette page sans avoir cliqué auparavant sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite entraînera une perte des modifications.",
                        `Pour modifier les informations générales de la homepage, cliquer sur le bouton avec l'icône stylo: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i> en haut de la page.`,
                        "Pour ajouter une nouvelle section, il suffit de cliquer sur le bouton \"SECTIONS\" situé en haut à droite de la page.",
                        `Pour modifier une section, il suffit de la survoler, 5 boutons vont alors apparaître:
                    Modifier: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Dupliquer: <i class="mdi-content-duplicate mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Supprimer: <i class="mdi-trash-can mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Monter:<i class="mdi-chevron-up mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Descendre: <i class="mdi-chevron-down mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>`,
                        "Au clic sur le bouton de modification, une fenêtre d'édition va apparaître, il suffit d'apporter les modifications. Une fois faites, cliquer sur le bouton \"ENREGISTRER\" pour valider les modifications. Cliquer sur le bouton \"ANNULER\", hors de la fenêtre, ou presser la touche \"Échap\" du clavier annulera les modifications apportées à cette section.",
                        "Si les modifications de la section ont été validées, la prévisualisation doit se mettre immédiatement à jour. Si les images ne s'affichent pas, vérifier que celles-ci sont correctement nommées et ont bien été placées dans le répertoire prévu à cet effet: \\\\dev-frontiis01\\preprod-imagesHomepages$."
                    ]
                },
                {
                    title: "Dupliquer une homepage",
                    list: [
                        `Il suffit de cliquer sur le bouton avec l'icône de duplication: <i class="mdi-content-duplicate mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> situé sur la ligne de la homepage à modifier.`,
                        "La ligne va alors être dupliquée et la nouvelle homepage portera le même nom que l'originale avec la mention \"- Copie\"."
                    ]
                },
                {
                    title: "Supprimer une homepage",
                    list: [
                        `Il suffit de cliquer sur le bouton avec l'icône de poubelle: <i class="mdi-trash-can-outline mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> situé sur la ligne de la homepage à modifier.`,
                        "La ligne va alors être supprimée."
                    ]
                },
                {
                    title: "Rechercher une homepage",
                    list: [
                        `Il est possible de rechercher une homepage à partir de son titre ou de son contenu, pour cela il suffit de taper du texte dans la barre de recherche située en haut de page.`,
                        `Une fois la barre remplie, il suffit de presser la touche \"ENTER\" du clavier, ou le bouton avec l'icône loupe: <i class="mdi-magnify mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, les tableaux vont alors se mettre à jour.`,
                        `Pour annuler la recherche, il suffit de cliquer sur le bouton de réinitialisation de recherche avec cette icône: <i class="mdi-restart mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, ou alors de vider la barre de recherche et effectuer une recherche vide.`
                    ]
                },
                {
                    title: "Annuler les modifications",
                    list: [
                        `Cliquer sur le bouton \"ANNULER LES MODIFICATIONS\" du menu d'action en bas à droite fera perdre toutes les modifications.`
                    ]
                },
                {
                    title: "Enregistrer les modifications",
                    list: [
                        `Cliquer sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite enregistrera les modifications sur la preprod et permettra de visualiser les modifications dans l'environnement définitif.`,
                        `Il est important de vérifier sur la preprod car les environnements de MATY.COM et de la console sont différents, il peut y avoir des différences d'affichage.`,
                        `Après recette sur la preprod, se rendre sur la console maty et exécuter ce <a href="http://console.maty.local/Script/Index/MeLHomepages">script</a> pour pousser les modifications sur la production.`
                    ]
                }
            ]
        },
        {
            title: "Pages dynamiques",
            steps: [
                {
                    title: "Informations générales",
                    list: [
                        `Le bouton avec l'icône œil: <i class="mdi-eye mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i> permet de prévisualiser la page dynamique sur la preprod. S'il s'agit d'une page dynamique programmée dans le futur, le paramètre sera automatiquement passé dans l'url de la fenêtre ce qui vous permettra de la visualiser. En revanche s'il s'agit d'une page dynamique en cours, la preprod va s'ouvrir de façon classique.`,
                        "Les images doivent être placées dans le répertoire prévu à cet effet : \\\\dev-frontiis01\\preprod-imagesDynamicpages$."
                    ]
                },
                {
                    title: "Ajouter une page dynamique",
                    list: [
                        "Cliquer sur le bouton \"AJOUTER UNE PAGE DYNAMIQUE\" situé en haut à droite de la page.",
                        "Une nouvelle page dynamique va alors apparaître, elle aura pour titre \"Nouvelle page\"."
                    ]
                },
                {
                    title: "Modifier une page dynamique",
                    list: [
                        `Cliquer sur le bouton avec l'icône stylo: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true"></i> situé sur la ligne de la page dynamique à modifier.`,
                        "Une nouvelle page va alors s'ouvrir.",
                        "ATTENTION : tout refresh de cette page sans avoir cliqué auparavant sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite entraînera une perte des modifications.",
                        `Pour modifier les informations générales de la page, cliquer sur le bouton avec l'icône stylo: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i> en haut de la page, dont son id de page Sparkow.`,
                        "Pour ajouter une nouvelle section, il suffit de cliquer sur le bouton \"SECTIONS\" situé en haut à droite de la page.",
                        `Pour modifier une section, il suffit de la survoler, 5 boutons vont alors apparaître:
                    Modifier: <i class="mdi-pen mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Dupliquer: <i class="mdi-content-duplicate mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Supprimer: <i class="mdi-trash-can mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Monter: <i class="mdi-chevron-up mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>
                    Descendre: <i class="mdi-chevron-down mdi v-icon notranslate v-theme--light v-icon--size-default mr-2" aria-hidden="true"></i>`,
                        "Au clic sur le bouton de modification, une fenêtre d'édition va apparaître, il suffit d'apporter les modifications. Une fois faites, cliquer sur le bouton \"ENREGISTRER\" pour valider les modifications. Cliquer sur le bouton \"ANNULER\", hors de la fenêtre, ou presser la touche \"Échap\" du clavier annulera les modifications apportées à cette section.",
                        "Si les modifications de la section ont été validées, la prévisualisation doit se mettre immédiatement à jour. Si les images ne s'affichent pas, vérifier que celles-ci sont correctement nommées et ont bien été placées dans le répertoire prévu à cet effet: \\\\dev-frontiis01\\preprod-imagesDynamicpages$. En cas d'erreur, merci de contacter le développeur en charge de la console au plus vite.",
                        "Une fois les modifications de la page dynamique terminées, cliquer sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite. Une redirection sera faite vers la page de listage des différentes pages dynamiques.",
                        "À présent, il est possible de faire un refresh, de changer de page, etc., les modifications sont enregistrées dans le navigateur <b>POUR UNE DURÉE LIMITÉE</b>. Si l'onglet du navigateur est fermé, les modifications seront <b>PERDUES</b>."
                    ]
                },
                {
                    title: "Rechercher une page dynamique",
                    list: [
                        `Il est possible de rechercher une page dynamique à partir de son titre, pour cela il suffit de taper du texte dans la barre de recherche située en haut de page.`,
                        `Une fois la barre remplie, il suffit de presser la touche \"ENTER\" du clavier, ou le bouton avec l'icône loupe: <i class="mdi-magnify mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, les tableaux vont alors se mettre à jour.`,
                        `Pour annuler la recherche, il suffit de cliquer sur le bouton de réinitialisation de recherche avec cette icône: <i class="mdi-restart mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>, ou alors de vider la barre de recherche et effectuer une recherche vide. `
                    ]
                },
                {
                    title: "Annuler les modifications",
                    list: [
                        `Cliquer sur le bouton \"ANNULER LES MODIFICATIONS\" du menu d'action en bas à droite fera perdre toutes les modifications.`
                    ]
                },
                {
                    title: "Enregistrer les modifications",
                    list: [
                        `Cliquer sur le bouton \"ENREGISTRER LES MODIFICATIONS\" du menu d'action en bas à droite enregistrera les modifications sur la preprod et permettra de visualiser les modifications dans l'environnement définitif.`,
                        `Il est important de vérifier sur la preprod car les environnements de MATY.COM et de la console sont différents, il peut y avoir des différences d'affichage.`,
                        `Après recette sur la preprod, se rendre sur la console maty et exécuter ce <a href="http://console.maty.local/Script/Index/MeLDynamicPages">script</a> pour pousser les modifications sur la production.`
                    ]
                }
            ]
        }
    ]
</script>

<style lang="scss">
    .help-card {
        p {
            a {
                color: inherit;
            }
        }
    }
</style>
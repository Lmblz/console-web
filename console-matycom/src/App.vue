<template>
    <v-app>
        <v-app-bar :elevation="5" color="primary">
            <div class="d-flex flex-column w-100">
                <v-row class="ma-0 pa-1">
                    <v-col class="pa-1">
                        <router-link to="/" class="router-link">
                            <v-row class="ma-0">
                                <img :width="35" :height="22" src="./assets/logo_poincon.png" />
                                <p class="ml-2">Console Maty.com</p>
                            </v-row>
                        </router-link>
                    </v-col>
                    <v-spacer class="d-xs-none" />
                    <v-col class="pa-0" cols="auto">
                        <v-avatar :color="user.color" size="small"><p class="text-caption">{{ user.name }}</p></v-avatar>
                    </v-col>
                </v-row>
                <v-row class="ma-0 pa-2 w-100 v-toolbar__entries">
                    <router-link class="app-bar__item mr-2 d-flex align-center router-link flex-xs-fill justify-xs-center" v-for="(item, index) in appBarItems" :key="index" :to="item.path">
                        <v-icon :icon="item.meta.navIcon" :size="item.meta.navSize ? item.meta.navSize : 'small' " />
                        <p class="ml-1 d-xs-none">{{ item.meta.navTitle }}</p>
                    </router-link>
                    <v-spacer />
                    <router-link class="app-bar__item mr-2 d-flex align-center router-link flex-fill justify-xs-center justify-sm-end" to="/help">
                        <v-icon icon="mdi-help-circle" size="small" />
                        <p class="ml-1 d-xs-none">Aide</p>
                    </router-link>
                </v-row>
            </div>
        </v-app-bar>
        <v-main>
            <router-view v-slot="{ Component }">
                <transition>
                    <div v-if="showComponent" class="h-100">
                        <component :is="Component" />
                    </div>
                </transition>
            </router-view>
            <state-snackbar v-model="snackbarStore.show" :color="snackbarStore.color" :title="snackbarStore.title" :message="snackbarStore.message" :button="snackbarStore.button" :timeout="snackbarStore.timeout" @closeSnackbarEvent="snackbarStore.show = false" />
            <first-connection-modal v-if="user.firstConnection" />
        </v-main>
        <v-bottom-navigation grow class="d-flex justify-space-between" density="compact">
            <v-row class="w-100 justify-sm-space-between justify-xs-center align-center ma-0 ga-xs-6">
                <img src="./assets/Maty_Logo_RVB.png" alt="Monogramme Maty" height="40" class="opacity-0 d-xs-none" />
                <v-row class="ma-0 flex-0-0">
                    <p>
                        Console Maty.com -&nbsp;
                    </p>
                    <v-dialog max-width="500" max-height="500">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-row class="ma-0" v-bind="activatorProps" @click="clickVersion">
                                <span class="text-decoration-underline cursor-pointer">{{ version }}</span>
                                <v-badge floating :dot="true" color="warning" v-if="showVersionBadge" />

                            </v-row>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <v-card title="Versions">
                                <v-card-text>
                                    <v-list>
                                        <v-list-item v-for="(version, index) in versionsList"
                                                     :key="index"
                                                     :title="version.version + ' - ' + version.title">
                                            <v-list-item-subtitle class="opacity-100">
                                                Le {{ version.date }}
                                            </v-list-item-subtitle>
                                            <p class="text-caption opacity-80" v-html="version.description">
                                            </p>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn text="Fermer"
                                           @click="isActive.value = false"></v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>
                </v-row>
                <img src="./assets/Maty_Logo_RVB.png" alt="Monogramme Maty" height="40" />

            </v-row>

        </v-bottom-navigation>
    </v-app>
</template>

<script setup>
    import { useRouter } from "vue-router";
    import { ref, onMounted } from "vue";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";
    import { useAppStore } from "@/stores/app.store";
    import StateSnackbar from "@/components/common/state-snackbar/StateSnackbar.vue";
    import FirstConnectionModal from "@/components/common/first-connection-modal/FirstConnectionModal.vue";

    import * as AppService from "@/services/AppService.js";

    import packageJson from "../package.json";
    import versionsList from "../versions.json";

    const showComponent = ref(true);

    const router = useRouter();
    const routes = router ? router.getRoutes() : null;
    const version = packageJson.version;
    const showVersionBadge = ref(false);
    const user = ref({});

    const snackbarStore = useSnackbarStore();
    const appStore = useAppStore();

    // On affiche dans la nav les éléments dans le router qui ont la meta "showInNav"
    const appBarItems = routes ? routes.filter(el => el.meta.showInNav == true) : null;

    onMounted(async () => {
        // On récupère les infos du user
        user.value = await appStore.getUser();

        // On regarde quelle est la dernière version vue par le user
        const ls = localStorage.getItem("LastVersionSeen");
        const currentVersion = versionsList[0].version;
        // Si elle est différente de la version actuelle on lui affiche le badge de notificiation
        if (!ls || ls !== currentVersion) {
            showVersionBadge.value = true;
            return;
        }
    })

    if (router) router.beforeEach((to, from, next) => {
        // Transition entre les routes
        showComponent.value = false;

        // On attend au minimum de la durée de l'animation avant de changer de vue
        setTimeout(() => {
            next()
            setTimeout(() => {
                showComponent.value = true;
            }, 100)
        }, 100)

    })

    function clickVersion() {
        localStorage.setItem("LastVersionSeen", version);
        showVersionBadge.value = false;
    }
</script>

<style lang="scss">
    :root {
        --ck-border-radius: 4px !important;
    }

    .w-xs-100 {
        @media (max-width: 600px) {
            width: 100% !important;
        }
    }

    .justify-xs-center {
        @media (max-width: 600px) {
            justify-content: center !important;
        }
    }

    .flex-xs-fill {
        @media (max-width: 600px) {
            flex: 1 1 auto !important;
        }
    }

    .d-xs-none {
        @media (max-width: 600px) {
            display: none !important;
        }
    }

    $sizes: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16;

    @each $size in $sizes {
        .ga-xs-#{$size} {
            gap: calc($size * 4px);
        }
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.1s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    body {
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .router-link {
        color: inherit;
        text-decoration: inherit;
        height: 24px;
    }

    .v-toolbar {
        &__content {
            height: fit-content !important;
        }

        &__entries {
            background: white;
            color: rgb(var(--v-theme-primary));

            .router-link-active {
                filter: brightness(1.5)
            }
        }
    }

    .v-main {
        --v-layout-top: 100px !important;
        --v-layout-bottom: 50px !important;
    }

    .v-bottom-navigation {
        box-shadow: 0px -2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px -4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px -1px 10px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12)) !important;
    }

    .ck-editor {
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0.42);
        
        &__editable {
            max-height: 140px !important;
        }
    }

    input {
        &[type=datetime-local] {
            border-radius: 4px;
            border: solid 1px rgba(0,0,0,0.42);
        }

        &[type=color] {
            cursor: pointer;
            width: 224px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid rgba(0,0,0,0.42);
            padding: 4px;
            background-color: white;

            &::-webkit-color-swatch-wrapper {
                padding: 0; /* Remove padding */
                border: none; /* Remove border */
            }

            &::-webkit-color-swatch {
                border-radius: 1px; /* Make color swatch circular */
                border: none; /* Remove border */
                width: 100%; /* Ensure color swatch fills the circle */
                height: 100%; /* Ensure color swatch fills the circle */
            }
        }
    }

    .tox-tinymce-aux, .ck-balloon-panel:has(.ck-link-form) {
        // Obligé de faire ça, sinon des fonctionnalités de TinyMce passent derrière la modal d'édition
        z-index: 9999 !important;
    }

    .v-table {
        &__wrapper {
            table {
                .v-data-table__td {
                    padding: 4px 8px !important;
                }
            }
        }
    }

    .edit-modal {
        &__param {
            width: 150px;
        }

        &__value {
            width: 310px !important;
        }
    }
</style>
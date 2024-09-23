import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import HellobarsView from "../views/Hellobars/HellobarsView.vue";
import HomepageView from "../views/Homepages/HomepageView.vue";
import DynamicpagesView from "../views/DynamicPages/DynamicPages.vue";
import ConditionsView from "../views/Conditions/Conditions.vue";
import LibraryView from "../views/Library/LibraryView.vue";
import NavigationList from "../views/Navigation/NavigationList.vue";
import HelpView from "../views/Help/HelpView.vue"
import NotFound from "../views/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'Accueil',
        component: HomeView,
        meta: {
            title: "Console Web MATY"
        }
    },
    {
        path: '/404',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/:catchAll(.*)',
        redirect: to => {
            return { path: '/404', query: { url: to.params.catchAll } }
        },
    },
    {
        path: '/hello-bars',
        name: 'Hellobars',
        component: HellobarsView,
        meta: {
            showInNav: true,
            navTitle: "Hello bars",
            navIcon: "mdi-bullhorn",
            cardImage: "hellobars",
            cardText: "Gestion des barres d'état affichées en haut du site. Possibilité de choisir leur contenu, période de publication, couleur...",
            needAuth: true,
            queryName: "HelloBars",
            title: "Console - Hellobars"
        }
    },
    {
        path: '/homepage',
        name: "Homepages",
        meta: {
            showInNav: true,
            navTitle: "Homepages",
            navIcon: "mdi-home",
            cardImage: "homepage",
            cardText: "Gestion des homepages, des sections affichées ainsi que leur contenu, des périodes de publication...",
            needAuth: true,
            queryName: "Homepages",
            title: "Console - Homepages"
        },
        children: [
            {
                name: "Homepage",
                path: "",
                component: HomepageView,
            },
            {
                name: "Edition",
                path: ":id",
                component: () => import('../views/Homepages/EditHpView.vue')
            }
        ]
    },
    {
        path: '/conditions',
        name: "Conditions",
        meta: {
            showInNav: true,
            navTitle: "Conditions",
            navIcon: "mdi-gavel",
            cardImage: "conditions",
            cardText: "Gestion des pages juridiques (CGV, CGU...), ainsi que leur période de publication",
            needAuth: true,
            queryName: "Conditions",
            title: "Console - Conditions",
        },
        children: [
            {
                path: "",
                name: 'Conditions',
                component: ConditionsView,

            },
            {
                path: ':condition',
                name: 'Condition',
                component: () => import('../views/Conditions/ConditionView.vue'),
                redirect: '/conditions/:condition/liste',
                children: [
                    {
                        path: 'liste',
                        name: 'ConditionList',
                        component: () => import('../views/Conditions/ConditionList.vue'),
                        meta: {
                            title: 'ConditionsList'
                        }
                    },
                    {
                        path: ':id',
                        name: 'EditCondition',
                        component: () => import('../views/Conditions/EditCondition.vue'),
                        meta: {
                            title: 'EditCondition'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/dynamicpages",
        name: "DynamicPages",
        meta: {
            showInNav: true,
            navTitle: "Pages dynamiques",
            navIcon: "mdi-application-edit",
            navSize: "x-small",
            cardImage: "dynamicpages",
            cardText: "Gestion des pages dynamiques, des sections affichées ainsi que leur contenu et leurs actions de merchandising",
            needAuth: true,
            queryName: "DynamicPages",
            title: "Console - Dynamic Pages"
        },
        children: [
            {
                path: "",
                name: "DynamicPages",
                component: DynamicpagesView,
            },
            {
                path: ":directoryId",
                name: "DynamicPage",
                component: () => import("../views/DynamicPages/EditDynamicPage.vue"),
            },
        ]
    },
    {
        path: "/library",
        redirect: "/library/%5C%5Cdev-frontiis01%5Cpreprod-images$",
        children: [
            {
                path: "/library/:directory",
                name: "Library",
                component: LibraryView,
            }
        ]
    },
    {
        path: "/navigation",
        name: "NavigationList",
        meta: {
            showInNav: true,
            navTitle: "Navigation",
            navIcon: "mdi-navigation-variant",
            navSize: "small",
            cardImage: "navigation",
            cardText: "Gestion de la barre de navigation, des actions affichées et de l'obfuscation des liens",
            needAuth: true,
            queryName: "Navigation",
            title: "Console - Navigation",
        },
        //beforeEnter: (to, from) => {
        //    if (to.params.canal === undefined) {
        //        return { path: "/navigation/web_fr-fr" }
        //    }
        //},
        children: [
            {
                //path: ":canal",
                path: "",
                name: "NavigationList",
                component: NavigationList,
            },
            {
                path: ":id",
                name: "Navigation",
                component: () => import('../views/Navigation/NavigationView.vue')
            }
        ]
    },
    {
        path: "/help",
        name: "Help",
        component: HelpView,
    },
    {
        path: "/test",
        name: "Test",
        component: () => import("@/views/Test/Test.vue"),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Retourne en haut de page quand on change de page
        return { top: 0 }
    },
})

router.beforeEach(async (to, from, next) => {
    // On regarde si la page nécessite d'être log
    if (to.meta.needAuth) {
        // Si oui, requête pour voir si on laisse passer
        let response = await fetch('/Navigation/GoToPage?actionName=' + to.meta.queryName);
        let jsonData = await response.json();

        if (jsonData.allowAccess) {
            next();
        } else {
            alert('Vous ne pouvez pas accéder à cette page');
            next('/');
        }
    } else {
        next();
    }

    let pageTitle;

    // On regarde si la route à une propriété title dans la meta
    if (to.meta.title) {
        // Si oui, on la récupère
        if (to.meta.title === "ConditionsList") {
            to.meta.title = to.params.condition.replaceAll('-', ' ');
        } else if (to.meta.title === "EditCondition") {
            to.meta.title = "Édition - " + to.params.condition.replaceAll('-', ' ');
        }
        pageTitle = to.meta.title;
    } else if (to.name) {
        pageTitle = to.name
    } else {
        pageTitle = "Console Web Maty";
    }

    // Va permettre de modifier le meta title de la page 
    pageTitle = pageTitle.toUpperCase();
    document.title = pageTitle;
});


export default router

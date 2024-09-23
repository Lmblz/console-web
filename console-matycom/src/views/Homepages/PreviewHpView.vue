<template>
    <div class="back-to-edit">
        <button class="btn btn-md btn-primary icon white" @click="backToEdition()"><font-awesome-icon icon="chevron-left" class="white" style="margin-right: .3125rem;" /> Retour aux modifications</button>
    </div>
    <HeaderMatyCom />
    <main id="main-content">
        <div class="o-homepage">
            <!--<div v-for="component in ObjectHomepage.content" :key="component.id">
                <component :is="getComponentType(component.componentName)" :data="JSON.stringify(component)"></component>
            </div>-->
        </div>
    </main>
    <FooterMatyCom />
</template>
<style>
    @import url("https://www.maty.com/dist/css/minify/homepage.min.css");
    @import url("https://www.maty.com/dist/css/minify/common.min.css");
</style>
<script>
    import HeaderMatyCom from '../../components/homepage/preview/HeaderMatyCom.vue';
    import FooterMatyCom from '../../components/homepage/preview/FooterMatyCom.vue';
    //import SimpleBanner from '../../components/homepage/SimpleBanner.vue';
    //import Cards from '../../components/homepage/Cards.vue';
    //import Boxes from '../../components/homepage/Boxes.vue';
    export default {
        components: {
            //SimpleBanner,
            //Cards,
            //Boxes,
            HeaderMatyCom,
            FooterMatyCom,
        },
        data() {
            return {
                ObjectHomepage: {},
                StorageHomepage: {},
                ArrayHomepages: [],
                StorageHomepages: [],
                headerConsoleClone: '',
                footerConsoleClone: '',
            }
        },
        methods: {
            getComponentType: function (type) {
                switch (type) {
                    case 'SimpleBanner':
                        return 'SimpleBanner';

                    case 'Cards':
                        return 'Cards';

                    case 'Boxes':
                        return 'Boxes';
                }
            },
            removeEditionFunctions: function () {
                let editionElements = document.querySelectorAll('.edit');
                editionElements.forEach(el => {
                    el.remove();
                })
            },
            backToEdition: function () {
                this.$router.push(`/homepage/${this.ObjectHomepage.id}`)
            },
            addPreviewClass: function () {
                let mainConsole = document.querySelector('.content-console');
                let mainHome = document.querySelector('#main-content');
                mainConsole.classList.add('-preview');
                mainHome.classList.add('-preview');
            },
            removeHeaderFooter: function () {
                var headerConsole = document.querySelector('.header-console')
                var footerConsole = document.querySelector('.footer-console')
                this.headerConsoleClone = headerConsole;
                this.footerConsoleClone = footerConsole;
                headerConsole.remove();
                footerConsole.remove();
            }
        },
        created() {
            if (sessionStorage.getItem('StorageHomepage') != null) {

                this.StorageHomepage = sessionStorage.getItem('StorageHomepage');
                this.ObjectHomepage = JSON.parse(this.StorageHomepage);

            } else {

                this.StorageHomepages = sessionStorage.getItem('StorageHomepages');
                this.ArrayHomepages = JSON.parse(this.StorageHomepages);

                let idHomepage = this.$route.params.id;
                let indexHomepage = this.ArrayHomepages.findIndex(el => el.id == idHomepage);

                this.ObjectHomepage = this.ArrayHomepages[indexHomepage];
                sessionStorage.setItem('StorageHomepage', JSON.stringify(this.ObjectHomepage));
            }

        },
        mounted() {
            this.removeEditionFunctions();
            this.removeHeaderFooter();
            this.addPreviewClass();
        },
        updated() {
        },
        unmounted() {
            //let app = document.querySelector('#app');
            //app.appendChild(this.headerConsoleClone);
            //let contentConsole = document.querySelector('.content-console.-preview');
            //contentConsole.classList.remove('-preview');
            location.reload();
        }
    }
</script>
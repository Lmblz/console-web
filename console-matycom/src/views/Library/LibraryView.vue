<template>
    <div class="library pa-2 h-100" @dragenter.prevent="dragFilesEnter" @drop.prevent="dropFiles">
        <slot v-if="!isLoading">
            <v-row class="ma-0">
                <v-col cols="3">
                    <v-btn variant="text" color="primary" size="small" :to="previousPath" v-if="showPreviousButton"><v-icon icon="mdi-arrow-left" /> Retour</v-btn>
                </v-col>
                <v-col cols="6">
                    <h2 class="text-center">{{ directoryName.replaceAll("\\", "/") }}</h2>
                </v-col>
                <v-col cols="3" class="text-right">
                    <v-btn variant="text" color="primary" size="small" @click="showModalFile = true"><v-icon icon="mdi-tray-arrow-up" /> Ajouter un fichier</v-btn>
                </v-col>
            </v-row>
            <v-row class="ma-0">
                <v-col class="pa-0" cols="4" sm="3" md="2" lg="1" v-for="(folder, index) in libraryData.folders" :key="'folder' + index">
                    <library-folder class="pa-2" :title="folder.title" :path="folder.fullPath" />
                </v-col>
                <v-col class="pa-0" cols="4" sm="3" md="2" lg="1" v-for="(file, index) in libraryData.files" :key="'file' + index">
                    <library-file class="pa-2" :id="file.fullPath" :title="file.title" :path="file.fullPath" @fileClicked="showModalImage = true; modalElement = file" />
                </v-col>
            </v-row>

            <v-dialog v-model="showModalImage" max-height="800px">
                <v-card>
                    <v-card-title class="pb-0">
                        {{ modalElement.title }}
                    </v-card-title>
                    <v-card-subtitle>
                        <v-row class="align-center ma-0 ga-2 py-2">
                            {{ imagePath }}
                            <v-btn icon="mdi-clipboard-multiple-outline" variant="tonal" size="x-small" color="primary" @click="appStore.copyText(imagePath.replace('https://preprod.maty.com', ''))" />
                        </v-row>
                    </v-card-subtitle>
                    <v-card-text class="text-center">
                        <img class="modal-image" :src="imagePath" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="elevated" size="small" color="error" @click="deleteFile">
                            <v-icon icon="mdi-trash-can-outline" />
                            Supprimer le fichier
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showModalFile" max-height="800px" max-width="500px" @drop="dropFiles" @afterLeave="arr = []">
                <v-card max-height="800px" max-width="500px" title="Ajouter un fichier">
                    <v-card-text class="pb-1">
                        <v-file-input label="Choisir un ou plusieurs fichiers" counter chips multiple show-size density="compact" variant="outlined" v-model="arr" id="inputFiles" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" text="Ajouter ce(s) fichier(s)" variant="elevated" size="small" @click="uploadFiles" />
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showNewFolderModal" max-height="800px" max-width="500px">
                <v-card max-height="800px" max-width="500px" title="Ajouter un nouveau dossier">
                    <v-card-text class="pb-1">
                        <v-text-field label="Nom du nouveau dossier" density="compact" variant="outlined" v-model="folderName" hide-details />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" text="Créer ce dossier" variant="elevated" size="small" @click="createNewFolder" />
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </slot>

        <slot v-else>
            <v-row class="ma-0">
                <v-col cols="3">
                </v-col>
                <v-col cols="6">
                </v-col>
                <v-col cols="3">
                </v-col>
            </v-row>
            <v-row class="ma-0">
                <v-col class="pa-2" cols="4" sm="3" md="2" lg="1" v-for="(i) in 25" :key="i">
                    <library-folder class="pa-2" title="...">
                        <template #loader>
                            <v-progress-circular indeterminate class="position-absolute loading-circle" :size="20" :width="3" color="primary"></v-progress-circular>
                        </template>
                    </library-folder>
                </v-col>
            </v-row>
        </slot>

        <bottom-menu :items="bottomMenuItems" @addNewFolder="showNewFolderModal = true" />
    </div>
</template>

<script setup>
    import { onMounted, reactive, computed, ref, nextTick, onUnmounted } from "vue";
    import { useRoute, useRouter } from "vue-router";

    import { useAppStore } from "@/stores/app.store.js";
    import { useSnackbarStore } from "@/stores/snackbar.store.js";

    import * as LibraryService from "@/services/LibraryService.js";

    import LibraryFile from "@/components/library/LibraryFile.vue";
    import LibraryFolder from "@/components/library/LibraryFolder.vue";
    import BottomMenu from "@/components/common/bottom-menu/BottomMenu.vue";

    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    const route = useRoute();
    const router = useRouter();
    const libraryData = ref({})
    const showModalImage = ref(false);
    const showModalFile = ref(false);
    const modalElement = ref({});
    const isLoading = ref(true);
    const arr = ref([]);
    const showNewFolderModal = ref(false);
    const folderName = ref("");
    const isDragging = ref(false);
    const events = ['dragenter', 'dragover', 'dragleave', 'drop']

    const bottomMenuItems = [
        {
            text: "Ajouter un nouveau dossier",
            variant: "elevated",
            color: "primary",
            emit: "addNewFolder",
            icon: "mdi-folder-plus"

        }
    ];

    onMounted(async () => {
        getData();

        events.forEach((eventName) => {
            document.body.addEventListener(eventName, preventDefaults)
        })
    })

    onUnmounted(() => {
        events.forEach((eventName) => {
            document.body.removeEventListener(eventName, preventDefaults)
        })
    })

    function preventDefaults(e) {
        e.preventDefault()
    }

    const showPreviousButton = computed(() => {
        return route.params.directory != "\\\\dev-frontiis01\\preprod-images$"
    })

    const previousPath = computed(() => {
        const root = "\\\\dev-frontiis01\\preprod-images$";
        const path = route.params.directory;
        const pathWithoutRoot = path.replace(root, "").split('\\');
        let finalPath = "%5C%5Cdev-frontiis01%5Cpreprod-images$";

        // Si une fois splité, length == 2, veut dire qu'on est dans un sous-dossier du répertoire image -> previous path est le dossier root
        // Si > 2, veut dire qu'on est dans un dossier encore plus profond
        if (pathWithoutRoot.length == 2) {
            return finalPath;
        }

        pathWithoutRoot.forEach((el, index) => {
            if (el == "" || index == 0 || index == pathWithoutRoot.length - 1) return;
            finalPath += "%5C" + el;
        })

        return finalPath;
    })

    const imagePath = computed(() => {
        const preprodRoot = "https://preprod.maty.com/images/";
        const pathWithoutRoot = modalElement.value.fullPath.replace("\\\\dev-frontiis01\\preprod-images$\\", "");
        return preprodRoot + pathWithoutRoot;
    })

    const directoryName = computed(() => {
        const full = route.params.directory.replace("\\\\dev-frontiis01\\preprod-images$\\", "");
        return full;
    })

    async function getData() {
        isLoading.value = true;
        const response = await LibraryService.getDirectoryContent(route.params.directory);

        if (response.alreadyExists == false) router.push("%5C%5Cdev-frontiis01%5Cpreprod-images$");

        libraryData.value.folders = response.folders;
        libraryData.value.files = response.files;
        isLoading.value = false;
    }

    async function uploadFiles() {
        const response = await LibraryService.uploadFiles(arr.value, route.params.directory);
        showModalFile.value = false;
        arr.value = [];

        if (response.isValid) getData()
    }

    async function deleteFile() {
        const response = await LibraryService.deleteFile(modalElement.value);
        showModalImage.value = false;
        modalElement.value = {};

        if (response.isValid) getData()
    }

    async function createNewFolder() {

        if (folderName.value == "") {
            snackbarStore.showSnackbar({
                message: "Le nom de dossier ne peut pas être nul",
                color: "warning",
                title: "Attention"
            })

            return
        }

        const newPath = route.params.directory + "\\" + folderName.value;
        const response = await LibraryService.createNewFolder(newPath);
        showNewFolderModal.value = false;
        folderName.value = "";

        if (response.isValid) getData()
    }

    function dragFilesEnter(e) {
        showModalFile.value = true;
    }

    function dragFilesLeave(e) {
    }

    function dropFiles(e) {
        e.preventDefault();
        Array.from(e.dataTransfer.files).forEach(file => {
            arr.value.push(file);
        })
    }
</script>

<style lang="scss">
    .folder-card {
        box-shadow: 0px 8px 8px 0px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.12)) !important;
        margin: auto;
    }

    .file-image {
        img {
            object-fit: scale-down;
        }
    }

    .modal-image {
        max-width: 100%;
        max-height: 100%;
    }

    .loading-circle {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
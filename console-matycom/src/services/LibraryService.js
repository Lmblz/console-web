import { useAppStore } from "@/stores/app.store.js";
import { useSnackbarStore } from "@/stores/snackbar.store.js";

export async function getDirectoryContent(directory) {
    const snackbarStore = useSnackbarStore();
    let libraryData = { files: [], folders: [] }

    let url = "/Library/GetDirectories";

    if (directory) url += "?directory=" + directory;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.isValid) {
            data.folders.forEach(folder => {
                let title = folder.replace(directory, "");
                title = title.replace("\\", '');

                const obj = {
                    title: title,
                    fullPath: folder
                };

                libraryData.folders.push(obj);
            })

            data.files.forEach(file => {
                let title = file.replace(directory, "");
                title = title.replace("\\", '');

                const obj = {
                    title: title,
                    fullPath: file
                }
                libraryData.files.push(obj);
            })

            return libraryData;
        }

        if (!data.alreadyExists) {
            snackbarStore.showSnackbar({
                message: "Le dossier spécifié est introuvable",
                color: "error",
                title: "Erreur"
            })

            return data;
        }

    } catch (e) {
        console.error(e);
        snackbarStore.showSnackbar({
            message: "Une erreur est survenue lors de la récupération de ce dossier : " + directory,
            color: "error",
            title: "Erreur"
        })
    }
}

export async function uploadFiles(files, directory) {
    const snackbarStore = useSnackbarStore();
    const encodedDirectory = encodeURI(directory);
    let result = { isValid: true }

    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/Library/UploadFiles?folder=${encodedDirectory}`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error('Error:', error);
            result.isValid = false;
            result.message = error;
        }
    }

    return result;
}

export async function deleteFile(file) {
    const snackbarStore = useSnackbarStore();
    const encodedDirectory = encodeURI(file.fullPath);
    try {
        const response = await fetch(`/Library/DeleteFile?filePath=${encodedDirectory}`);
        const data = await response.json();
        
        if (response.ok && data.isValid) {
            snackbarStore.showSnackbar({
                message: "Le fichier a bien été supprimé",
                color: "success",
                title: "Fichier supprimé"
            })

            return data
        }

        throw new Error(data.message);
    } catch (e) {
        console.error(e.message);
        snackbarStore.showSnackbar({
            message: "Une erreur est survenue lors de la suppression du fichier",
            color: "error",
            title: "Erreur"
        })
        return data;
    }
}

export async function createNewFolder(newPath) {
    const snackbarStore = useSnackbarStore();
    const encodedPath = encodeURI(newPath);

    try {
        const response = await fetch("/Library/CreateNewFolder?newPath=" + encodedPath);
        const data = await response.json();

        if (data.alreadyExists) {
            throw new Error("Un dossier portant ce nom existe déjà à cet emplacement");
        }

        if (response.ok && data.isValid) {
            snackbarStore.showSnackbar({
                message: "Le dossier a bien été créé",
                color: "success",
                title: "Dossier créé"
            })

            return data;
        }

        throw new Error(data.message);
    } catch (e) {
        snackbarStore.showSnackbar({
            message: "Une erreur s'est produite à la création du dossier : " + e,
            color: "error",
            title: "Erreur"
        })

        return { isValid: false }
    }
}
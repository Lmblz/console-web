import { defineStore } from "pinia";
import * as HomepageService from "@/services/HomepagesService";
import { useSectionsStore } from "@/stores/sections.store";

export const useHomepageStore = defineStore('homepageStore', {
    state: () => (
        {
            homepages: null,
            homepageToEdit: null,
            lastModificationDate: null
        }
    ),

    actions: {
        // Enregistre les homepages dans le store
        setHomepages(homepages) {
            this.homepages = homepages;
        },

        // Retourne les homepages
        getHomepages() {
            return this.homepages;
        },

        // Enregistre la homepage à modifier dans le store
        setHomepageToEdit(homepage) {
            this.homepageToEdit = homepage;
        },

        // Retourne la homepage à modifier
        getHomepageToEdit() {
            return this.homepageToEdit;
        },

        // Ajoute une nouvelle section dans la homepage à modifier
        addSection(section) {
            this.homepageToEdit.content.push(section);
        },

        // Enregistre la section modifiée
        saveSectionEdited(sectionContent) {
            const sectionsStore = useSectionsStore();

            // On récupère l'index de la section
            const indexSection = this.homepageToEdit.content.findIndex(el => el.id == sectionsStore.getSectionToEdit().id);

            // On lui change son contenu par la nouvelle page
            this.homepageToEdit.content[indexSection].content = sectionContent;

            // On la supprime du store
            sectionsStore.removeSectionToEdit();
        },

        // Enregistre la homepage modifée
        async saveHomepageEdited() {
            // On regarde si le store contient les homepages
            if (!this.homepages) {
                // Si non, on les récupères dans le service
                this.homepages = await HomepageService.getHomepages();
            }

            // N'est pas sensé arriver, mais ça évite de faire planter en cas de page qui n'existe pas
            const homepageIndex = this.homepages.findIndex(el => el.id == this.homepageToEdit.id);
            if (homepageIndex == -1) {
                return {
                    ok: false
                }
            }

            // On vient remplacer l'ancienne version par la nouvelle
            this.homepages.splice(homepageIndex, 1, this.homepageToEdit);

            // On ajoute les homepages dans le session storage
            HomepageService.setHomepagesInSessionStorage(this.homepages);

            // On vire la homepage à modifier du session storage
            HomepageService.removeHomepageToEditFromSessionStorage();

            // On enregistre l'id et le titre de la page pour les logs
            HomepageService.setEditedHomepageInSessionStorage(this.homepageToEdit.id, this.homepageToEdit.title);

            return {
                ok: true,
            }
        }
    }
})
import { defineStore } from "pinia";
import { useSectionsStore } from "@/stores/sections.store"
import * as DynamicpagesService from "@/services/DynamicpagesService";

export const useDynamicpagesStore = defineStore('dynamicpageStore', {
    state: () => ({
        dynamicpages: null,
        dynamicpageToEdit: null,
        lastModificationDate: null
    }),

    actions: {
        // Enregistre les pages dynamiques dans le store
        setDynamicpages(dynamicpages) {
            this.dynamicpages = dynamicpages;
        },

        // Retourne la liste des pages dynamiques
        getDynamicpages() {
            return this.dynamicpages;
        },

        // Enregistre la page dynamique à modifier dans le store
        setDynamicpageToEdit(dynamicpage) {
            this.dynamicpageToEdit = dynamicpage;
        },

        // Retourne la page dynamique à modifier
        getDynamicpageToEdit() {
            return this.dynamicpageToEdit;
        },

        // Ajoute une nouvelle section à la page à modifier
        addSection(section) {
            this.dynamicpageToEdit.content.push(section);
        },

        // Enregistre la section modifiée
        saveSectionEdited(sectionContent) {
            const sectionsStore = useSectionsStore();

            // On récupère l'index de la section
            const indexSection = this.dynamicpageToEdit.content.findIndex(el => el.id == sectionsStore.getSectionToEdit().id);

            // On lui change son contenu par la nouvelle page
            this.dynamicpageToEdit.content[indexSection].content = sectionContent;

            // On la supprime du store
            sectionsStore.removeSectionToEdit();
        },

        // Enregistre la page dynamique modifiée
        async saveDynamicpageEdited() {
            // On regarde si le store contient les pages dynamiques
            if (!this.dynamicpages) {
                // Si non, on les récupères dans le service
                this.dynamicpages = await DynamicpagesService.getDynamicpages ();
            }

            // On vient récupérer le titre de la page dynamique modifiée et l'attribuer à la page dans la liste
            // Exemple : Si je modifie le titre d'une page, il faut que dans la vue avec la liste des pages, le titre se mette à jour
            this.dynamicpages.find(el => el.directory == this.dynamicpageToEdit.directory).title = this.dynamicpageToEdit.title;

            // On enregistre tout dans le session storage
            DynamicpagesService.setDynamicpagesInSessionStorage(this.dynamicpages);
            DynamicpagesService.setDynamicpageInSessionStorage(this.dynamicpageToEdit);

            return {
                ok: true,
            }
        }
    }
})
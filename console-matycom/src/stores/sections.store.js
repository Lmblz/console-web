import { defineStore } from "pinia";
import Sections from "@/data/sections.json";

export const useSectionsStore = defineStore('sectionsStore', {
    state: () => ({
        sectionToEdit: null
    }),

    actions: {
        // Retourne la liste des sections
        getSectionsList() {
            return Sections;
        },

        // Enregistre la section à modifier dans le store
        setSectionToEdit(section) {
            this.sectionToEdit = section;
        },

        // Retourne la section à modifier
        getSectionToEdit() {
            return this.sectionToEdit;
        },

        // Supprime la section à modifier du store
        removeSectionToEdit() {
            this.sectionToEdit = null;
        }
    }

})
import { defineStore } from "pinia";
import { useSnackbarStore } from "./snackbar.store.js";
import * as ConditionsService from "@/services/ConditionsService";

export const useConditionStore = defineStore('conditionStore', {
    state: () => (
        {
            conditions: null,
            lastModificationDate: null
        }
    ),

    actions: {
        // Enregistre la liste des conditions dans le store
        setConditions(list) {
            this.conditions = list;
        },

        // Enregistre les versions d'une condition dans la propriété "items" de l'objet de la condition
        setConditionItems(title, items) {
            // On récupère la bonne condition dans la liste des conditions
            const el = this.conditions.find(el => el.title == title);

            // On lui attribut les différentes version dans la propriété items
            el.items = items;

            // Par sécurité, on vient attribuer les dates de suppression de chaque version
            this.addDeleteDates(el.url);

            // Pour chaque version, on vient chercehr laquelle est la version active
            el.items.forEach(item => {
                if (new Date(item.datePublish) < new Date && new Date(item.dateDelete) > new Date()) {
                    item.isActive = true;
                    return;
                } else {
                    item.isActive = false;
                }
            })
        },

        // Retourne les versions d'une condition
        getConditionItems(title) {
            return this.conditions.find(el => el.title == title).items;
        },

        // Retourne le contenu de la version d'une condition
        getCondition(title, id) {
            return this.conditions.find(el => el.title == title).items.find(el => el.id == id);
        },

        // Retourne le titre d'une condition
        getConditionTitle(param) {
            return this.conditions.find(el => el.url == param).title
        },

        // Enregistre la / les version.s modifiées d'une condition
        saveConditionEdited(param, id, newCondition) {
            // On modifie la date de dernière modification
            newCondition.lastModified = new Date().toISOString();

            // On récupère la condition
            const conditionList = this.conditions.find(el => el.url == param)

            // On récupère l'index de la version modifiée 
            const conditionIndex = conditionList.items.findIndex(el => el.id == id);
            if (conditionIndex == -1) return;

            // On remplace l'ancien élément par le nouveau
            conditionList.items.splice(conditionIndex, 1, newCondition);

            // On réattribut les dates
            this.addDeleteDates(param);

            ConditionsService.setConditionItemsInSS(conditionList);
        },

        // Ajoute un item à la liste des items d'une condition
        setConditionItem(title, item) {
            const conditionList = this.conditions.find(el => el.title == title);
            conditionList.items.push(item);
            this.addDeleteDates(conditionList.url)
        },

        // Ajoute les dates de suppression
        addDeleteDates(param) {
            const conditionList = this.conditions.find(el => el.url == param);

            // On les tri par ordre décroissant de publication
            conditionList.items.sort((a, b) => {
                return new Date(b.datePublish) - new Date(a.datePublish);
            })

            let dateDelete;

            conditionList.items.forEach((el, index) => {
                if (index == 0) {
                    // Si c'est le premier élément il ne doit pas avoir de date de fin, donc on force une date en 2099
                    el.dateDelete = "2099-12-29T00:00:00"
                } else {
                    // Sinon, il va prendre en date de suppression, la date de publication de la suivante
                    el.dateDelete = dateDelete;
                }

                dateDelete = el.datePublish;
            })
        }
    }
})
import { defineStore } from "pinia";
import * as NavigationService from "@/services/NavigationService.js"

export const useNavigationStore = defineStore('navigationStore', {
    state: () => (
        {
            list: [],
            editNav: [],
        }
    ),

    actions: {
        getNavigationItems() {
            return this.items;
        },

        getNavigationList() {
            return this.list;
        },

        setItems(items) {
            this.items = items;
        },

        getItem(id) {
            let result = null;

            function search(items) {
                for (const item of items) {
                    if (item.id === id) {
                        result = item;
                        return;
                    }
                    if (item.items && item.items.length > 0) {
                        search(item.items);
                    }
                }
            }

            search(this.editNav.items);
            return result;
        },

        setNavigationItem(data) {
            const itemIndex = this.list.findIndex(el => el.id == data.id);
            if (itemIndex != -1) {
                this.list[itemIndex].items = data.items;
            }
        },

        async setEditedNav(editNav) {
            const itemIndex = this.list.findIndex(el => el.id == editNav.id);

            if (itemIndex != -1) {
                this.list[itemIndex] = JSON.parse(JSON.stringify(editNav));
            }
        },

        setNavigationList(list) {
            this.list = list;
        },

        getNavigation(id) {
            if (this.list.length > 0 && this.list.findIndex(el => el.id == id) !== -1) {
                return this.list.find(el => el.id == id);
            }
        },

        addNewNavigation(navigation) {
            this.list.push(navigation);
        },

        getNavigationItem(id) {
            if (this.items.length > 0 && this.items.findIndex(el => el.id == id) != -1) {
                return this.items.find(el => el.id == id);
            }

            return null;
        },

        getDirectParent(id,) {
            let parent = null;

            function search(items) {
                for (const item of items) {
                    if (item.items && item.items.length > 0) {
                        for (const child of item.items) {
                            if (child.id === id) {
                                parent = item;
                                return;
                            }
                        }
                        search(item.items);
                    }
                }
            }

            search(this.editNav.items);
            return parent;
        },

        getRootParent(id) {
            let rootParent = null;

            function search(items, currentRoot) {
                for (const item of items) {
                    if (item.id === id) {
                        rootParent = currentRoot;
                        return;
                    }
                    if (item.items && item.items.length > 0) {
                        search(item.items, currentRoot ? currentRoot : item);
                    }
                }
            }

            search(this.editNav.items, null);
            return rootParent;
        },

        resetList() {
            this.list = [];
        }
    }
})
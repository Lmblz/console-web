import { defineStore } from "pinia";

export const useHellobarsStore = defineStore('hellobarsStore', {
    state: () => ({
        lastModificationDate: null,
        modificationArray: [],
    }),

    actions: {
        addEditedHellobar(id, title) {
            const index = this.modificationArray.findIndex(el => el.id == id);
            if (index != -1) this.modificationArray.splice(index, 1);

            const obj = {
                id: id,
                title: title
            };

            this.modificationArray.push(obj);
        }
    }
})
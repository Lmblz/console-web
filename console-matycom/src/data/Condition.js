import { useConditionStore } from "@/stores/conditions.store";
class Condition {
    constructor(title) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        this.title = title;
        this.content = this.getActiveContent(title);
        this.datePublish = new Date().toISOString().substring(0, 19);
        this.lastModified = new Date().toISOString().substring(0, 19);
        this.dateDelete = new Date().toISOString().substring(0, 19);
    }

    getActiveContent(title) {
        const store = useConditionStore();
        const activeContent = store.conditions.find(el => el.title == title).items.find(el => el.isActive == true).content;
        return activeContent;
    }
}

export default Condition
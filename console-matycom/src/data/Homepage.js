import Section from "./Section";
class Homepage {
    constructor(params) {
        this.id = this.getId();
        this.title = params.title ? params.title : "Nouvelle Homepage";
        this.dateDelete = ``;
        this.datePublish = params.datePublish ? params.datePublish : this.getPublishDate();
        this.content = params.content ? params.content : new Section("BannerSlider");
    }

    getId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    getPublishDate() {
        let d = new Date();
        d.setDate(d.getDate() + 1);
        // Problème de fuseau horaire
        d.setHours(d.getHours() + 2);
        return d.toISOString().slice(0, 16);
    }
}

export default Homepage;
class Navigation {
    constructor(
        title = "Nouvel Élément",
        htmlClass = "",
        items = [],
        id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        url = "/",
        isEncoded = false,
        depth = 0,
    ) {
        this.title = title;
        this.htmlClass = htmlClass;
        this.items = items;
        this.id = id;
        this.url = url;
        this.isEncoded = isEncoded;
        this.depth = depth;
    }
}

export default Navigation;
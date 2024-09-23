class Hellobar {
    constructor(params) {
        this.id = params.id ? params.id : Math.abs(~~(new Date().getTime()));
        this.title = params.title ? params.title : "Nouvelle hellobar";
        this.content = params.content ? params.content : "";
        this.background = params.background ? params.background : "#ff352f";
        this.color = params.color ? params.color : "#ffffff";
        this.dateCount = params.dateCount ? params.dateCount : null;
        this.publication = {
            dateDelete: params.dateDelete ? params.dateDelete : this.formatDate() + "T23:59",
            datePublish: params.datePublish ? params.datePublish : this.formatDate() + "T08:00"
        };
        this.support = params.support ? params.support : "both";
    }

    formatDate() {
        const d = new Date();
        let dd = d.getDate()
        dd.toString().length === 1 ? dd = '0' + dd.toString() : '';
        let mm = d.getMonth() + 1;
        mm.toString().length === 1 ? mm = '0' + mm.toString() : '';
        const yyyy = d.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    }

    formatTime() {
        const d = new Date();
        let hh = d.getHours()
        hh.toString().length === 1 ? hh = '0' + hh.toString() : '';
        let mm = d.getMinutes()
        mm.toString().length === 1 ? mm = '0' + mm.toString() : '';
        return `${hh}:${mm}`;
    }
}

export default Hellobar
class Section {
    constructor(name) {
        this.id = this.getId();
        this.name = name;
        this.initSection(name);
    }

    getId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    initSection(name) {
        let content;
        switch (name) {
            case "BannerSlider":
                this.class = "banner-slider";
                this.viewUrl = "~/Views/Shared/Components/Banners/BannerSliderVM.cshtml"
                content = {
                    "_type": "BannerSlider",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Banners.BannerSliderVM, ConsoleMatycom",
                    'name': "",
                    "items": [
                        this.getEmptyElement(name)
                    ]
                }
                this.content = content;
                break;

            case "BannerMedia":
                this.class = "banner-media";
                this.viewUrl = "~/Views/Shared/Components/Banners/BannerMediaVM.cshtml";
                content = {
                    "_type": "BannerMedia",
                    "name": "",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Banners.BannerMediaVM, ConsoleMatycom",
                    "title": {
                        "text": "",
                    },
                    "picture": {
                        "mobilePicture": {
                            "height": 750,
                            "width": 600,
                            "url": "/images/homepage/1-carrousel/desktop/banner-mobile",
                            "extension": "jpg"
                        },
                        "desktopPicture": {
                            "height": 700,
                            "width": 1920,
                            "url": "/images/homepage/1-carrousel/desktop/banner-desktop",
                            "extension": "jpg"
                        },
                    },
                    content: null,
                }
                this.content = content;
                break;

            case "EntriesList":
                this.class = "entries-list";
                this.viewUrl = "~/Views/Shared/Components/Lists/EntriesListVM.cshtml"
                content = {
                    "_type": "EntriesList",
                    "$type": "ConsoleMatycom.Models.HomePages.Components.Lists.EntriesListVM, ConsoleMatycom",
                    'name': "",
                    "entries": [
                        this.getEmptyElement("EntriesList")
                    ]
                }
                this.content = content;
                break;

            case "CardsSlider":
                this.class = "cards-slider";
                this.viewUrl = "~/Views/Shared/Components/CardsSliders/CardsSliderVM.cshtml"
                this.title = "Nouveau"
                content = {
                    "_type": "CardsSlider",
                    "$type": "ConsoleMatycom.Models.Components.Sections.CardsSlider.CardsSliderVM, ConsoleMatycom",
                    'name': "",
                    "dispayOrder": 0,
                    "slider": {
                        "titleH1": {
                            "text": "Titre H1"
                        },
                        "titleH2": {
                            "text": "Titre H2"
                        },
                        "titleH3": {
                            "text": ""
                        },
                        "logo": "",
                        "slider": {
                            "isInstaSlider": false,
                            "items": [
                                {
                                    "id": this.getId(),
                                    "url": "",
                                    "image": {
                                        "url": "",
                                        "picture": {
                                            "isLazyLoad": true,
                                            "desktopPicture": {
                                                "url": "/images/homepage/3-cards-edition-limitee/slider",
                                                "width": "300",
                                                "height": "300",
                                                "extension": "jpg"
                                            },
                                            "mobilePicture": {
                                                "url": "/images/homepage/3-cards-edition-limitee/slider",
                                                "width": "300",
                                                "height": "300",
                                                "extension": "jpg"
                                            }
                                        },
                                        "secondaryPicture": null
                                    },
                                    "content": {
                                        "title": {
                                            "text": "Nouvel élément"
                                        },
                                        "description": {
                                            "text": "",
                                        },
                                        "button": {
                                            "text": "",
                                            "class": "button -link -underline"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "cards": {
                        "title": {
                            "text": "Titre"
                        },
                        "cards": [
                            {
                                "id": this.getId(),
                                "sectionId": "en-ce-moment",
                                "position": 1,
                                "image": {
                                    "url": "",
                                    "picture": {
                                        "isLazyLoad": true,
                                        "desktopPicture": {
                                            "url": "/images/homepage/2-en-ce-moment/cards",
                                            "width": "350",
                                            "height": "300",
                                            "extension": "jpg"
                                        },
                                        "mobilePicture": {
                                            "url": "/images/homepage/2-en-ce-moment/cards",
                                            "width": "350",
                                            "height": "300",
                                            "extension": "jpg"
                                        }
                                    }
                                },
                                "content": {
                                    "title": "Nouvelle card",
                                    "url": "",
                                    "text": {
                                        "class": "",
                                        "text": "Texte"
                                    },
                                    "button": {
                                        "text": "<p><b>Je participe</b></p>",
                                        "encodedUrl": ""
                                    }
                                }
                            }
                        ]
                    }

                }
                this.content = content;
                break;

            case "CardsSliderInsta":
                this.name = "CardsSlider";
                this.class = "cards-slider";
                this.viewUrl = "~/Views/Shared/Components/CardsSliders/CardsSliderVM.cshtml"
                this.title = "Nouveau"
                content = {
                    "_type": "CardsSlider",
                    "$type": "ConsoleMatycom.Models.Components.Sections.CardsSlider.CardsSliderVM, ConsoleMatycom",
                    'name': "",
                    "dispayOrder": 0,
                    "slider": {
                        "titleH1": {
                            "text": ""
                        },
                        "titleH2": {
                            "text": "Titre H2"
                        },
                        "titleH3": {
                            "text": "Titre H3"
                        },
                        "logo": "/images/components/Instagram/logo-instagram-socialwall",
                        "slider": {
                            "isInstaSlider": true,
                        }
                    },
                    "cards": {
                        "title": {
                            "text": "Titre"
                        },
                        "cards": [
                            {
                                "id": this.getId(),
                                "sectionId": "en-ce-moment",
                                "position": 1,
                                "image": {
                                    "url": "",
                                    "picture": {
                                        "isLazyLoad": true,
                                        "desktopPicture": {
                                            "url": "/images/homepage/2-en-ce-moment/cards",
                                            "width": "350",
                                            "height": "300",
                                            "extension": "jpg"
                                        },
                                        "mobilePicture": {
                                            "url": "/images/homepage/2-en-ce-moment/cards",
                                            "width": "350",
                                            "height": "300",
                                            "extension": "jpg"
                                        }
                                    }
                                },
                                "content": {
                                    "title": "Nouvelle card",
                                    "url": "",
                                    "text": {
                                        "class": "",
                                        "text": "Texte"
                                    },
                                    "button": {
                                        "text": "<p><b>Je participe</b></p>",
                                        "encodedUrl": ""
                                    }
                                }
                            }
                        ]
                    }

                }
                this.content = content;
                break;

            case "ProductsSliderSection":
                this.class = "product-slider";
                this.viewUrl = "~/Views/Shared/Components/Banners/BannerSliderVM.cshtml"
                content = {
                    "$type": "ConsoleMatycom.Models.Components.Sections.Sliders.ProductsSliderVM, ConsoleMatycom",
                    'name': "",
                    "description": {
                        "title": "Meilleures ventes"
                    },
                    "backgroundColor": "#f2f2f2",
                    "merchandisingActionCode": ""
                }
                this.content = content;
                break;

            case "GridList":
                this.class = "grid-list";
                this.viewUrl = "~/Views/Shared/Components/Lists/GridListVM.cshtml"
                let gridsId = () => {
                    let idsArr = []
                    for (let i = 0; i < 4; i++) {
                        idsArr.push((this.getId() + i).substring(1));
                    }
                    return idsArr
                }
                content = {
                    "_type": "GridList",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Lists.GridListVM, ConsoleMatycom",
                    'name': "",
                    "title": {
                        "text": "Titre"
                    },
                    "grids": [
                        this.getEmptyElement("GridList"),
                        this.getEmptyElement("GridList"),
                        this.getEmptyElement("GridList"),
                        this.getEmptyElement("GridList"),
                    ]
                }
                this.content = content;
                break;

            case "GridPictures":
                this.class = "grid-pictures";
                this.viewUrl = "~/Views/Shared/Components/Grids/GridPicturesVM.cshtml";
                content = {
                    "_type": "GridPictures",
                    "name": "",
                    "titleH2": {
                        "text": ""
                    },
                    "items": [
                        {
                            "id": this.getId(),
                            "mediaType": "Picture",
                            "mediaFormat": "DemiBanner",
                            "picture": {
                                "mobilePicture": {
                                    "height": 450,
                                    "width": 600,
                                    "url": "",
                                    "extension": "jpg",
                                },
                                "desktopPicture": {
                                    "height": 650,
                                    "width": 950,
                                    "url": "",
                                    "extension": "jpg",
                                },
                                "isLazyLoad": true,
                                "minWidth": "600",
                                "fetchPriority": null
                            },
                            "video": {
                                "mobileVideo": {
                                    "height": 450,
                                    "width": 600,
                                    "url": "",
                                    "extension": "mp4",
                                    "poster": {
                                        "url": "",
                                        "width": 0,
                                        "height": 0,
                                        "extension": "jpg"
                                    }
                                },
                                "desktopVideo": {
                                    "height": 650,
                                    "width": 950,
                                    "url": "",
                                    "extension": "mp4",
                                    "poster": {
                                        "url": "",
                                        "width": 0,
                                        "height": 0,
                                        "extension": "jpg"
                                    }
                                },
                            },
                            "title": {
                                "text": "Nouvelle ligne"
                            },
                            "description": {
                                "text": ""
                            },
                            "buttons": []
                        }
                    ],
                    "$type": "ConsoleMatycom.Models.Components.Sections.Grids.GridPicturesVM, ConsoleMatycom"
                }
                this.content = content;
                break;

            case "SimpleImages":
                this.class = "simple-images -more-items-2";
                this.viewUrl = "~/Views/Shared/Components/Images/SimpleImagesVM.cshtml"
                let simpleImagesId = () => {
                    let idsArr = []
                    for (let i = 0; i < 2; i++) {
                        idsArr.push((this.getId() + i).substring(1));
                    }
                    return idsArr
                }
                content = {
                    "_type": "SimpleImages",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Images.SimpleImagesVM, ConsoleMatycom",
                    'name': "",
                    "title": {
                        "text": "Titre"
                    },
                    "description": {
                        "text": ""
                    },
                    "images": [
                        this.getEmptyElement("SimpleImages"),
                        this.getEmptyElement("SimpleImages")
                    ]
                }
                this.content = content;
                break;

            case "SubsectionsEntries":
                this.class = "subsections-entries";
                this.viewUrl = "~/Views/Shared/Components/Subsections/SubsectionsEntriesVM.cshtml"
                let subsectionsId = () => {
                    let idsArr = []
                    for (let i = 0; i < 3; i++) {
                        idsArr.push((this.getId() + i).substring(1));
                    }
                    return idsArr
                }
                content = {
                    "_type": "SubsectionsEntries",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Subsections.SubsectionsEntriesVM, ConsoleMatycom",
                    'name': "",
                    "entries": [
                        this.getEmptyElement("SubsectionsEntries")
                    ]
                }
                this.content = content;
                break;

            case "Partners":
                this.class = "partners";
                this.viewUrl = "~/Views/Shared/Components/Partners/PartnersVM.cshtml"
                content = {
                    "_type": "Partners",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Partners.PartnersVM, ConsoleMatycom",
                    'name': "",
                    "title": {
                        "text": "Titre"
                    },
                    "items": [
                        this.getEmptyElement("Partners")
                    ],
                    "descriptionArea": {
                        "button": {
                            "encodedUrl": "",
                            "text": "En savoir plus"
                        }
                    }
                }
                this.content = content;
                break;

            case "RawHtml":
                this.class = "raw-html";
                this.viewUrl = "~/Views/Shared/Components/Others/RawHtmlVM.cshtml"
                content = {
                    "_type": "RawHtml",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Html.RawHtmlVM, ConsoleMatycom",
                    'name': "",
                    "html": `<p></p>`

                }
                this.content = content = content;
                break;

            case "SimpleText":
                this.class = "simple-text";
                this.viewUrl = "~/Views/Shared/Components/Others/SimpleTextVM.cshtml";
                content = {
                    "_type": "SimpleText",
                    "titleH1": {
                        "text": ""
                    },
                    "titleH2": {
                        "text": "Titre H2"
                    },
                    "titleH3": {
                        "text": "Titre H3"
                    },
                    "description": {
                        "text": "Description"
                    },
                    "button": {
                        "text": "",
                        "url": "/",
                        "class": "button -black -bgtransparent -big"
                    },
                    "$type": "ConsoleMatycom.Models.Components.Sections.Others.SimpleTextVM, ConsoleMatycom"
                }
                this.content = content;
                break;

            case "SimpleListing":
                this.class = "simple-listing";
                this.viewUrl = "~/Views/Shared/Components/Others/SimpleListingVM.cshtml";
                this.content = {
                    "_type": "SimpleListing",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Others.SimpleListingVM, ConsoleMatycom",
                    "title": {
                        "text": "Titre",
                        "url": "",
                    },
                    "content": [
                        this.getEmptyElement("SimpleListing")
                    ]
                }
                break;

            case "PictureCard":
                this.class = "picture-card";
                this.viewUrl = "~/Views/Shared/Components/Others/PictureCardVM.cshtml";
                this.content = {
                    "_type": "PictureCard",
                    "$type": "ConsoleMatycom.Models.Components.Sections.Others.PictureCardVM, ConsoleMatycom",
                    "id": "",
                    "titleH2": {
                        "text": "Titre H2",
                        "url": "",
                    },
                    "description": {
                        "text": "Description"
                    },
                    "image": {
                        "url": "",
                        "picture": {
                            "alt": "",
                            "desktopPicture": {
                                "url": "",
                                "width": "1000",
                                "height": "500",
                                "extension": "jpg"
                            },
                            "mobilePicture": {
                                "url": "",
                                "width": "560",
                                "height": "467",
                                "extension": "jpg"
                            }
                        }
                    },
                    "typeCard": "ProductCard",
                    "card": {
                        "reference": "",
                        "title": "",
                        "brand": "",
                        "price": {
                            "sellingPrice": 0,
                            "crossedOutPrice": 0,
                            "discountRate": 0,
                            "discountAmount": 0,
                            "hasDiscount": false,
                        },
                        "encodedUrl": "",
                        "picture": {
                            "url": "",
                            "width": 250,
                            "height": 250,
                            "extension": "jpg"
                        },
                        "button": {
                            "text": "",
                            "url": "",
                            "encodedUrl": "",
                            "class": "button -black -bgtransparent -fw"
                        }
                    },
                    "simpleCard": {
                        "button": {
                            "text": "",
                            "class": "button -link -underline -bold",
                            "encodedUrl": "",
                            "url": "",
                        },
                        "description": {
                            "class": "",
                            "text": "",
                        },
                        "titleH3": {
                            "text": "",
                            "url": "",
                            "hasShadow": false,
                        }
                    }
                }
                break;

            case "":
                content = {}
                this.content = content;
                console.warn("Aucun type de section n'est renseigné")
                break;
        }
    }

    getEmptyElement(name, detail) {
        let elem = {};
        switch (name) {
            case "BannerSlider":
                elem = {
                    "id": this.getId(),
                    "position": 0,
                    "url": "",
                    "titleH1": {
                        "text": "Nouvel élément",
                        "url": "",
                    },
                    "titleH2": {
                        "text": "",
                        "url": "",
                    },
                    "button": {
                        "text": "JE DÉCOUVRE",
                        "class": "button -bgtransparent -white -bold",
                        "url": "",
                        "encodedUrl": "",
                    },
                    "desktopContent": [
                        {
                            "isPicture": true,
                            "desktopUrl": "/images/HomePage/1-carrousel/desktop/banner-desktop",
                            "mobileUrl": "/images/HomePage/refonte-v4/final/pix"
                        }
                    ],
                    "mobileContent": {
                        "isPicture": true,
                        "desktopUrl": "/images/HomePage/refonte-v4/final/pix",
                        "mobileUrl": "/images/HomePage/1-carrousel/mobile/banner-mobile",
                    },
                    "type": "full"
                }
                break;

            case "BannerMedia":
                elem = {
                    button: {
                        text: "Découvrir",
                        url: "/",
                        class: "button -white -bgfull -center"
                    },
                    description: {
                        text: "",
                    },
                    titleH2: {
                        text: "",
                    }
                }
                break;

            case "EntriesList":
                elem = {
                    "id": this.getId(),
                    "text": "Nouvelle entrée",
                    "url": "/bijoux.html",
                    "class": "button -black -bgtransparent -rounded"
                }
                break;

            case "CardsSlider":
                if (detail == "card") {
                    elem = {
                        "id": this.getId(),
                        "sectionId": "en-ce-moment",
                        "position": 1,
                        "image": {
                            "url": "",
                            "picture": {
                                "isLazyLoad": true,
                                "desktopPicture": {
                                    "url": "/images/homepage/2-en-ce-moment/cards",
                                    "width": "350",
                                    "height": "300",
                                    "extension": "jpg"
                                },
                                "mobilePicture": {
                                    "url": "/images/homepage/2-en-ce-moment/cards",
                                    "width": "350",
                                    "height": "300",
                                    "extension": "jpg"
                                }
                            }
                        },
                        "content": {
                            "title": "Nouvelle card",
                            "url": "",
                            "text": {
                                "class": "",
                                "text": "Texte"
                            },
                            "button": {
                                "text": "<p><b>Je participe</b></p>",
                                "encodedUrl": ""
                            }
                        }
                    }
                } else if (detail == "slide") {
                    elem = {
                        "id": this.getId(),
                        "url": "",
                        "image": {
                            "url": "",
                            "picture": {
                                "isLazyLoad": true,
                                "desktopPicture": {
                                    "url": "/images/homepage/3-cards-edition-limitee/slider",
                                    "width": "300",
                                    "height": "300",
                                    "extension": "jpg"
                                },
                                "mobilePicture": {
                                    "url": "/images/homepage/3-cards-edition-limitee/slider",
                                    "width": "300",
                                    "height": "300",
                                    "extension": "jpg"
                                }
                            },
                            "secondaryPicture": null
                        },
                        "content": {
                            "title": {
                                "text": "Nouvel élément"
                            },
                            "description": {
                                "text": "",
                            },
                            "button": {
                                "text": "",
                                "class": "button -link -underline"
                            }
                        }
                    }
                }

                break;

            case "GridList":
                elem = {
                    "id": this.getId(),
                    "content": {
                        "title": "Nouvel élément <span class=\"title-link\">Tous les bijoux</span>",
                        "url": "",
                        "urlMoreInfo": ""
                    },
                    "image": {
                        "url": "",
                        "picture": {
                            "isLazyLoad": true,
                            "desktopPicture": {
                                "url": "/images/homepage/4-collections-iconiques/grid-big-desktop",
                                "width": "400",
                                "height": "550",
                                "extension": "jpg"
                            },
                            "mobilePicture": {
                                "url": "/images/homepage/4-collections-iconiques/grid-mobile",
                                "width": "400",
                                "height": "550",
                                "extension": "jpg"
                            }
                        }
                    }
                }
                break;

            case "GridPictures":
                elem = {
                    "id": this.getId(),
                    "mediaType": "Picture",
                    "mediaFormat": "DemiBanner",
                    "picture": {
                        "mobilePicture": {
                            "height": 450,
                            "width": 600,
                            "url": "",
                            "extension": "jpg",
                        },
                        "desktopPicture": {
                            "height": 650,
                            "width": 950,
                            "url": "",
                            "extension": "jpg",
                        },
                        "isLazyLoad": true,
                        "minWidth": "600",
                        "fetchPriority": null
                    },
                    "video": {
                        "mobileVideo": {
                            "height": 450,
                            "width": 600,
                            "url": "",
                            "extension": "mp4",
                            "poster": {
                                "url": "",
                                "width": 0,
                                "height": 0,
                                "extension": "jpg"
                            }
                        },
                        "desktopVideo": {
                            "height": 650,
                            "width": 950,
                            "url": "",
                            "extension": "mp4",
                            "poster": {
                                "url": "",
                                "width": 0,
                                "height": 0,
                                "extension": "jpg"
                            }
                        },
                    },
                    "title": {
                        "text": "Nouvelle ligne"
                    },
                    "description": {
                        "text": ""
                    },
                    "buttons": []
                }
                break;

            case "SimpleImages":
                elem = {
                    "id": this.getId(),
                    "url": "",
                    "picture": {
                        "alt": "",
                        "isLazyLoad": true,
                        "desktopPicture": {
                            "url": "/images/homepage/5-banners-inspirations-mois/simple-images",
                            "width": "800",
                            "height": "400",
                            "extension": "jpg"
                        },
                        "mobilePicture": {
                            "url": "/images/homepage/5-banners-inspirations-mois/simple-images",
                            "width": "800",
                            "height": "400",
                            "extension": "jpg"
                        }
                    }
                }
                break;

            case "SubsectionsEntries":
                elem = {
                    "id": this.getId(),
                    "isActive": true,
                    "subsectionId": 1,
                    "title": {
                        "text": "Nouvelle sous-section"
                    },
                    "content": {
                        "items": [
                            {
                                "id": this.getId(),
                                "title": "Nouvel élément",
                                "encodedUrl": "",
                                "url": "",
                                "picture": {
                                    "isLazyLoad": true,
                                    "desktopPicture": {
                                        "url": "/images/homepage/6-Visuels-atelier-creation/subsection",
                                        "width": "300",
                                        "height": "300",
                                        "extension": "jpg"
                                    },
                                    "mobilePicture": {
                                        "url": "/images/homepage/6-Visuels-atelier-creation/subsection",
                                        "width": "300",
                                        "height": "300",
                                        "extension": "jpg"
                                    }
                                }
                            }
                        ]
                    }
                }
                break;

            case "SimpleListing":
                elem = {
                    "id": this.getId(),
                    "title": {
                        "text": "Nouveau contenu",
                        "url": ""
                    },
                    "description": {
                        "text": ""
                    },
                    "picture": {
                        "mobilePicture": {
                            "url": "",
                            "width": 560,
                            "height": 467,
                            "extension": "jpg",
                        },
                        "desktopPicture": {
                            "url": "",
                            "width": 1000,
                            "height": 500,
                            "extension": "jpg",
                        },
                        "isLazyLoad": true,
                        "alt": ""
                    }
                }
                break;

            case "Partners":
                elem = {
                    "id": this.getId(),
                    "description": {
                        "class": "",
                        "text": "Nouveau partenaire"
                    },
                    "logo": {
                        "picture": {
                            "isLazyLoad": true,
                            "desktopPicture": {
                                "url": "/images/homepage/10-logos-engagements/partner",
                                "width": "180",
                                "height": "180",
                                "extension": "jpg"
                            },
                            "mobilePicture": {
                                "url": "/images/homepage/10-logos-engagements/partner",
                                "width": "180",
                                "height": "180",
                                "extension": "jpg"
                            }
                        }
                    }
                }
                break;
        }

        return elem;
    }

    getEmptyCta() {
        const elem = {
            "text": "",
            "class": "button -black -bgtransparent",
            "encodedUrl": ""
        }

        return elem;
    }

    get$Type(name) {
        const base$TypePath = "ConsoleMatycom.Models.Components.Sections.";
        const endBase$TypePath = ", ConsoleMatycom";
        let relative$Type = null;
        let $type = null;
        switch (name) {
            case "BannerMedia":
                relative$Type = "Banners.BannerMediaVM";
                break;
            case "BannerSlider":
                relative$Type = "Banners.BannerSliderVM";
                break;
            case "EntriesList":
                relative$Type = "Lists.EntriesListVM";
                break;
            case "CardsSlider":
                relative$Type = "CardsSlider.CardsSliderVM";
                break;
            case "GridList":
                relative$Type = "Lists.GridListVM";
                break;
            case "GridPictures":
                relative$Type = "Grids.GridPicturesVM";
                break;
            case "SimpleText":
                relative$Type = "Others.SimpleTextVM";
                break;
            case "SimpleImages":
                relative$Type = "Images.SimpleImagesVM";
                break;
            case "SimpleListing":
                relative$Type = "Others.SimpleListingVM";
                break;
            case "PictureCard":
                relative$Type = "Others.PictureCardVM";
                break;
            case "ProductsSliderSection":
                relative$Type = "Sliders.ProductsSliderVM";
                break;
            case "SubsectionsEntries":
                relative$Type = "Subsections.SubsectionsEntriesVM";
                break;
            case "Partners":
                relative$Type = "Partners.PartnersVM";
                break;
            case "RawHtml":
                relative$Type = "Html.RawHtmlVM";
                break;
            default:
                alert("Problème lors de l'attribution du type d'objet : " + name);
                break;
        }

        if (relative$Type) {
            $type = base$TypePath + relative$Type + endBase$TypePath;
        }

        if ($type) return $type;
    }
}

export default Section;
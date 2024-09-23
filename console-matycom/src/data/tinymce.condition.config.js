const tinymceConditionConfig = {
    license_key: 'gpl',
    plugins: ['visualblocks', 'fullscreen', 'anchor', 'code', 'link', 'autoresize', 'lists', 'table', 'autolink'],
    visualblocks_default_state: true,
    relative_urls: false,
    newline_behavior: 'default',
    end_container_on_empty_block: true,
    allow_html_in_named_anchor: true,
    relative_urls: false,
    entity_encoding: 'raw',
    table_resize_bars: false,
    object_resizing: false,
    convert_urls: false,
    remove_script_host: true,
    allow_script_urls: true,
    toolbar_sticky: true,
    default_link_target: '_blank',
    table_column_resizing: 'resizetable',
    table_use_colgroups: true,
    link_context_toolbar: true,
    encoding: 'UTF-8',
    toolbar: 'undo redo | styles | newArticle | bold italic casechange | link unlink | alignleft aligncenter | bullist numlist | outdent indent | table code fullscreen',
    style_formats: [
        {
            title: 'Types de blocs',
            items: [
                { title: 'Article', block: 'article', classes: 'article', wrapper: true, merge_siblings: false },
                { title: 'Mise en avant', block: 'div', classes: 'highlight', wrapper: true, merge_siblings: false },
                { title: 'Mentions', block: 'div', classes: 'mentions', wrapper: true, merge_siblings: false },
                { title: 'Bordure', block: 'div', classes: 'border', wrapper: true, merge_siblings: false },
            ],
        },
        {
            title: 'Types de texte',
            items: [
                { title: 'Titre de la section', block: 'h1', classes: 'maintitle' },
                { title: 'Titre de l\'article', block: 'h2', classes: 'title' },
                { title: 'Sous-titre', block: 'h3', classes: 'subtitle' },
                { title: 'Paragraphe', block: 'p' },
            ],
        },
    ],
    link_list: [
        { title: 'CGV Maty', value: 'https://www.maty.com/conditions-generales-vente.html' },
        { title: 'CG Marketplace', value: 'https://www.maty.com/marketplace/cgv-maty.html' },
        { title: 'CGU Vendeurs Marketplace', value: 'https://www.maty.com/marketplace/annexe-cgu.html' },
        { title: 'CG Programme Fidélité', value: 'https://www.maty.com/conditions-generales-programme-de-fidelite.html' },
        { title: 'CG Service Location', value: 'https://www.maty.com/conditions-generales-de-location.html' },
        { title: 'CG Cartes Cadeaux', value: 'https://www.maty.com/conditions-generales-vente-cartes-cadeaux.html' },
        { title: 'CG Ingenico', value: 'https://www.maty.com/marketplace/cgu-annexe-cg-ingenio.html' },
        { title: 'Protection Vie Privée', value: 'https://www.maty.com/vie-privee.html' },
        { title: 'Mentions Légales', value: 'https://www.maty.com/mentions-legales.html' },
    ],
    content_css: [
        '/dist/site.min.css',
    ],
    setup: function (editor) {
        class EmptyArticle {
            constructor() {
                this.articleElement = document.createElement('article');
                this.articleElement.className = 'article';
                this.articleElement.id = "article";

                const titleElement = document.createElement('h2');
                titleElement.className = 'title';
                titleElement.innerHTML = 'Article';

                const paragraphElement = document.createElement('p');
                paragraphElement.innerHTML = "Contenu";

                this.articleElement.appendChild(titleElement);
                this.articleElement.appendChild(paragraphElement);
            }

            getElement() {
                return this.articleElement;
            }
        }

        var isInArticle = (selectedBlocks) => {
            return selectedBlocks.some(block => {
                let response;
                if (editor.dom.getParent(block, 'article') !== null) {
                    response = block.nodeName.toLowerCase() === 'article' || editor.dom.getParent(block, 'article').nodeName.toLowerCase() === "article";
                } else {
                    response = block.nodeName.toLowerCase() === 'article';

                }
                return response;
            });
        };

        // Ajout d'article
        const newArticle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();
            const emptyArticle = new EmptyArticle().getElement();

            if (!isInArticle(selectedBlocks)) {
                editor.dom.insertAfter(emptyArticle, selectedBlocks[0]);
                if (selectedBlocks[0].nodeName === "P" || selectedBlocks[0].nodeName === "H2") {
                    editor.dom.remove(selectedBlocks[0]);
                }
            } else {
                const article = editor.dom.getParent(selectedBlocks[0], "article");
                editor.dom.insertAfter(emptyArticle, article);
            }

            const newArticleElement = editor.dom.get(emptyArticle);
            const titleElement = newArticleElement.querySelector("h2");

            // Place le curseur dans le h2
            editor.selection.setCursorLocation(titleElement, 0);
            editor.focus();
        };

        const newMaintitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (!isInArticle(selectedBlocks)) {
                editor.insertContent(`<article class="article"><h1 class="maintitle"></h1></article>`);
            }
        }

        const newTitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (isInArticle(selectedBlocks)) {
                editor.insertContent(`<h2 class="title"></h1>`);
            }
        }

        const replaceMaintitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (isInArticle(selectedBlocks)) {
                // Vérifiez si un bloc est sélectionné
                if (selectedBlocks.length > 0) {
                    const currentBlock = selectedBlocks[0];
                    editor.dom.removeClass(currentBlock);
                    // Appliquez la classe 'title' à l'élément actuel
                    editor.dom.addClass(currentBlock, 'maintitle');
                }
            }
        }

        const replaceTitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (isInArticle(selectedBlocks)) {
                // Vérifiez si un bloc est sélectionné
                if (selectedBlocks.length > 0) {
                    const currentBlock = selectedBlocks[0];
                    editor.dom.removeClass(currentBlock);
                    // Appliquez la classe 'title' à l'élément actuel
                    editor.dom.addClass(currentBlock, 'title');
                }
            }
        }

        const newSubtitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (isInArticle(selectedBlocks)) {
                editor.insertContent(`<h3 class="subtitle"></h1>`);
            }
        };

        const replaceSubtitle = () => {
            const selectedBlocks = editor.selection.getSelectedBlocks();

            if (isInArticle(selectedBlocks)) {
                // Vérifiez si un bloc est sélectionné
                if (selectedBlocks.length > 0) {
                    const currentBlock = selectedBlocks[0];
                    editor.dom.removeClass(currentBlock);
                    // Appliquez la classe 'title' à l'élément actuel
                    editor.dom.addClass(currentBlock, 'subtitle');
                }
            }
        }

        editor.ui.registry.addButton('newArticle', {
            name: 'Ajouter un article',
            text: 'Ajouter un article',
            icon: 'plus',
            tooltip: 'Ajouter un article',
            onAction: () => newArticle()
        });

        editor.addShortcut('meta+alt+a', 'Ajoute un nouvel article', () => {
            newArticle();
        })

        editor.addShortcut('meta+alt+1', 'Ajoute un nouveau titre principal', () => {
            newMaintitle();
        })

        editor.addShortcut('meta+alt+2', 'Ajoute un nouveau titre principal', () => {
            newTitle();
        })

        editor.addShortcut('meta+alt+3', 'Ajoute un nouveau sous-titre', () => {
            newSubtitle();
        })

        editor.shortcuts.add('Shift+Alt+1', 'Remplace l\'élément par un titre de section', function () {
            replaceMaintitle();
        });

        editor.shortcuts.add('Shift+Alt+2', 'Remplace l\'élément par un titre d\'article', function () {
            replaceTitle();
        });

        editor.shortcuts.add('Shift+Alt+3', 'Remplace l\'élément par un sous-titre d\'article', function () {
            replaceSubtitle();
        });

        editor.on('keydown', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                // On met un timeout pour que la fonction s'exécute après le retour à la ligne
                // sinon ne crée pas l'article quand on arrive à la racine
                setTimeout(() => {
                    const selectedNode = editor.selection.getNode();
                    const parentArticle = editor.dom.getParent(selectedNode, 'article');
                    if (!parentArticle || selectedNode.tagName === 'ARTICLE') {
                        event.preventDefault();
                        newArticle();
                    }
                })
            }
        });
    },

}

export default tinymceConditionConfig
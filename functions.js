import{extracted}from '/scripts.js'
import { authors } from './data.js'



export const htmlSelector ={

    listItems : document.querySelector('[data-list-items]'),
    searchGenres : document.querySelector('[data-search-genres]'),
    searchAuthors : document.querySelector('[data-search-authors]'),
    settingsTheme : document.querySelector('[data-settings-theme]'),
    listButton : document.querySelector('[data-list-button]'),
    searchCancel : document.querySelector('[data-search-cancel]'),
    searchOverlay : document.querySelector('[data-search-overlay]'),
    settingsCancel:  document.querySelector('[data-settings-cancel]'),
    settingsOverlay : document.querySelector('[data-settings-overlay]'),
    settingsForm : document.querySelector('[data-settings-form]'),
    listClose : document.querySelector('[data-list-close]'),
    listActive : document.querySelector('[data-list-active]'),
    headerSearch :document.querySelector(`[data-header-search]`),
    searchTitle : document.querySelector('[data-search-title]'),
    searchForm :  document.querySelector('[data-search-form]'),
    listMessage : document.querySelector('[data-list-message]'),
    headerSettings : document.querySelector("[data-header-settings]")

}

/**
createPreview - creates a preview element for a book with the given props
@param {Object} props - an object with properties of the book, including author, id, image, and title
@param {string} props.author - the id of the book's author in the authors object
@param {string} props.id - the id of the book
@param {string} props.image - the url of the book's cover image
@param {string} props.title - the title of the book
@returns {HTMLElement} - a button element with the book's preview
*/

export const createPreview = (props) => {
    
    const { author: authorId, id, image, title } = props

    let element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `

    return element
}




/**

Creates a document fragment of book previews from a given array of books,
starting at the specified start index and ending at the specified end index.
@param {Array} array - The array of books to extract the previews from
@param {Number} start - The index to start extracting from
@param {Number} end - The index to end extracting at
@returns {DocumentFragment} - A document fragment containing the book previews
*/


// 5
export const createPreviewsFragment  = (array , start, end) => {
    
    const extracted = array.slice(start, end);

    let fragment = document.createDocumentFragment();

    for (let book of extracted){

        let { author, image, title, id } = book;
    
        const preview = createPreview( {
            author,
            id,
            image,
            title,
        });
        fragment.appendChild(preview);
    };
    return fragment;
};


import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { htmlSelector,genreOptions, authorOptions, applyTheme,updateListItems } from './functions.js';



let page = 1;
let matches = books

/**
 * Generates book previews and appends them to the book list.
 *
 * @param {Array} books - The array of books to generate previews for.
 */
const bookPreviews = (books) => {
    const starting = document.createDocumentFragment();
  
    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
  
      element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
  
      starting.appendChild(element);
    }
  
    htmlSelector.listItems.appendChild(starting);
}


const handleSearchCancelClick = () => {
    htmlSelector.searchOverlay.open = false;
  };
  
  const handleSettingsCancelClick = () => {
    htmlSelector.settingsOverlay.open = false;
  };
  
  const handleHeaderSearchClick = () => {
    htmlSelector.searchOverlay.open = true;
    htmlSelector.searchTitle.focus();
  };
  
  const handleHeaderSettingsClick = () => {
    htmlSelector.settingsOverlay.open = true;
  };
  
  const handleListCloseClick = () => {
    htmlSelector.listActive.open = false;
  };
  


/**
 * Handles the submission of the settings form.
 *
 * @param {Event} event - The form submission event.
 */

const handleSettingsFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
  
    if (theme === 'night') {
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
  
    htmlSelector.settingsOverlay.open = false;
  };
  


//7   The handleSearchFormSubmit function now uses the filters object to apply the filtering logic for each filter defined in the form. It iterates over the form values and checks if each filter matches the corresponding book.

//7   If  more filters needed to be added, you can simply add them to the filters object without modifying the existing code. Each filter should have an apply method that defines the filtering behavior.
const filters = {
    title: {
      apply: (book, value) => {
        return value.trim() === '' || book.title.toLowerCase().includes(value.toLowerCase());
      },
    },
    author: {
      apply: (book, value) => {
        return value === 'any' || book.author === value;
      },
    },
    genre: {
      apply: (book, value) => {
        return value === 'any' || book.genres.includes(value);
      },
    },
  };

 

/**
 * Handles the form submission event for the search form.
 * Filters the books based on the form input values and updates the book list accordingly.
 *
 * @param {Event} event - The form submission event.
 */
const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData);
    const result = [];
  
    for (const book of books) {
      let match = true;
  
      for (const [filterName, filterValue] of Object.entries(formValues)) {
        if (filters[filterName] && !filters[filterName].apply(book, filterValue)) {
          match = false;
          break;
        }
      }
  
      if (match) {
        result.push(book);
      }
    }
  
    page = 1;
    matches = result;
  
    if (result.length < 1) {
      htmlSelector.listMessage.classList.add('list__message_show');
    } else {
      htmlSelector.listMessage.classList.remove('list__message_show');
    }
  
    updateListItems(result);
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
    htmlSelector.searchOverlay.open = false;
};

  
/**
 * Handles the click event on the list button to load more book previews.
 * Retrieves the next set of book previews and appends them to the list view.
 */
const handleListButtonClick = () => {
    const fragment = document.createDocumentFragment();
  
    for (const { author, id, image, title } of matches.slice(
      page * BOOKS_PER_PAGE,
      (page + 1) * BOOKS_PER_PAGE
    )) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
  
      element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
  
      fragment.appendChild(element);
    }
  
    htmlSelector.listButton.disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;
  
    htmlSelector.listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${
        matches.length - page * BOOKS_PER_PAGE > 0
          ? matches.length - page * BOOKS_PER_PAGE
          : 0
      })</span>`;
  
    htmlSelector.listItems.appendChild(fragment);
  
    page += 1;
  };
  


/**
 * Handles the click event on a list item.
 * Retrieves the corresponding book information and displays it in the active list view.
 *
 * @param {Event} event - The click event object.
 */
const handleListItemClick = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;
  
    for (const node of pathArray) {
      if (active) break;
  
      if (node?.dataset?.preview) {
        let result = null;
  
        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }
  
        active = result;
      }
    }
  
    if (active) {
      htmlSelector.listActive.open = true;
      htmlSelector.listBlur.src = active.image;
      htmlSelector.listImage.src = active.image;
      htmlSelector.listTitle.innerText = active.title;
      htmlSelector.listSubtitle.innerText = `${authors[active.author]} (${new Date(
        active.published
      ).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText =
        active.description;
    }
  };
  
 

const startProgram =()=>{
    htmlSelector.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
    page ++;
    bookPreviews(books)
    genreOptions(genres);
    authorOptions(authors);
    applyTheme();
    
    htmlSelector.searchCancel.addEventListener('click', handleSearchCancelClick);
    htmlSelector.settingsCancel.addEventListener('click', handleSettingsCancelClick);
    htmlSelector.headerSearch.addEventListener('click', handleHeaderSearchClick);
    htmlSelector.headerSettings.addEventListener('click', handleHeaderSettingsClick);
    htmlSelector.listClose.addEventListener('click', handleListCloseClick);
    htmlSelector.settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    htmlSelector.searchForm.addEventListener('submit', handleSearchFormSubmit);
    htmlSelector.listButton.addEventListener('click', handleListButtonClick);
    htmlSelector.listItems.addEventListener('click', handleListItemClick);

}

startProgram()
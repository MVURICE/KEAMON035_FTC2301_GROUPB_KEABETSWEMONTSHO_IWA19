import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'


export const htmlSelector ={

    listItems      : document.querySelector('[data-list-items]'),
    searchGenres   : document.querySelector('[data-search-genres]'),
    searchAuthors  : document.querySelector('[data-search-authors]'),
    settingsTheme  : document.querySelector('[data-settings-theme]'),
    listButton     : document.querySelector('[data-list-button]'),
    searchCancel   : document.querySelector('[data-search-cancel]'),
    searchOverlay  : document.querySelector('[data-search-overlay]'),
    settingsCancel :  document.querySelector('[data-settings-cancel]'),
    settingsOverlay : document.querySelector('[data-settings-overlay]'),
    settingsForm   : document.querySelector('[data-settings-form]'),
    listClose      : document.querySelector('[data-list-close]'),
    listActive     : document.querySelector('[data-list-active]'),
    headerSearch   : document.querySelector(`[data-header-search]`),
    searchTitle    : document.querySelector('[data-search-title]'),
    searchForm     : document.querySelector('[data-search-form]'),
    listMessage    : document.querySelector('[data-list-message]'),
    headerSettings : document.querySelector("[data-header-settings]"),
    listBlur       : document.querySelector('[data-list-blur]'),
    listImage      : document.querySelector('[data-list-image]'),
    listTitle      : document.querySelector('[data-list-title]'),
    listSubtitle   : document.querySelector('[data-list-subtitle]')
    
}

/**
 * Populate genre options in the search form.
 *
 * @param {Object} genres - Object containing genre data, where keys are genre IDs and values are genre names.
 */
export const genreOptions = (genres) => {

    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = document.createElement('option');
    firstGenreElement.value = 'any';
    firstGenreElement.innerText = 'All Genres';
    genreHtml.appendChild(firstGenreElement);
  

    for (const [id, name] of Object.entries(genres)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      genreHtml.appendChild(element);
    }
  
    htmlSelector.searchGenres.appendChild(genreHtml);
  };
  


/**
 * Populate author options in the search form.
 *
 * @param {Object} authors - Object containing author data, where keys are author IDs and values are author names.
 */
export const authorOptions = (authors) => {

    const authorsHtml = document.createDocumentFragment();
  
   
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';
    authorsHtml.appendChild(firstAuthorElement);
  
 
    for (const [id, name] of Object.entries(authors)) {
 
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      authorsHtml.appendChild(element);
    }
  
    htmlSelector.searchAuthors.appendChild(authorsHtml);
  };
  
  


//7 if more themes are to vbe added , you can simply add them to the themes object without modifying the existing code. Each theme can have its own colorDark and colorLight values.



export const themes = {
    day: {
      colorDark: '10, 10, 20',
      colorLight: '255, 255, 255',
    },
    night: {
      colorDark: '255, 255, 255',
      colorLight: '10, 10, 20',
    },
    // Add more themes here
  };
  

/**
 * Applies the selected theme to the application based on user preference or default settings.
 */

export const applyTheme = () => {
    const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDarkTheme ? 'night' : 'day';
  
    const themeSelectElement = document.querySelector('[data-settings-theme]');
    themeSelectElement.value = defaultTheme;
  
    const applyThemeVariables = (theme) => {
      const { colorDark, colorLight } = themes[theme];
  
      document.documentElement.style.setProperty('--color-dark', colorDark);
      document.documentElement.style.setProperty('--color-light', colorLight);
    };
  
    applyThemeVariables(defaultTheme);
};
  



/**
 * Updates the list items container with new book preview elements based on the search result.
 * Clears the existing list items.
 * Creates and appends preview elements for each book in the result to a document fragment.
 * Appends the document fragment to the list items container.
 *
 * @param {Object[]} result - Array of book objects to display as previews.
 */
export const updateListItems = (result) => {

    htmlSelector.listItems.innerHTML = '';
  

    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {

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
      newItems.appendChild(element);
    }
  
    htmlSelector.listItems.appendChild(newItems);
};
  




  
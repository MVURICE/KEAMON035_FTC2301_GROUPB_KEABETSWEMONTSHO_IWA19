import {
    BOOKS_PER_PAGE,
    authors,
    genres,
    books
} from './data.js'

import { createPreview , createPreviewsFragment, htmlSelector} from './functions.js';

const range = [0,BOOKS_PER_PAGE];
const matches = books
let page = 1;


if (!books || !Array.isArray(books)) throw new Error('Source required') 
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers')


const css = {
    day: {
      dark: '10, 10, 20',
      light: '255, 255, 255',
    },
    night: {
      dark: '255, 255, 255',
      light: '10, 10, 20',
    },
};



// iterates over the extracted books, creates a preview for each one using the createPreview function, and appends each preview to the fragment

const fragment = document.createDocumentFragment()
export const extracted = books.slice(0, 36)

for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
        author,
        id,
        image,
        title
    })

    console.log(preview)
    fragment.appendChild(preview)

}

htmlSelector.listItems.appendChild(fragment)

/* ************************************************Eventlistener ************************************************/

// Adds an event listener to the header search element. When clicked, it sets the search overlay to be open and focuses on the search title input field.

// ****** search button**********
htmlSelector.headerSearch.addEventListener('click',()=>{
    htmlSelector.searchOverlay.open = true ;
    htmlSelector.searchTitle.focus();

})


htmlSelector.settingsCancel.addEventListener('click',()=>{
    htmlSelector.settingsOverlay.open = false 
    
   })

//Adds an event listener to the search cancel element. When clicked, it sets the search overlay to be closed.
htmlSelector.searchCancel.addEventListener('click',()=>{ 
    htmlSelector.searchOverlay.open = false 
})

//Adds an event listener to the header settings element. When clicked, it sets the settings overlay to be open.
htmlSelector.headerSettings.addEventListener('click', (event) => {
    htmlSelector.settingsOverlay.open = true;
})



// ******show more button**********
htmlSelector.listButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

//This block of code sets the innerHTML of the list button element to display the text "Show more" and the remaining number of books that can be displayed. The remaining number is calculated by subtracting the number of books displayed on the current page (page * BOOKS_PER_PAGE) from the total number of books. If this number is negative, it is replaced with 0.
htmlSelector.listButton.addEventListener('click', () => {
    htmlSelector.listItems.appendChild(createPreviewsFragment(matches, (page * BOOKS_PER_PAGE), (page + 1) * BOOKS_PER_PAGE))
  
    page = page + 1
    let remainingBooks = matches.length - (page * BOOKS_PER_PAGE)
    
    for (const book of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
      remainingBooks = remainingBooks - 1
    }
  
    const hasRemainingBooks = remainingBooks > 0
    const remaining = hasRemainingBooks ? remainingBooks : 0
  

    if (remaining < 1) {
      htmlSelector.listButton.disabled = true
      htmlSelector.searchOverlay.open = false

      window.scrollTo({ top: 0, behavior: 'smooth' })
      htmlSelector.listButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
      `
    } else {
      htmlSelector.listButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
      `
    }
  })



//sets the initial value of the settingsTheme select element to either 'night' or 'day', depending on whether the user's device has a dark mode preference or not.
htmlSelector.settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

// The settingsForm event listener listens for a form submission event, and then prevents the default form submission behavior. It then extracts the form data, which should contain a theme key-value pair representing the user's selected theme. Based on the selected theme, it sets the CSS variables --color-dark and --color-light to the appropriate values from the css object. Finally, it closes the settings overlay.

htmlSelector.settingsForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    const formData = new FormData(event.target);

    const selected = Object.fromEntries(formData);

    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', css[selected.theme].dark);
        document.documentElement.style.setProperty('--color-light', css[selected.theme].light);       
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-dark', css[selected.theme].dark);
        document.documentElement.style.setProperty('--color-light', css[selected.theme].light);
    };

    htmlSelector.settingsOverlay.close();
    }) 


    // The listClose event listener listens for a click event on the list close button, and then closes the active list element by setting its open attribute to false.
    htmlSelector.listClose.addEventListener('click',()=>{ 
    htmlSelector.listActive.open = false }
    
    ) 
/*_______________________search_____________________________*/
// creates a document fragment for genres and authors, and then creates options for each genre and author using a for loop and appends them to their respective sections. 
/*_________________________genre_______________________________*/
let genreSection = document.createDocumentFragment()
let element = document.createElement('option')
element.value = 'any'
element.textContent = 'All Genres'
genreSection.appendChild(element)

for (const [id, name] of Object.entries(genres)) {
    document.createElement('option')
    element.value = id
    element.innerText = name
    genreSection.appendChild(element)
}
htmlSelector.searchGenres.appendChild(genreSection)

/*_____________________________authors _____________________________ */
let authorSection = document.createDocumentFragment()
element = document.createElement('option')
element.value = 'any'
element.innerText = 'All Authors'
authorSection.appendChild(element)

for (const [id, name]of Object.entries(authors)) {
    document.createElement('option')
    element.value = id
    element.innerText = name
    authorSection.appendChild(element)
}

htmlSelector.searchAuthors.appendChild(authorSection);

// Adds an event listener to the search form's submit event. It prevents the default form submission action, retrieves the form data, and filters the books array based on the form data. It then populates the resulting array to the page using createPreview and createPreviewsFragment functions

htmlSelector.searchForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    let result = []

    for (let i =0 ;i < books.length; i++) {
        let titleMatch = filters.title.trim() === '' || books[i].title.toLowerCase().includes(filters.title.toLowerCase())
        let authorMatch = filters.author === 'any' || books[i].author === filters.author
        let genreMatch = filters.genre === 'any' || books[i].genres.includes(filters.genre)

        if(titleMatch && authorMatch && genreMatch){
            result.push(books[i])
        }
    };

    if (result.length < 1){
        htmlSelector.listMessage.classList.add('list__message_show')
    } else {
        htmlSelector.listMessage.classList.remove('list__message_show')
    }
});

// This code block adds an event listener to the book preview elements in the book list. When the user clicks on a book preview, it retrieves the book information and populates the book details section with the information

htmlSelector.listItems.addEventListener('click', (event) => {
    // Get an array of the path nodes of the clicked element
    const pathArray = Array.from(event.path || event.composedPath())
  
    let active = null // Initialize the active book variable to null
  
    // Loop through the path nodes and try to find the clicked book preview element
    for (const node of pathArray) {
      const previewId = node?.dataset?.preview
  
      // Loop through the books array to find the book with the matching ID
      for (const book of books) {
        if (book.id === previewId) {
          active = book // Set the active book variable
          break // Exit the loop once the book is found
        }
      }
      if (active) break // Exit the loop once the active book is found
    }
    if (!active) return // Return if the active book is not found
    // Set the values of the book details section elements
    document.querySelector('[data-list-active]').open = true
    document.querySelector('[data-list-blur]').src = active.image
    document.querySelector('[data-list-image]').src = active.image
    document.querySelector('[data-list-title]').textContent = active.title
    document.querySelector('[data-list-subtitle]').textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    document.querySelector('[data-list-description]').textContent = active.description
  })
  
import {
    BOOKS_PER_PAGE,
    authors,
    genres,
    books
} from './data.js'

import { createPreview , createPreviewsFragment} from './functions.js';

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

const fragment = document.createDocumentFragment()
export const extracted = books.slice(0, 36)


for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
        author,
        id,
        image,
        title
    })

    fragment.appendChild(preview)
}
document.querySelector(`[data-list-items]`).appendChild(fragment)

// 1 search button
document.querySelector(`[data-header-search]`).addEventListener('click',()=>{
    document.querySelector(`[data-search-overlay]`).open = true ;
    document.querySelector(`[data-search-title]`).focus();
})


document.querySelector(`[data-settings-cancel]`).addEventListener('click',()=>{
    document.querySelector(`[data-settings-overlay]`).open = false 
   })

   



// 2
document.querySelector(`[data-search-cancel]`).addEventListener('click',()=>{ 
    document.querySelector(`[data-search-overlay]`).open = false 
})

// 3
document.querySelector("[data-header-settings]").addEventListener('click', (event) => {
    document.querySelector("[data-settings-overlay]").open = true;
})

// 4
document.querySelector(`[data-list-button]`).innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${matches.length - (page * BOOKS_PER_PAGE) > 0 ? matches.length - (page * BOOKS_PER_PAGE) : 0})</span>
`

// 6
document.querySelector(`[data-list-button]`).addEventListener('click', () => {
    document.querySelector("[data-list-items]").appendChild(createPreviewsFragment(matches, (page * BOOKS_PER_PAGE), (page + 1) * BOOKS_PER_PAGE))
    
    const initial = matches.length - (page * BOOKS_PER_PAGE)
    const hasRemaining = initial > BOOKS_PER_PAGE
    const remaining = hasRemaining ? initial : 0
    document.querySelector(`[data-list-button]`).disabled = initial > 0

    document.querySelector(`[data-list-button]`).innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `

    // window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector(`[data-search-overlay]`).open = false

})



// 7
document.querySelector(`[data-settings-theme]`).value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
let theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' : 'day';

// 8
document.querySelector(`[data-settings-form]`).addEventListener('submit',(event)=>{
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

    document.querySelector('[data-settings-overlay]').close();
    }) 

document.querySelector(`[data-list-close]`).addEventListener('click',()=>{ 
    document.querySelector(`[data-list-active]`).open = false }
    
    ) 


/*_______________________search_____________________________*/

// 9
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

document.querySelector(`[data-search-genres]`).appendChild(genreSection)


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

document.querySelector(`[data-search-authors]`).appendChild(authorSection);



// added event listener changed click to submit
document.querySelector(`[data-search-form]`).addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    result = []


    for (let i =0 ;i < books.length; i++) {
        let titleMatch = filters.title.trim() === '' || books[i].title.toLowerCase().includes(filters.title.toLowerCase())
        let authorMatch = filters.author === 'any' || books[i].author === filters.author
        let genreMatch = filters.genre === 'any' || books[i].genres.includes(filters.genre); // check if the book's genres include the selected genre


        if(titleMatch && authorMatch && genreMatch){
            result.push(books)
        }
    };

       if (display.length < 1){
            document.querySelector(`[data-list-message]`).classList.add('list__message_show')
        }
        else {
            document.querySelector(`[data-list-message`).classList.remove('list__message_show')
            
        }
        
    
}) 
/******************************************************************/
document.querySelector(`[data-settings-overlay]`).addEventListener('submit', (event)=>
{
    preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    document.querySelector(`[data-settings-overlay]`).open === false
})

document.querySelector(`[data-list-items]`).addEventListener('click',(event)=>{
    let pathArray = Array.from(event.path || event.composedPath())
    active;

    for (node of pathArray) {
        if (active) break;
        const previewId = node?.dataset?.preview
    
        for (const singleBook of books) {
            if (singleBook.id === id) active = singleBook
        } 
    }
    
    if (!active) return
    document.querySelector(`[data-list-active]`).open = true
    document.querySelector(`[data-list-blur]`) + document.querySelector(`[data-list-image]`) === active.image
    document.querySelector(`[data-list-title]`) === active.title
    
    document.querySelector(`[data-list-subtitle]`) === `${authors[active.author]} (${Date(active.published).year})`
    document.querySelector(`[data-list-description]`) === active.description
}) 


showPreview()
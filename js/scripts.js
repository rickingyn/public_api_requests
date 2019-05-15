const gallery = document.querySelector('#gallery');

// add query string to API URL to retrieve a user nationality that will only return data in the English alphabet
const englishNationalities =  'au,br,ca,ch,de,dk,es,fi,fr,gb,ie,no,nl,nz,us';
const employeesUrl = `https://randomuser.me/api/?nat=${englishNationalities}`;

// invoke function to create modal container and search form
createModalDiv();
createSearch();

// fetch data from API for 12 users on load; call functions to add user to gallery and modal
// call catch method to handle any other errors that will occur 
window.addEventListener('load', () => {
    for(let i = 0; i < 12; i++) {
    fetchData(employeesUrl)
        .then(data => {
             addUsers(data);
             usersDetailDisplay(data);
        })
        .catch(error => console.log(error));
    }
});

// create function to add div element for the modal container
function createModalDiv() {
    const div = document.createElement('div');
    div.className = "modal-container";
    div.style.display = 'none';
    document.querySelector('body').insertBefore(div, gallery.nextElementSibling);
}

/**
 * create function to fetch users data from URL and parse to JSON
 * @param {string} url - link to API
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch(error) {
        throw error; 
    }
}

/**
 * function to dynamically add users to web page
 * @param {Object} data - JSON response from fetched users data
 */
function addUsers(data) {
    const imageThumbnail = data.results[0].picture.large;
    const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
    const email = data.results[0].email;
    const location = data.results[0].location;

    // Use string interpolation to create HTML to add to gallery container
    const html = `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${imageThumbnail}" alt="profile picture">
        </div>
    
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${location.city}, ${location.state}</p>
        </div>
    </div>
    `;
    // add html to gallery container
    gallery.innerHTML += html;
}

/**
 * function to dynamically add DOM element to modal container
 * @param {Object} data - takes user's data object fetched from API
 */
function usersDetailDisplay(data) {
    const image = data.results[0].picture.large;
    const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
    const email = data.results[0].email;
    const location = data.results[0].location;
    const cellphone = data.results[0].cell;
    const dob = data.results[0].dob.date;
    const year = dob.substring(0,4);
    const month = dob.substring(5,7);
    const day = dob.substring(8,10);

    

    // Use string interpolation to create HTML to add to modal container
    const html = `
        <div class="modal" style='display: none'>
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${image}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${name}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${location.city}</p>
                <hr>
                <p class="modal-text">${cellphone}</p>
                <p class="modal-text cap">${location.street}, ${location.state} ${location.postcode}</p>
                <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
        </div>
    `;

    // add html to modal container
    document.querySelector('.modal-container').innerHTML += html;
}

// create search form and append to html
function createSearch() {
    const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>
    `;
    document.querySelector('.search-container').innerHTML = html;
}

/**
 * add event listener to open modal when name or image is clicked
 * checks modal to match selected user's name and display users detail
 */
gallery.addEventListener('click', event => {
    if(event.target.className === 'card-name cap' || event.target.className === 'card-img') {
        document.querySelector('.modal-container').style.display = "block";     
        
        document.querySelectorAll('.modal-name.cap').forEach(name => {
            const targetedName = event.target.parentNode.parentNode.children[1].children[0].textContent;

            if(name.textContent === targetedName) {
                name.parentNode.parentNode.style.display = 'block';
            }
        });   
    }
});

/**
 * add event listener to modal container; close user's details display
 * if close button is clicked, loop through all modal and set display to none
 * set display to modal container to none
 */
document.querySelector('.modal-container').addEventListener('click', event => {
    if(event.target.tagName === 'BUTTON' || event.target.textContent === 'X') {
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
        document.querySelector('.modal-container').style.display = 'none';
    }
});

/**
 * add event listener to search form to dynamically filter directory
 */
document.querySelector('#search-input').addEventListener('keyup', event => {
    const name = document.querySelectorAll('#name');
    const searchValue = event.target.value.toLowerCase();

    name.forEach(name => {
        if(!name.textContent.includes(searchValue)) {
            name.parentNode.parentNode.style.display = 'none';
        } else {
            name.parentNode.parentNode.style.display = 'block';
        }

    });
});
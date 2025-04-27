const global = {
  currentPage : window.location.pathname,
  search: {
    type: '',
    term: '',
    page : 1,
    total_pages : 1,
    total_results: 0,
  },
  api : {
    api_key : '5a9217bc0e9fe130152fb700f71a3aa5',
    api_url: 'https://api.themoviedb.org/3/',
  }
}

async function displayPopularMovie(){
  const {results} = await fetchApiData('movie/popular')

  results.forEach((movie)=>{
    const div = document.createElement('div')
    div.classList.add('card')
    
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path 
              ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
          `;
      document.querySelector('#popular-movies').appendChild(div)
  });
      

}

async function displayPopularShow(){
  const {results} = await fetchApiData('tv/popular')

  results.forEach((show)=>{
    const div = document.createElement('div')
    div.classList.add('card')
    
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path 
              ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
          `;
      document.querySelector('#popular-shows').appendChild(div)
  });
      

}

//display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  
  const movie = await fetchApiData(`movie/${movieId}`)

  //overlay for background image
  displayBackgroundImage('movie',movie.backdrop_path)

  const div = document.createElement('div')

  div.innerHTML = ` <div class="details-top">
          <div>
             ${
              movie.poster_path 
              ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
             <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre)=> `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${addCommasToNumber(movie.runtime)} minutes</li>
            <li><span class="text-secondary">Status:</span> ${addCommasToNumber(movie.status)}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>`;

          document.querySelector('#movie-details').appendChild(div)
}


function displayBackgroundImage(type,background_path){

  const overlayDiv = document.createElement('div');

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${background_path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie'){
    document.querySelector('#movie-details').appendChild(overlayDiv)
  }else{
    document.querySelector('#show-details').appendChild(overlayDiv)
  }
}

//display TV details
async function displayTvDetails() {
  const tv_id = window.location.search.split('=')[1];
  
  const show = await fetchApiData(`tv/${tv_id}`)

  //overlay for background image
  displayBackgroundImage('tv',show.backdrop_path)

  const div = document.createElement('div')

  div.innerHTML = ` <div class="details-top">
          <div>
             ${
              show.poster_path 
              ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
             <i class="fas fa-star text-primary"></i>
                ${show.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
             ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span>${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>`;

          document.querySelector('#show-details').appendChild(div);

          
}

async function search(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString)

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null){
    const {results ,page,total_pages,total_results} = await searchApiData();

    global.search.page =page;
    global.search.total_pages =total_pages;
    global.search.total_results = total_results;



    
    if(results.length === 0){
      showAlert('no item founded')
      return;
    }
    
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  }else{
    showAlert('Enter the search term')
  }
  
}

//display Search Results

function displaySearchResults(results){
  // clear preview 
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result)=>{
    const div = document.createElement('div')
    div.classList.add('card')
    
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path 
              ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name  }"
            />`
            : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name  }"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name }</h5>
            <p class="card-text">
              <small class="text-muted">${global.search.type === 'movie' ? result.release_date : result.first_air_date }</small>
            </p>
          </div>
          `;

          document.querySelector('#search-results-heading').innerHTML = `
          <h2>${results.length} of ${global.search.total_results} for ${global.search.term}</h2>
        `;   
      document.querySelector('#search-results').appendChild(div)
  });

  displayPagination();
}


//display pagination

function displayPagination(){
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.total_pages}</div>
      `;
      
      document.querySelector('#pagination').appendChild(div)
      
      //disable prev
      if(global.search.page === 1){
        document.querySelector('#prev').disabled = true;
      }

      // disable next
      if(global.search.page === global.search.total_pages){
        document.querySelector('#next').disabled = true;
      }

      //next 
      document.querySelector('#next').addEventListener('click', async ()=>{
        global.search.page++;
        const {results,total_pages} = await searchApiData()
        displaySearchResults(results);
      })

      //prev
      document.querySelector('#prev').addEventListener('click', async ()=>{
        global.search.page--;
        const {results,total_pages} = await searchApiData()
        displaySearchResults(results);
      })


}



//display slider movie

async function displaySlider(){
  const { results } = await fetchApiData('movie/now_playing');

  results.forEach((movie)=> {
    const div = document.createElement('div');
    
    div.classList.add('swiper-slide');

    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
       `;

        document.querySelector('.swiper-wrapper').appendChild(div)

      });
      initSwiper();
}

function initSwiper(){
  const swiper = new Swiper('.swiper',{
    slidePreview : 1,
    spaceBetween: 30,
    freeMode:true,
    loop : true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  })
}


//fetch the data
async function fetchApiData(endpoint) {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;

  showSpinner()
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)

  hideSpinner()
  const data = await response.json();
  return data;
}

function showSpinner(){
  document.querySelector('.spinner').classList.add('show')
}

function hideSpinner(){
  document.querySelector('.spinner').classList.remove('show')
}

//Search Api Data
async function searchApiData() {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;
  
  showSpinner()
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`)

  hideSpinner()
  const data = await response.json();
  return data;
}


function showSpinner(){
  document.querySelector('.spinner').classList.add('show')
}

function hideSpinner(){
  document.querySelector('.spinner').classList.remove('show')
}

//highligted Active link

function highligtedActiveLink(){
  const links = document.querySelectorAll('.nav-link')
  links.forEach((link) => {
    if(link.getAttribute('href') === global.currentPage){
      link.classList.add('active')
    }
  })
}

//show Alert
function showAlert(message,className = 'error'){
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert',className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl)

  setTimeout(()=>alertEl.remove(),3000)
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function init(){
  switch(global.currentPage){
    case '/':
    case '/index.html':
      displaySlider()
      displayPopularMovie()
      break;
    case '/shows.html':
      displayPopularShow();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayTvDetails()
      break;
    case '/search.html':
      search()
      break;
  }

  highligtedActiveLink()
}


document.addEventListener('DOMContentLoaded', init())



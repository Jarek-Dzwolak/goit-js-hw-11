import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('default-search');
const resultsContainer = document.getElementById('results-container');
const loadMoreButton = document.querySelector('.load-more');
const API_KEY = '35796974-2bfb24448b11e52eee5b0ed2a';
let page = 1;

function renderCards(hits) {
  resultsContainer.innerHTML = '';
  hits.forEach(hit => {
    const imgElement = document.createElement('img');
    imgElement.classList.add('img-look');
    imgElement.src = hit.webformatURL;
    imgElement.alt = hit.tags;
    imgElement.loading = 'lazy';
    const infoElement = document.createElement('div');
    infoElement.classList.add('info');
    const likesElement = document.createElement('p');
    likesElement.classList.add('info-item');
    likesElement.innerHTML = `<b>Likes:</b> ${hit.likes}`;
    const viewsElement = document.createElement('p');
    viewsElement.classList.add('info-item');
    viewsElement.innerHTML = `<b>Views:</b> ${hit.views}`;
    const commentsElement = document.createElement('p');
    commentsElement.classList.add('info-item');
    commentsElement.innerHTML = `<b>Comments:</b> ${hit.comments}`;
    const downloadsElement = document.createElement('p');
    downloadsElement.classList.add('info-item');
    downloadsElement.innerHTML = `<b>Downloads:</b> ${hit.downloads}`;
    infoElement.appendChild(likesElement);
    infoElement.appendChild(viewsElement);
    infoElement.appendChild(commentsElement);
    infoElement.appendChild(downloadsElement);
    const cardElement = document.createElement('div');
    cardElement.classList.add('photo-card');
    cardElement.appendChild(imgElement);
    cardElement.appendChild(infoElement);
    resultsContainer.appendChild(cardElement);
  });
}

function handleLoadMore() {
  page++;
  const searchQuery = searchInput.value;
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (parseInt(data.totalHits) > 0) {
        renderCards(data.hits);
        if (data.hits.length < 40) {
          loadMoreButton.style.display = 'none';
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => console.error(error));
}

function handleSearchFormSubmit(e) {
  e.preventDefault();
  page = 1;
  const searchQuery = searchInput.value;
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (parseInt(data.totalHits) > 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderCards(data.hits);
        loadMoreButton.style.display = 'block';
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => console.error(error));
}
const lightbox = new SimpleLightbox('.photo-card a');
loadMoreButton.addEventListener('click', handleLoadMore);
searchForm.addEventListener('submit', handleSearchFormSubmit);

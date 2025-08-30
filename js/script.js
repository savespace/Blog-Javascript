'use strict';
// Ustawienia
const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  authorsListSelector: '.authors.list',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
};

// Funkcja kliknięcia w art
function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const allArticles = document.querySelectorAll(opts.articleSelector);
  for (let article of allArticles) {
    article.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  if (targetArticle) {
    targetArticle.classList.add('active');
  }
}

// Generowanie listy linków do art
function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    html += '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

// Znalezienie skrajnych liczb wystąpień

function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999};

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if  (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if  (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }

  return params;
}

// Wybieranie klasy dla tagu
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedMax > 0 ? normalizedCount / normalizedMax : 0;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  return opts.cloudClassPrefix + classNumber;
}

// Generowanie tagów do art
function generateTags() {
  let allTags = {};

  const articles = document.querySelectorAll(opts.articleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(opts.articleTagsSelector);
    if (!tagWrapper) continue;

    let html = '';

    const articleTags = article.getAttribute('data-tags');
    if (!articleTags) {
      tagWrapper.innerHTML = '';
      continue;
    }

    const tagsArray = articleTags.split(' ').filter(Boolean);

    for (let tag of tagsArray) {
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      html += linkHTML + ' ';

      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
        console.log(allTags);
      } else {
        allTags[tag]++;
      }
    }

    tagWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(opts.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  let allTagsHTML = '';
  for(let tag in allTags){
    allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + ' (' + allTags[tag] + ')</a></li> ';
  }
  tagList.innerHTML = allTagsHTML;
}

// Kliknięcia w tagi
function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for (let activeLink of activeTagLinks) {
    activeLink.classList.remove('active');
  }

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

// Dodaje clicklistery do tagów
function addClickListenersToTags(){
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

// Generuje autorów w art
function generateAuthorsInArticles() {
  const articles = document.querySelectorAll(opts.articleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    if (!authorWrapper) continue;

    const author = article.getAttribute('data-author');
    authorWrapper.innerHTML = '<a href="#author-' + author + '">' + author + '</a>';
  }
}

//  Generuje liste autorów po prawej stronie
function generateAuthorsSidebar() {
  const articles = document.querySelectorAll(opts.articleSelector);
  const authors = {};

  for (let article of articles) {
    const author = article.getAttribute('data-author');
    if (author) {
      if (!authors[author]) authors[author] =1;
      else authors[author]++;
    }
  }

  const authorsListContainer = document.querySelector(opts.authorsListSelector);
  if (!authorsListContainer) return;

  let html = '';
  for (let author in authors) {
    html += '<li><a href="#author-' + author + '">' + author + ' (' + authors[author] + ')</a></li>';
  }

  authorsListContainer.innerHTML = html;

  const authorLinks = authorsListContainer.querySelectorAll('a');
  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
}

// Kliknięcie w autora
function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeLink of activeAuthorLinks) {
    activeLink.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}


// Dodanie cliclisterów do autorów
function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}


generateTitleLinks();
generateTags();
generateAuthorsInArticles();
generateAuthorsSidebar();
addClickListenersToTags();
addClickListenersToAuthors();

'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optAuthorsListSelector = '.authors-list';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  const activeLinks = document.querySelectorAll('.titles a.active');
  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  const allArticles = document.querySelectorAll(optArticleSelector);
  for (let article of allArticles) {
    article.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  if (targetArticle) {
    targetArticle.classList.add('active');
  }
}

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    html += '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

function generateTags() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    if (!tagWrapper) continue;

    const articleTags = article.getAttribute('data-tags');
    if (!articleTags) {
      tagWrapper.innerHTML = '';
      continue;
    }

    const tagsArray = articleTags.split(' ').filter(Boolean);
    let html = '';

    for (let tag of tagsArray) {
      html += '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
    }

    tagWrapper.innerHTML = html;
  }
}

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

function addClickListenersToTags(){
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

function generateAuthorsInArticles() {
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    if (!authorWrapper) continue;

    const author = article.getAttribute('data-author');
    authorWrapper.innerHTML = '<a href="#author-' + author + '">' + author + '</a>';
  }
}

function generateAuthorsSidebar() {
  const articles = document.querySelectorAll(optArticleSelector);
  const authors = {};

  for (let article of articles) {
    const author = article.getAttribute('data-author');
    if (author) authors[author] = true;
  }

  const authorsListContainer = document.querySelector(optAuthorsListSelector);
  if (!authorsListContainer) return;

  let html = '';
  for (let author in authors) {
    html += '<li><a href="#author-' + author + '">' + author + '</a></li>';
  }

  authorsListContainer.innerHTML = html;

  const authorLinks = authorsListContainer.querySelectorAll('a');
  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
}

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

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthorsInArticles();
generateAuthorsSidebar();
addClickListenersToAuthors();

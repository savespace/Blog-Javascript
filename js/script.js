"use strict";

// Ustawienia
const opts = {
  articleSelector: ".post",
  titleSelector: ".post-title",
  titleListSelector: ".titles",
  articleTagsSelector: ".post-tags .list",
  articleAuthorSelector: ".post-author",
  authorsListSelector: ".authors.list",
  tagsListSelector: ".tags.list",
  cloudClassCount: 5,
  cloudClassPrefix: "tag-size-",
};

// Ustawienia
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector("#template-article-link").innerHTML,
  ),
  articleTag: Handlebars.compile(
    document.querySelector("#template-article-tag").innerHTML,
  ),
  articleAuthor: Handlebars.compile(
    document.querySelector("#template-article-author").innerHTML,
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector("#template-tag-cloud-link").innerHTML,
  ),
  authorListLink: Handlebars.compile(
    document.querySelector("#template-author-list-link").innerHTML,
  ),
};

// Funkcja kliknięcia w artykuł
function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  document
    .querySelectorAll(".titles a.active")
    .forEach((link) => link.classList.remove("active"));
  clickedElement.classList.add("active");

  document
    .querySelectorAll(opts.articleSelector)
    .forEach((article) => article.classList.remove("active"));
  const targetArticle = document.querySelector(
    clickedElement.getAttribute("href"),
  );
  if (targetArticle) targetArticle.classList.add("active");
}

// Lista artykułów
function generateTitleLinks(customSelector = "") {
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = "";

  const articles = document.querySelectorAll(
    opts.articleSelector + customSelector,
  );
  let html = "";

  for (let article of articles) {
    const articleId = article.getAttribute("id");
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    html += templates.articleLink({ id: articleId, title: articleTitle });
  }

  titleList.innerHTML = html;

  titleList
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", titleClickHandler));
}

// Tagi w art i chmurka tagów
function calculateTagsParams(tags) {
  const params = { max: 0, min: Infinity };
  for (let tag in tags) {
    if (tags[tag] > params.max) params.max = tags[tag];
    if (tags[tag] < params.min) params.min = tags[tag];
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedMax > 0 ? normalizedCount / normalizedMax : 0;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  return opts.cloudClassPrefix + classNumber;
}

function generateTags() {
  let allTags = {};

  document.querySelectorAll(opts.articleSelector).forEach((article) => {
    const tagWrapper = article.querySelector(opts.articleTagsSelector);
    if (!tagWrapper) return;

    const articleTags = article.getAttribute("data-tags");
    if (!articleTags) {
      tagWrapper.innerHTML = "";
      return;
    }

    const tagsArray = articleTags.split(" ").filter(Boolean);
    let html = "";

    tagsArray.forEach((tag) => {
      html += `<li><a href="#tag-${tag}">${tag}</a></li> `;
      allTags[tag] = (allTags[tag] || 0) + 1;
    });

    tagWrapper.innerHTML = html;
  });

  // Chmurka tagów
  const tagList = document.querySelector(opts.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = { tags: [] };

  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);

  tagList
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", tagClickHandler));
  document
    .querySelectorAll(opts.articleSelector + ' a[href^="#tag-"]')
    .forEach((link) => link.addEventListener("click", tagClickHandler));
}

function tagClickHandler(event) {
  event.preventDefault();
  const tag = this.getAttribute("href").replace("#tag-", "");

  document
    .querySelectorAll('a.active[href^="#tag-"]')
    .forEach((link) => link.classList.remove("active"));
  document
    .querySelectorAll(`a[href="#tag-${tag}"]`)
    .forEach((link) => link.classList.add("active"));

  generateTitleLinks(`[data-tags~="${tag}"]`);
}

// Autorzy w artach i sidebar
function generateAuthorsInArticles() {
  document.querySelectorAll(opts.articleSelector).forEach((article) => {
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    if (!authorWrapper) return;

    const author = article.getAttribute("data-author");
    authorWrapper.innerHTML = templates.articleAuthor({ author });
  });
}

function generateAuthorsSidebar() {
  const articles = document.querySelectorAll(opts.articleSelector);
  const authors = {};
  const authorsListContainer = document.querySelector(opts.authorsListSelector);
  if (!authorsListContainer) return;

  articles.forEach((article) => {
    const author = article.getAttribute("data-author");
    if (!author) return;
    authors[author] = (authors[author] || 0) + 1;
  });

  const allAuthorsData = { authors: [] };
  for (let author in authors) {
    allAuthorsData.authors.push({ author, count: authors[author] });
  }

  authorsListContainer.innerHTML = templates.authorListLink(allAuthorsData);

  authorsListContainer
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", authorClickHandler));
}

function authorClickHandler(event) {
  event.preventDefault();
  const author = this.getAttribute("href").replace("#author-", "");

  document
    .querySelectorAll('a.active[href^="#author-"]')
    .forEach((link) => link.classList.remove("active"));
  document
    .querySelectorAll(`a[href="#author-${author}"]`)
    .forEach((link) => link.classList.add("active"));

  generateTitleLinks(`[data-author="${author}"]`);
}

generateTitleLinks();
generateTags();
generateAuthorsInArticles();
generateAuthorsSidebar();

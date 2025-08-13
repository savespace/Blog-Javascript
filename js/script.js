'use strict';

function titleClickHandler(event){
    event.preventDefault();

    const clickedElement = this;
    console.log('Link was clicked!', clickedElement);

    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');

    const allArticles = document.querySelectorAll('.posts article');
    for(let article of allArticles){
        article.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    if(targetArticle){
        targetArticle.classList.add('active');
    }
}

const links = document.querySelectorAll('.titles a ');
for(let link of links){
    link.addEventListener('click', titleClickHandler);
}


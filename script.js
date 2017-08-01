
(function (window, document) {

  function Articles(){
    this.articles = {};
    this.settings = {
      apiUrl: "https://rss-deploy.herokuapp.com/rss/feed/habr/hub/{{hubId}}/",
    };
    this.domElem = {
      articleTemplate: document.getElementsByClassName('article_template')[0],
    };
  };


  Articles.prototype.init = function () {
    var __self = this;
    this.getData();

    window.addEventListener('hashchange', function(e) {
      __self.getData();
    });
  };

  Articles.prototype.getData = function () {
  var hash = window.location.hash.substring(1);
  console.log(hash)
  var rssUrl = this.settings.apiUrl.replace('{{hubId}}',hash);
  var __self = this;
  fetch(rssUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      __self.articles = data.entries
      __self.update();
    })
    .catch( function (err) { console.log(err)} );
  };

  Articles.prototype.update = function () {
    var articlesHtml = this.generateAll();
    articlesDomElem = document.querySelectorAll('.articles')[0];

    articlesDomElem.innerHTML = '';

    articlesDomElem.appendChild(articlesHtml);
  };

  Articles.prototype.generateAll = function () {
    __self = this;

    var articlesHtml = document.createDocumentFragment();
    this.articles.forEach(function(item){
    articlesHtml.appendChild(__self.generateArticle(item));
    });

    return articlesHtml;
  };

  Articles.prototype.generateArticle = function (itemData) {
    var newArticle = this.domElem.articleTemplate.cloneNode(true);
    newArticle.classList.remove('article_template');

    newArticle.getElementsByClassName('post-heading')[0].innerHTML = itemData.title;
    newArticle.getElementsByClassName('article_data')[0].innerHTML = this.convertDate(itemData.pubDate);
    newArticle.getElementsByClassName('excerpt')[0].innerHTML = itemData.contentSnippet;

    newArticle.getElementsByClassName('post-heading')[0].setAttribute('href', itemData.link);
    newArticle.getElementsByClassName('action-button')[0].setAttribute('href', itemData.link);
    return newArticle;
  };

  Articles.prototype.convertDate = function(dateStr) {
    var date = new Date(dateStr);
    return date;
  };

  var articles = new Articles();

  articles.init();

  console.log(articles);


})(window, document);

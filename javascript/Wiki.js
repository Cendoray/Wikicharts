"use strict";


var wiki = {
  "requestViews": "",
  "requestThumbnail": "",
  "viewsURL": "",
  "thumbnailURL": ""
};

/**
 * add function to submit button when it is clicked after DOM is loaded
 */
U.ready(function() {
  U.addHandler(U.$("submit"), "click", getTableInfo);
  get20Views();
});


/**
 * get the 20 most viewed articles of Wikipedia during a certain date,
 * with their title and number of views (except for main menu and those which start with "Special")
 */
function get20Views() {
  if (verifyDate() === true) {
    var yearURL = U.$("date").value.substring(0, 4) + "/" +
      U.$("date").value.substring(5, 7) + "/" +
      U.$("date").value.substring(8, 10);
    var lang = U.$("language").value.substring(0, 2).toLowerCase();
    if ((wiki.viewsURL.substring(84) !== yearURL ||
      sessionStorage.getItem(wiki.viewsURL) === null) ||
      wiki.viewsURL.indexOf(lang + ".wikipedia") === -1) {
      wiki.requestViews = createRequestObject();
      wiki.requestViews.setRequestHeader = ("Api-User-Agent", "daniel.rafail@dawsoncollege.qc.ca");
      wiki.requestViews.onreadystatechange = displayViews;
      wiki.viewsURL = "https://wikimedia.org/api/rest_v1/metrics/pageviews/top/" +
        lang + ".wikipedia.org/all-access/" + yearURL;
      wiki.requestViews.open("GET", wiki.viewsURL, true);
      wiki.requestViews.send(null);
    } else {
      get20Thumbnails(0);
    }
  }
}

/**
 * Take the request from the 20 most viewed articles and save it in sessionstorage
 */
function displayViews() {
  var regex = /^[Ss]p[eé?]cial:/;
  if (wiki.requestViews.readyState === 4 && wiki.requestViews.status === 200) {
    var views = JSON.parse(wiki.requestViews.responseText);
    var counter = 0;
    var array = [];
    var valuesJumped = 0;
    var loc = 0;
    while (array.length !== 20) {
      if (views.items[0].articles[counter].article.indexOf("Category") !== -1 ||
      regex.test(views.items[0].articles[counter].article) ||
    views.items[0].articles[counter].article === "Main_Page" ||
  /[Aa]ccueil/.test(views.items[0].articles[counter].article) ||
views.items[0].articles[counter].article.indexOf("/") !== -1){
        counter = Number(counter) + 1;
        valuesJumped = Number(valuesJumped) + 1;
        continue;
      }
      loc = Number(counter) - Number(valuesJumped);
      array[loc] = views.items[0].articles[counter];
      counter = Number(counter) + 1;
    }
    sessionStorage.setItem(wiki.viewsURL, JSON.stringify(array));
    get20Thumbnails(0);
  }
}

/**
 * Get the thumbnail and summary of the 20 most viewed articles of wikipedia during a certain date
 *  @param {Number} value the value of the the variable value is
 * the index of the article we look for in the top 20 most viewed articles of the day
 */
function get20Thumbnails(value) {
  if (verifyDate() === true && !isNaN(value)) {
    var title = JSON.parse(sessionStorage.getItem(wiki.viewsURL))[value].article;
    if (wiki.thumbnailURL.substring(56) !== title ||
      sessionStorage.getItem(wiki.thumbnailURL) === null) {
      wiki.requestThumbnail = createRequestObject();
      wiki.requestThumbnail.setRequestHeader =
        ("Api-User-Agent", "daniel.rafail@dawsoncollege.qc.ca");
      wiki.requestThumbnail.onreadystatechange = function(){
        displayThumbnails(value);
      }
      wiki.thumbnailURL = "https://" +
      U.$("language").value.substring(0, 2).toLowerCase() +
       ".wikipedia.org/api/rest_v1/page/summary/" + title;
      wiki.requestThumbnail.open("GET", wiki.thumbnailURL);
      wiki.requestThumbnail.send(null);
    }
  }
}

/**
 * Take the request from the thumbnail
 * and save it to localStorage
 *  @param {EventTarget} value the value of the the variable value is
 * the index of the article we look for in the top 20 most viewed articles of the day
 */
function displayThumbnails(count) {
  if (!isNaN(count)) {
    if (wiki.requestThumbnail.readyState === 4 && wiki.requestThumbnail.status === 200) {
      var thumbnail = JSON.parse(wiki.requestThumbnail.responseText);
      var obj = [{}];
      if(typeof thumbnail.thumbnail === "undefined"){
        obj = [{description : thumbnail.extract}, {title: thumbnail.titles.normalized},
          {url: thumbnail.content_urls.desktop.page}];
      }else{
        obj = [{description : thumbnail.extract}, {title: thumbnail.titles.normalized},
          {url: thumbnail.content_urls.desktop.page}, {image: thumbnail.thumbnail.source}];
      }
      if (sessionStorage.getItem(wiki.thumbnailURL) !== null){
        obj = sessionStorage.getItem(wiki.thumbnailURL);
      }else{
        sessionStorage.setItem(wiki.thumbnailURL, JSON.stringify(obj));
      }
      fillUpColumn(count, "table");
    }
  }
}


/**
 * fill up a column with a given index inside of a given table
 *  @param {EventTarget} index
  *  @param {EventTarget} table
 */

function fillUpColumn(index, table){
  U.$(table).children[0].children[index].style.display = "";

  var views = "view" + index;
  U.$(views).textContent = JSON.parse(sessionStorage.getItem(wiki.viewsURL))[index].views;

  var title = "title" + index;
  var titleContent = JSON.parse(sessionStorage.getItem(wiki.thumbnailURL))[1].title;
  U.$(title).textContent = titleContent;
  U.$(title).href = JSON.parse(sessionStorage.getItem(wiki.thumbnailURL))[2].url;

  if(sessionStorage.getItem(wiki.thumbnailURL) !== null){
    var img = "img" + index;
    var imgSaved = U.$(img).src = JSON.parse(sessionStorage.getItem(wiki.thumbnailURL))[3];
    if(typeof imgSaved !== "undefined"){
      U.$(img).src = imgSaved.image;
      U.$(img).style.width = "200px";
      U.$(img).style.height = "200px";
      U.$(img).alt = "Image of " + titleContent;
    } else {
      U.$(img).src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      U.$(img).style.width = "1px";
      U.$(img).style.height = "1px";
      U.$(img).alt = "placeholder because image has no thumbnail";
    }


    var desc = "desc" + index;
    U.$(desc).textContent = JSON.parse(sessionStorage.getItem(wiki.thumbnailURL))[0].description;
  }
  if (index !== ((U.$("articlesNumber").selectedIndex + 1) * 5) - 1){
    var recursiveIndex = Number(index) + 1;
    get20Thumbnails(recursiveIndex);
  }else{
    initialCheckbox(table);
  }
  for (var k = ((U.$("articlesNumber").selectedIndex + 1) * 5) + 1; k < 21; k++) {
    U.$(table).children[0].children[k].style.display = "none";
  }
}

/**
 * create an object request compatible with every version if Internet explorer
 * @returns {object} return request object
 */
function createRequestObject() {
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return request;
}

/**
 * Verify if the date input is valid
 * @returns {boolean} returns value showing whether date is valid or not
 */
function verifyDate() {
  U.$("date").min = "2001-01-15";
  var maxDate = new Date();
  U.$("date").max = maxDate.getFullYear() + "-" +
    ("0" + (maxDate.getMonth() + 1)).slice(-2) + "-" + ("0" + maxDate.getDate()).slice(-2);
  if (U.$("date").value !== null) {
    if (!isNaN(U.$("date").value) || U.$("date").value !== "") {
      if (U.$("date").value < "2001-01-15" ||
        U.$("date").value > U.$("date").max) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * function called when submit is clicked. Indirectly calls
 * every other function in this file to fill up the table
 */
function getTableInfo(e) {
  var move = e || window.event;
  if (e) {
    move.preventDefault();
  } else {
    move.returnValue = false;
  }
  get20Views();
}

"use strict";


/**
 * global variable for the javascript file
 */
var gallery = {
  "headers": "",
  "content": ""
}


/** Create Dummy elemenets and assign functions to certains events
 *Block jumping in IE9>, and verify if user is a frequent visitor
 *Set up the values for gallery.headers and gallery.content
 *Call method to change CSS whenever user changes tab
 */
createDummyElements();
U.ready(function() {
  gallery.headers = U.$("headers");
  gallery.content = U.$("content");
  setup();
  for (var i = 1; i < gallery.content.children.length; i++) {
    gallery.content.children[i].style.display = "none";
    gallery.headers.children[i].style.borderBottom = "solid";
  }
  gallery.headers.children[0].style.borderBottom = "none";
  for (var j = 0; j < gallery.headers.children.length; j++) {
    U.addHandler(gallery.headers.children[j], "click", tabClick);
  }
  preventJump("headers");
  frequentVisitor();
  hideTabHeaders(document.getElementsByClassName("tabHeader"));
});


/**
 * initial css for the webpage and call localStorage to set the values if they are saved
 */

function setup() {
  for (var i = 0; i < gallery.content.children.length; i++) {
    gallery.content.children[i].display = "none";
  }
  for (var j = 0; j < gallery.headers.children.length; j++) {
    gallery.headers.children[j].style.borderBottom = "none";
  }
  U.$("topArticles").style.borderBottom = "solid";
  U.$("tab1").style.display = "block";
  if (setupLocalStorage() === true) {
    var date = localStorage.getItem("date");
    U.$("date").value = date;
    U.$("language").selectedIndex = localStorage.getItem("language");
    U.$("articlesNumber").selectedIndex = localStorage.getItem("articlesNumber");
  } else {
    var yesterday = new Date();
    yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
    U.$("date").value = yesterday.getUTCFullYear() + "-" +
      ("0" + (yesterday.getMonth() + 1)).slice(-2) + "-" + ("0" + yesterday.getDate()).slice(-2);
    U.$("articlesNumber").selectedIndex = 1;
  }
}


/**
 * Set ups the cookies and verifies if the user has visisted
 * the website for the 10th time, if so display a message
 */

function frequentVisitor() {
  var today = new Date();
  var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  if (document.cookie.length === 0) {
    document.cookie = "NumberOfVisits=" + 0 + ";expires=" + nextweek;
  }

  var cookieVisits = document.cookie.split(";");
  cookieVisits = cookieVisits[0].substring(cookieVisits[0].indexOf("=") + 1);
  if (!isNaN(Number(cookieVisits))) {
    if (cookieVisits + 1 === 10) {
      U.$("visit").removeChild(U.$("welcome"));
    }
    document.cookie = "NumberOfVisits=" +
      (Number(cookieVisits) + 1) + "; expires=" + nextweek;
    if (Number(cookieVisits) + 1 === 10) {
      var welcome = document.createElement("p");
      welcome.id = "welcome";
      U.setText(welcome, "Thank you for being an active visitor! :D");
      U.$("visit").append(welcome);
      setTimeout(function() {
        U.$("visit").firstElementChild.remove();
      }, 10000);
    }
  } else {
    document.cookie = "NumberOfVisits=" + 0 + ";expires=" + nextweek;
  }
}




/**
 * Creation all semantic elements if they do not exist
 */

function createDummyElements() {
  var semanticElements = [
    "article", "aside", "details", "figcaption", "figure",
    "footer", "header", "hgroup", "menu", "nav", "section"
  ];
  for (var i = 0; i < semanticElements.length; i++) {
    document.createElement(semanticElements[i]);
  }
}

/**
 *Change the CSS whenever user clicks on different tabs
 *  @param {EventTarget} e
 */

function tabClick(e) {
  var move = e || window.event;
  var target = move.target || move.srcElement;
  for (var i = 0; i < gallery.content.children.length; i++) {
    gallery.content.children[i].style.display = "none";
    gallery.headers.children[i].style.borderBottom = "solid";
  }
  target.style.borderBottom = "none";
  var substringValue = target.href.substring(target.href.length - 4);
  U.$(substringValue).style.display = "block";
}

/**
 * prevents the anchors from jumping if we are using IE9>
 */

function preventJump(navID) {
  for(var i = 0; i < U.$(navID).children.length; i++){
    var varHref = U.$(navID).children[i].href;
    U.$(navID).children[i].href = "#!" + varHref.substring(
      varHref.indexOf("#") + 1, varHref.length);
  }
}

/**
 * Hides every element of a certain class
 *  @param {EventTarget} classToHide
 */

function hideTabHeaders(classToHide){
  for (var i = 0; i < classToHide.length; i++){
    classToHide[i].style.display = "none";
  }
}

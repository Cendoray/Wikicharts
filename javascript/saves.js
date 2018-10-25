"use strict";


/**
 * Give each checkbox a function to save them when DOM is loaded and load every saved articles
 */
U.ready(function() {
  for (var j = 1; j < U.$("table").rows.length; j++) {
    U.addHandler(U.$("table").rows[j].cells[0].firstElementChild, "click", checkboxClick)
  }
  initialLoad("savedTable", "saved");
  noSavedYet();
});

/**
 * save the checkbox if it is clicked, else call checkboxRelease
 *  @param {EventTarget} e
 */
function checkboxClick(e) {
  var move = e || window.event;
  var target = move.target || move.srcElement;
  var savedValue = JSON.parse(localStorage.getItem("saved"));
  var titleContent = target.parentElement.parentElement.children[1].firstElementChild.textContent;
  var descriptionContent = target.parentElement.parentElement.
    children[2].firstElementChild.textContent;
  if (titleContent !== "" && titleContent !== null &&
  descriptionContent !== "" && descriptionContent !== null) {
    if (target.alt === "Empty Star") {
      target.alt = "Filled Star";
      var obj = {
        title: titleContent,
        description: descriptionContent
      };
      if (savedValue !== null) {
        savedValue.push(obj);
        localStorage.setItem("saved", JSON.stringify(savedValue));
      } else {
        localStorage.setItem("saved", JSON.stringify([obj]));
      }
      loadSaveTable(target);
      initialCheckbox("savedTable");
    } else {
      target.alt = "Empty Star";
      checkboxRelease(e);
    }
  }
}
/**
 * Remove the checkbox clicked from the saved ones
 *  @param {EventTarget} e
 */
function checkboxRelease(e) {
  var move = e || window.event;
  var target = move.target || move.srcElement;
  var savedValue = localStorage.getItem("saved");
  var parsedValue = JSON.parse(savedValue);
  if (savedValue !== null && typeof parsedValue === "object") {
    if (typeof parsedValue === "object") {
      var checkboxTitle = target.parentElement.parentElement.children[1].
        firstElementChild.textContent;
      var i = 0;
      for (i = 0; i < parsedValue.length; i++) {
        if (parsedValue[i].title === checkboxTitle) {
          break;
        }
      }
      delete parsedValue[i];
      for (var j = 0; j < parsedValue.length; j++) {
        if (typeof parsedValue[j] === "undefined") {
          parsedValue.splice(j, 1);
          break;
        }
      }
      localStorage.setItem("saved", JSON.stringify(parsedValue));
      loadSaveTable(target);
      if (target.parentElement.parentElement.parentElement === null) {
        initialCheckbox("savedTable");
      }
    }
  }
}

/**
 * set every checkbox's color to yellow if it saved
 *  @param {String} tableID
 */
function initialCheckbox(tableID) {
  var savedItem = localStorage.getItem("saved");
  var savedItemParse = JSON.parse(savedItem);
  var count = 0;
  if (savedItem !== null && typeof savedItemParse === "object") {
    for (var i = 1; i < U.$(tableID).children[0].children.length; i++) {
      count = 0;
      for (var j = 0; j < savedItemParse.length; j++) {
        if (U.$(tableID).children[0].children[i].children[1].firstElementChild.textContent ===
          savedItemParse[j].title) {
          U.$(tableID).children[0].children[i].firstElementChild.firstElementChild.alt = "Filled Star";
        } else {
          count = Number(count) + 1;
        }
        if (count === savedItemParse.length) {
          U.$(tableID).children[0].children[i].firstElementChild.
            firstElementChild.alt = "Empty Star";
        }
      }
    }
    if (savedItemParse.length === 0) {
      for (var k = 1; k < U.$(tableID).children[0].children.length; k++) {
        U.$(tableID).children[0].children[k].firstElementChild.firstElementChild.alt = "Empty Star";
      }
    }
  } else {
    for (var l = 1; l < U.$(tableID).children[0].children.length; l++) {
      U.$(tableID).children[0].children[l].firstElementChild.firstElementChild.alt = "Empty Star";
    }
  }
  for(var x = 1; x < U.$(tableID).children[0].children.length; x++){
    if(U.$(tableID).children[0].children[x].
      firstElementChild.firstElementChild.alt === "Empty Star"){
      U.$(tableID).children[0].children[x].
        firstElementChild.firstElementChild.src = "./imgs/emptyStar.png";
    }else{
      U.$(tableID).children[0].children[x].
        firstElementChild.firstElementChild.src = "./imgs/FilledStar.png";
    }
  }
}

/**
 * load the "savedTable" with all the saved articles
 *  @param {EventTarget} target
 */

function loadSaveTable(target) {
  var savedItem = localStorage.getItem("saved");
  var savedItemParse = JSON.parse(savedItem);
  if (savedItem !== null && typeof savedItemParse === "object" &&
    target !== null && typeof target === "object") {
    var titleString = target.parentElement.parentElement.children[1].firstElementChild.textContent;
    var exists = existsInLocal("saved", titleString);
    var size = 0;
    if (savedItemParse.length > U.$("savedTable").firstElementChild.children.length - 1) {
      size = savedItemParse.length;
    } else {
      size = U.$("savedTable").firstElementChild.children.length;
    }
    if (U.$("savedTable").firstElementChild.children.length === 1) {
      addRow(savedItemParse, 1, "savedTable");
    }

    for (var i = 1; i < size + 1; i++) {
      if (containsDuplicate("savedTable", titleString) === 1) {
        U.$("savedTable").deleteRow(i - 1);
        size = Number(size) - 1;
      }
      var stringlocation = "";
      if (size <= 1) {
        stringlocation = U.$("savedTable").firstElementChild.children[i].children[1].textContent;
      } else {
        stringlocation = U.$("savedTable").firstElementChild.children[i - 1].
          children[1].textContent;
      }
      if (stringlocation === titleString) {
        if (exists) {
          if (!tableContainsItem("savedTable", savedItemParse[i - 1].title)) {
            addRow(savedItemParse, i, "savedTable");
          }
        } else {
          U.$("savedTable").deleteRow(i - 1);
          size = Number(size) - 1;
        }
      }else if(typeof savedItemParse[i - 1] !== "undefined"){
        if (!tableContainsItem("savedTable", savedItemParse[i - 1].title)) {
          addRow(savedItemParse, i, "savedTable");
        }
      }
    }
    initialCheckbox("savedTable");
    initialCheckbox("table");
    noSavedYet();
  }
}

/**
 * reset a given table
 *  @param {EventTarget} tableID
 */
function resetSaveTable(tableID){
  for(var i = 1 ; i < U.$(tableID).firstElementChild.children.length;){
    U.$(tableID).deleteRow(i);
  }
}

/**
 *  loop through a table to verify if it contains any duplicates
 *  @returns {int} 0 if it only finds the item itself
 *  @returns {int} 1 if it finds duplicates
 *  @returns {int} -1 if it cannot find item itself (error occurs)
 *  @param {EventTarget} tableID
 *  @param {EventTarget} title
 */

function containsDuplicate(tableID, title) {
  if (tableID !== null && typeof tableID === "string" &&
   typeof title === "string" && title !== null) {
    var count = 0;
    for (var k = 1; k < U.$(tableID).firstElementChild.children.length + 1; k++) {
      if (title === U.$(tableID).firstElementChild.children[k - 1].children[1].textContent) {
        count = Number(count) + 1;
        if (count === 2) {
          break;
        }
      }
    }
    if (count === 1) {
      return 0;
    }
    if (count === 2) {
      return 1
    }
    return -1;
  }
}


/**
 * verifies in a given storage if a certain title exists
 *  @param {EventTarget} storageName
 *  @param {EventTarget} title
 *  @returns {boolean} returns boolean whether or not title exists in given storageName
 */

function existsInLocal(storageName, title) {
  var savedItem = localStorage.getItem(storageName);
  var savedItemParse = JSON.parse(savedItem);
  if (typeof storageName === "string" && storageName &&
  typeof title === "string" && title !== null) {
    for (var j = 0; j < savedItemParse.length; j++) {
      if (title === savedItemParse[j].title) {
        return true;
      }
    }
    return false;
  }
}

function tableContainsItem(tableID, el) {
  if (tableID !== null && typeof tableID === "string" && typeof el !== "undefined" && el !== null) {
    for (var i = 1; i < U.$(tableID).firstElementChild.children.length; i++) {
      if (el === U.$(tableID).firstElementChild.children[i].children[1].textContent){
        return true;
      }
    }
    return false;
  }
}


/**
 * adds a row to a given table at location rownum, using the given localStorageItem
 *  @param {EventTarget} localStorageItem
 *  @param {EventTarget} rownum
  * @param {EventTarget} tableID
 */

function addRow(localStorageItem, rownum, tableID) {
  if (typeof localStorageItem === "object") {
    var row = document.createElement("tr");
    var saved = document.createElement("td");
    var title = document.createElement("td");
    var desc = document.createElement("td");
    var titleAnchor = document.createElement("a");
    var descPara = document.createElement("p");
    titleAnchor.textContent = localStorageItem[rownum - 1].title;
    descPara.textContent = localStorageItem[rownum - 1].description;
    var checkbox = document.createElement("img");
    checkbox.alt = "Empty Star";
    checkbox.src = "./imgs/emptyStar.png";
    checkbox.classList.add("checkbox");
    var englishLink = JSON.parse(sessionStorage.
      getItem("https://en.wikipedia.org/api/rest_v1/page/summary/" +
      titleAnchor.textContent.replace(/ /g, "_")));
    var frenchLink = JSON.parse(sessionStorage.
      getItem("https://fr.wikipedia.org/api/rest_v1/page/summary/" +
      titleAnchor.textContent.replace(/ /g, "_")));
    var link = "";
    if (englishLink !== null) {
      link = englishLink[2].url;
    } else if (frenchLink !== null) {
      link = frenchLink[2].url;
    } else {
      return;
    }
    titleAnchor.href = link;
    saved.append(checkbox);
    title.append(titleAnchor);
    desc.append(descPara);
    row.append(saved);
    row.append(title);
    row.append(desc);
    U.$(tableID).firstElementChild.append(row);
    U.addHandler(U.$(tableID).rows[rownum].cells[0].firstElementChild, "click", checkboxClick)
  }
}

/**
 * loads every item in the given localStorage to a given table
 *  @param {EventTarget} localStorageItem
 *  @param {EventTarget} tableID
 */
function initialLoad(tableID, localStorageItem) {
  var savedItem = localStorage.getItem(localStorageItem);
  var savedItemParse = JSON.parse(savedItem);
  if (savedItem !== null && typeof savedItemParse === "object") {
    for (var i = 0; i < savedItemParse.length; i++) {
      addRow(savedItemParse, i + 1, "savedTable");
    }
  }
  initialCheckbox(tableID);
  for (var k = 1; k < U.$(tableID).rows.length; k++) {
    U.addHandler(U.$(tableID).rows[k].cells[0].firstElementChild, "click", checkboxClick)
  }
}

/**
 * Loads/unloads a message on the save page explaining
 * its usefulness to the users based on the page's content
 */
function noSavedYet(){
  if(U.$("savedTable").firstElementChild.children.length > 1){
    U.$("empty").style.display = "none";
  }else{
    U.$("empty").style.display = "block";
  }
}

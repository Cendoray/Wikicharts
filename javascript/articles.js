"use strict";


/**
 * give functions to certain buttons when DOM is loaded
 */
U.ready(function(){
  initialCheckbox("table");
  U.addHandler(U.$("save"), "click", saveButton);
  U.addHandler(U.$("reset"), "click", resetButton);
  U.addHandler(U.$("tutorial"), "click", hideButton);
  if(!addEventListener){
    oldInternet("oldInternet");
  }
});

/**
 * Verify if the values in local storage are valid
 *  @returns {boolean} return boolean verifying whether localStorage was setup correctly or not
 */

function setupLocalStorage() {
  //date API was created
  U.$("date").min = "2015-07-01";
  var maxDate = new Date();
  U.$("date").max = maxDate.getFullYear() + "-" +
    ("0" + (maxDate.getMonth() + 1)).slice(-2) + "-" + ("0" + maxDate.getDate()).slice(-2);
  if (localStorage.getItem("date") !== null) {
    if (!isNaN(localStorage.getItem("date")) || localStorage.getItem("date") !== "") {
      if (localStorage.getItem("date") < "2001-01-15" ||
        localStorage.getItem("date") > U.$("date").max) {
        return false;
      }
    } else {
      return false;
    }
    if (!isNaN(localStorage.getItem("language"))) {
      if (localStorage.getItem("language") > U.$("language").children.length ||
        localStorage.getItem("language") < 0) {
        return false;
      }
    } else {
      return false;
    }
    if (!isNaN(localStorage.getItem("articlesNumber"))) {
      if (localStorage.getItem("articlesNumber") > U.$("articlesNumber").children.length ||
        localStorage.getItem("articlesNumber") < 0) {
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
 * save buttons that saves all the values to local storage if they are valid
 *  @param {EventTarget} e
 */

function saveButton(e) {
  var move = e || window.event;
  localStorage.setItem("date", U.$("date").value);
  localStorage.setItem("language", U.$("language").selectedIndex);
  localStorage.setItem("articlesNumber", U.$("articlesNumber").selectedIndex);
  if (e) {
    move.preventDefault()
  } else {
    move.returnValue = false;
  }
}


/**  resets the values on the form and deletes everything wihtin local storage
 *  @param {EventTarget} e
 */

function resetButton(e) {
  var move = e || window.event;
  U.$("date").valueAsDate = null;
  U.$("articlesNumber").selectedIndex = 0;
  U.$("language").selectedIndex = 0;
  localStorage.clear();
  sessionStorage.clear();
  initialCheckbox("table");
  for(var i = 1; i < U.$("table").firstElementChild.rows.length - 1; i++){
    for (var j = 0; j < U.$("table").firstElementChild.rows[i].children.length; j++){
      if (j === 3){
        U.$("table").firstElementChild.rows[i].children[j].firstElementChild.src =
         "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
        U.$("table").firstElementChild.rows[i].children[j].firstElementChild.style.width = "1px";
        U.$("table").firstElementChild.rows[i].children[j].firstElementChild.style.height = "1px";
      }else if (j !== 0){
        U.$("table").firstElementChild.rows[i].children[j].firstElementChild.textContent = "";
      }
      U.$("table").firstElementChild.rows[i].children[j].style.height =   "41px";
    }
    U.$("table").firstElementChild.rows[i].style.height = "41px";
  }
  initialCheckbox("table");
  resetSaveTable("savedTable");
  if (e) {
    move.preventDefault()
  } else {
    move.returnValue = false;
  }
}
/**  hide the instructions
 *  @param {EventTarget} e
 */
function hideButton(e){
  var move = e || window.event;
  if (U.$("tutorial").textContent === "Hide"){
    U.$("tutorial").textContent = "Show";
    U.$("instructions").style.display = "none";
  } else {
    U.$("tutorial").textContent = "Hide";
    U.$("instructions").style.display = "inline";
  }
  if (e) {
    move.preventDefault()
  } else {
    move.returnValue = false;
  }
}
/**  Tell the users their internet is old and they will lack certain features
*  @param {EventTarget} location
 */
function oldInternet(locationID){
  var para = document.createElement("p");
  var text = document.createTextNode("Your browser seems to be too old to be able to use some" +
  "of the features available in this website. We apologize for the inconvenience");
  para.append(text);
  U.$(locationID).append(text);
}

"use strict";

var charGlobal = {
  "text": "",
  "requestMonthly": "",
  "months" :
  ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"]
};

/**
 * executes when DOM is loaded
 */
U.ready(function() {
  U.addHandler(U.$("submitChart"), "click", submitChart);
  U.$("invalidSearch").style.display = "none";
});

/**
 * create a chart
 */
function createChart() {
  if(U.$("canvas") !== null){
    U.$("canvas").remove();
  }
  var canvas = document.createElement("canvas");
  canvas.id = "canvas";
  U.$("canvasContainer").append(canvas);
  var chart = document.getElementById("canvas");
  var myChart = new Chart(chart, {
    type: "bar",
    data: {
      labels: [
        charGlobal.months[getMonth(11)],
        charGlobal.months[getMonth(10)],
        charGlobal.months[getMonth(9)],
        charGlobal.months[getMonth(8)],
        charGlobal.months[getMonth(7)],
        charGlobal.months[getMonth(6)],
        charGlobal.months[getMonth(5)],
        charGlobal.months[getMonth(4)],
        charGlobal.months[getMonth(3)],
        charGlobal.months[getMonth(2)],
        charGlobal.months[getMonth(1)],
        charGlobal.months[getMonth(0)]
      ],
      datasets: [{
        label: "# of Views per Month in the Last Year",
        data: [JSON.parse(sessionStorage.getItem(charGlobal.text))[0],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[1],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[2],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[3],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[4],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[5],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[6],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[7],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[8],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[9],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[10],
          JSON.parse(sessionStorage.getItem(charGlobal.text))[11],
        ],
        backgroundColor: [
          "rgba(255,99,132,0.4)",
          "rgba(54, 162, 235, 0.24",
          "rgba(255, 206, 86, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(153, 102, 255, 0.4)",
          "rgba(255, 159, 64, 0.4)",
          "rgba(46, 138, 138, 0.4)",
          "rgba(114,31,164, 0.4)",
          "rgba(218,30,195, 0.4)",
          "rgba(222,58,25, 0.4)",
          "rgba(160,191,233, 0.4)",
          "rgba(32,172,51, 0.4)"
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(46, 138, 138, 1)",
          "rgba(114,31,164, 1)",
          "rgba(218,30,195, 1)",
          "rgba(222,58,25, 1)",
          "rgba(160,191,233, 1)",
          "rgba(32,172,51, 1)"

        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function submitChart(e) {
  var move = e || window.event;
  if (e) {
    move.preventDefault();
  } else {
    move.returnValue = false;
  }
  getViewsAtMonth();
}

/**
 * get the 20 most viewed articles of Wikipedia during a certain date,
 * with their title and number of views (except for main menu and those which start with "Special")
 */
function getViewsAtMonth() {
  charGlobal.text = U.$("chartText").value;
  charGlobal.text = charGlobal.text.replace(/ /g, "_")
  var lang = U.$("languageViews").value.substring(0, 2).toLowerCase();
  if (charGlobal.text !== "" && typeof charGlobal.text === "string") {
    var yesterday = new Date();
    yesterday.setMonth(yesterday.getMonth());
    var lastYear = new Date();
    lastYear.setMonth(lastYear.getMonth() - 12);
    var yesterdayString = yesterday.getFullYear() +
      ("0" + (yesterday.getMonth() + 1)).slice(-2) +
      ("0" + yesterday.getDate()).slice(-2) + "01";
    var lastYearString = lastYear.getFullYear() +
      ("0" + (lastYear.getMonth() + 1)).slice(-2) +
      ("0" + lastYear.getDate()).slice(-2) + "01";

    charGlobal.requestMonthly = createRequestObject();
    charGlobal.requestMonthly.setRequestHeader =
    ("Api-User-Agent", "daniel.rafail@dawsoncollege.qc.ca");
    charGlobal.requestMonthly.onreadystatechange = displayViewsAtMonth;
    var url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/" +
      lang + ".wikipedia.org/all-access/all-agents/" +
      encodeURI(charGlobal.text) + "/monthly/" + lastYearString + "/" +
      yesterdayString;
    if(sessionStorage.getItem(charGlobal.text) === null){
      charGlobal.requestMonthly.open("GET", url, true);
      charGlobal.requestMonthly.send(null);
    }else{
      U.$("invalidSearch").style.display = "none";
      createChart();
    }
  }
}

/**
 * Take the request from the 20 most viewed articles and save it in sessionstorage
 */
function displayViewsAtMonth() {
  if (charGlobal.requestMonthly.readyState === 4 && charGlobal.requestMonthly.status === 200) {
    U.$("invalidSearch").style.display = "none";
    var views = JSON.parse(charGlobal.requestMonthly.responseText);
    var counter = 0;
    var array = [];
    while (counter < views.items.length) {
      array[counter] = views.items[counter].views;
      counter = Number(counter) + 1;
    }
    sessionStorage.setItem(charGlobal.text, JSON.stringify(array));
    createChart();
  }else if(charGlobal.requestMonthly.status >= 400){
    U.$("invalidSearch").style.display = "block";
    U.$("canvas").remove();
  }
}

function getMonth(minusMonths){
  var date = new Date();
  date.setDate(date.getDate() - 1);
  date.setMonth(date.getMonth() - minusMonths);
  return date.getMonth();
}

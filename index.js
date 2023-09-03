let currImgCon = document.getElementById("current-image-container");
let mainTitle =document.getElementById("main-title")
mainTitle.innerText = "NASA'S PICTURE OF THE DAY";
//search related

let searchInput = document.getElementById("search-input");
(function(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '-' + mm + '-' + dd;
  searchInput.setAttribute("max", today);
})()
let searchBtn = document.getElementById("search-btn");
let searchHistory = document.getElementById("search-history");

//apikey
let your_api_key = "fHKy9jdgAq24Qxa61mmtYYblKMt8tPb5LVx1IRbF";

//date variables
let date = new Date().toISOString().split("T")[0];
let prevDate = date;
let currentDate = "";
let filterArray = [];

//image container related

let currImg = document.getElementById("current-image");
let imgTitle = document.getElementById("img-title");
let imgPara = document.getElementById("img-explanation");


// event listeners
searchBtn.addEventListener("click", () => {
  if (searchInput.value) {
    console.log(searchInput.value);
    callapi(getImageOfTheDay, searchInput.value);
  }
});
window.addEventListener("load", () => {
  callapi(getCurrentImageOfTheDay, date);
  let storedData = JSON.parse(localStorage.getItem("Searches"));
  storedData.forEach(element => {
    addSearchToHistory(element)
  });
});

// //functions
function callapi(callback, mydate) {
  fetch(
    `https://api.nasa.gov/planetary/apod?date=${mydate}&api_key=${your_api_key}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.date);
      callback(data);
    })
    .catch(() => "not fetched");
}

function getCurrentImageOfTheDay(data) {
  imgTitle.innerText = data.title;
  imgPara.innerText = data.explanation;
  currImg.src = data.hdurl;
  console.log("getCurrentImageOfTheDay");
}
function getImageOfTheDay(data) {
  imgTitle.innerText = data.title;
  imgPara.innerText = data.explanation;
  currImg.src = data.hdurl;
  console.log("getImageOfTheDay");
  saveSearch(data);
}
function saveSearch(data) {
  console.log("saveSearch");
  mainTitle.innerText = data.date === date ? "NASA'S PICTURE OF THE DAY" : `Picture On ${data.date} `;
  if(!filterArray.every( x => x!== data.date))return;
 console.log("after saveSearch");
  let currDate = { date: `${data.date}` };
  localStorage.setItem(
    "Searches",
    JSON.stringify(
      localStorage.getItem("Searches")
        ? [...JSON.parse(localStorage.getItem("Searches")),currDate]
        : [currDate]
    )
  );
  addSearchToHistory(data);
}

function addSearchToHistory(data) {
    console.log("addSearchToHistory");
  let dateDiv = document.createElement("div");
  dateDiv.id = searchHistory.children
    ? `${searchHistory.children.length + 1}`
    : "1";
  dateDiv.className = "dateDiv";
  dateDiv.innerText = `${data.date}`;
  prevDate = data.date;
  filterArray = [...filterArray,prevDate];
  console.log("filterArr" , filterArray);
  dateDiv.addEventListener("click", (e) => {
    let date = e.target.innerText;
    console.log("dateDiv addEvent" , date);
    callapi(getImageOfTheDay, date);
  });
  searchHistory.append(dateDiv);
}

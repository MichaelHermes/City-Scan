apikey = "1848b424826d4a65a0322573e16402b2";

//get user input from localstorage for state - use state variable to call API
let obj = JSON.parse(localStorage.getItem("City Search Criteria"));
let selectedState = obj["State-Abbreviation"];
let selectedStateName = obj["State-Name"];

statelookup(selectedStateName);

function statelookup() {
  //format api response to display nicely in HTML - from https://masteringjs.io/tutorials/fundamentals/capitalize-first-letter
  let str = selectedStateName.replace(/\_/g, " ");
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  let caps = str.split(" ").map(capitalize).join(" ");
  $("#state-name").html(caps);

  $.ajax({
    url:
      "https://api.covidactnow.org/v2/state/" +
      selectedState +
      ".json?apiKey=" +
      apikey,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    let riskLevel = response["riskLevels"]["overall"];
    let riskLevelList = $("<p></p>").text(riskLevel);
    $("#risk-level").html(riskLevelList);

    let newCases = response["actuals"]["newCases"];
    let newCasesList = $("<p></p>").text(newCases);
    $("#daily-case").html(newCasesList);

    let vaccinatedPercent =
      (response["metrics"]["vaccinationsCompletedRatio"] * 100).toFixed(2) +
      "%";
    let vaccinatedPercentList = $("<p></p>").text(vaccinatedPercent);
    $("#perc-vax").html(vaccinatedPercentList);

    let moreInfoLink = response["url"];
    let moreInfo = $("<a></a>").attr("href", moreInfoLink).text(moreInfoLink);
    $("#more-info").html(moreInfo);

    if (riskLevel === 0) {
      riskLevelList.addClass("low");
    } else if (riskLevel === 1) {
      riskLevelList.addClass("medium");
    } else if (riskLevel === 2) {
      riskLevelList.addClass("high");
    } else if (riskLevel === 3) {
      riskLevelList.addClass("very-high");
    } else {
      riskLevelList.addClass("severe");
    }
  });
}

requestStateUrl = "https://api.covidactnow.org/v2/states.json?apiKey=" + apikey;

//data for all states - for search bar
$.ajax({
  url: requestStateUrl,
  method: "GET",
}).then(function (response) {
  //loop through states for selection on searchbar
  for (let i = 0; i < response.length; i++) {
    let stateName = response[i]["state"];

    let urlResponse = response[i]["url"].split("/");
    stateUrl = urlResponse[4].split("-");
    stateNameUrl = stateUrl[0];

    let stateInfoList = $("<option></option>").text(stateName);
    stateInfoList.val(stateNameUrl);
    $("#state-list").append(stateInfoList);
  }
});

$("#search").on("submit", function (event) {
  event.preventDefault();
  //new state selected from dropdown menu
  let stateSelect = $("#state-list option:checked").text();

  function formstatelookup() {
    $.ajax({
      url:
        "https://api.covidactnow.org/v2/state/" +
        stateSelect +
        ".json?apiKey=" +
        apikey,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      //full state name
      let urlResponse = response["url"].split("/");
      stateUrl = urlResponse[4].split("-");
      stateNameUrl = stateUrl[0];
      let str = stateNameUrl.replace(/\_/g, " ");
      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      let caps = str.split(" ").map(capitalize).join(" ");
      $("#state-name").innerHTML = "";
      $("#state-name").html(caps);

      let riskLevel = response["riskLevels"]["overall"];
      let riskLevelList = $("<p></p>").text(riskLevel);
      $("#risk-level").innerHTML = "";
      $("#risk-level").html(riskLevelList);

      let newCases = response["actuals"]["newCases"];
      let newCasesList = $("<p></p>").text(newCases);
      $("#daily-case").innerHTML = "";
      $("#daily-case").html(newCasesList);

      let vaccinatedPercent =
        (response["metrics"]["vaccinationsCompletedRatio"] * 100).toFixed(2) +
        "%";
      let vaccinatedPercentList = $("<p></p>").text(vaccinatedPercent);
      $("#perc-vax").innerHTML = "";
      $("#perc-vax").html(vaccinatedPercentList);

      let moreInfoLink = response["url"];
      let moreInfo = $("<a></a>").attr("href", moreInfoLink).text(moreInfoLink);
      $("#more-info").innerHTML = "";
      $("#more-info").html(moreInfo);

      if (riskLevel === 0) {
        riskLevelList.addClass("low");
      } else if (riskLevel === 1) {
        riskLevelList.addClass("medium");
      } else if (riskLevel === 2) {
        riskLevelList.addClass("high");
      } else if (riskLevel === 3) {
        riskLevelList.addClass("very-high");
      } else {
        riskLevelList.addClass("severe");
      }
    });
  }
  formstatelookup();
});

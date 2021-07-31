//https://apidocs.covidactnow.org/data-definitions

apikey = "1848b424826d4a65a0322573e16402b2";

    //placeholder for now - change to user selected

let obj = JSON.parse(localStorage.getItem("City Search Criteria"))

let selectedState = obj["State-Abbreviation"]
console.log(selectedState);

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
      let riskLevelList = $("<p></p>").text(riskLevel)
      $("#risk-level").append(riskLevelList)
      
      let newCases = response["actuals"]["newCases"];
      let newCasesList = $("<p></p>").text(newCases)
      $("#daily-case").append(newCasesList)
      
      let vaccinatedPercent = (response["metrics"]["vaccinationsCompletedRatio"] * 100).toFixed(2) + "%"
      let vaccinatedPercentList = $("<p></p>").text(vaccinatedPercent)
      $("#perc-vax").append(vaccinatedPercentList)
      
      let moreInfoLink = response["url"]
      let moreInfo = "For more information visit " + $("<a></a>").attr("href",moreInfoLink).text(moreInfoLink)
      let moreInfoList = $("<p></p>").text(moreInfo)
      $("#state-name").append(moreInfoList)

      if (riskLevel === 0) {
        riskLevelList.addClass("low") 
      } else if (riskLevel === 1) {
        riskLevelList.addClass("medium")
      } else if (riskLevel === 2) {
        riskLevelList.addClass ("high")
      } else if (riskLevel === 3) {
        riskLevelList.addClass("very-high")
      } else {
        riskLevelList.addClass("severe")
      }
    });



requestStateUrl = "https://api.covidactnow.org/v2/states.json?apiKey=" + apikey;

//data for all states - for search bar
$.ajax({
  url: requestStateUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
  //loop through states for selection on searchbar
  for (let i = 0; i < response.length; i++) {
    let stateName = response[i]["state"];

    let urlResponse = response[i]["url"].split("/")
    stateUrl = urlResponse[4].split("-")
    stateNameUrl = stateUrl[0]
    // console.log(stateNameUrl)

    //set option/value to state name and state abbreviation
    let stateInfoList = $("<option></option>").text(stateName)
    stateInfoList.val(stateNameUrl)
    $("#state-list").append(stateInfoList)
  }
});

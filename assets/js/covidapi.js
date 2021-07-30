//https://apidocs.covidactnow.org/data-definitions

apikey = "1848b424826d4a65a0322573e16402b2";
requestStateUrl = "https://api.covidactnow.org/v2/states.json?apiKey=" + apikey;

//data for all states
$.ajax({
  url: requestStateUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
  //loop through states for selection on homepage
  for (let i = 0; i < response.length; i++) {
    let stateName = response[i]["state"];

   //getting full state name value
    let urlResponse = response[i]["url"].split("/")
    stateUrl = urlResponse[4].split("-")
    stateNameUrl = stateUrl[0]
    console.log(stateNameUrl)

    //set option/value to state name and state abbreviation
    let stateInfoList = $("<option></option>").text(stateName)
    stateInfoList.val(stateNameUrl)
    $("#search").append(stateInfoList)

  }
});
    //placeholder for now - change to user selected
    let selectedState = "WA";
    $.ajax({
      url:
        "https://api.covidactnow.org/v2/state/" +
        selectedState +
        ".json?apiKey=" +
        apikey,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log(selectedState);

      let riskLevel = "Risk Level (0=low,1=medium,2=high,3=very high,4=severe): " + response["riskLevels"]["overall"];
      let riskLevelList = $("<p></p>").text(riskLevel)
      $("#risk-level").append(riskLevelList)
      
      let newCases = "New Cases " + response["actuals"]["newCases"];
      let newCasesList = $("<p></p>").text(newCases)
      $("#daily-case").append(newCasesList)
      
      let vaccinatedPercent = "Vaccines Completed (% of total population) " + (response["metrics"]["vaccinationsCompletedRatio"] * 100)
      let vaccinatedPercentList = $("<p></p>").text(vaccinatedPercent)
      $("#perc-vax").append(vaccinatedPercentList)
      
      let moreInfo = "For more information visit " + response["url"]
      let moreInfoList = $("<p></p>").text(moreInfo)
      $("#perc-vax").after(moreInfoList)
    });


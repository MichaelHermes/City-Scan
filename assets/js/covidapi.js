//https://apidocs.covidactnow.org/data-definitions

//by specific parameter
//state https://api.covidactnow.org/v2/state/{state}.json?apiKey=1848b424826d4a65a0322573e16402b2
//county https://api.covidactnow.org/v2/county/{fips}.json?apiKey=1848b424826d4a65a0322573e16402b2
//metros https://api.covidactnow.org/v2/cbsa/{cbsa_code}.json?apiKey=1848b424826d4a65a0322573e16402b2

apikey = "1848b424826d4a65a0322573e16402b2";
requestStateUrl = "https://api.covidactnow.org/v2/states.json?apiKey=" + apikey;

//data for all states
$.ajax({
  url: requestStateUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
  //selection - when form submits, use that info to fetch specific state info 
  //display that info on the page 
  for (let i = 0; i < response.length; i++) {
    let stateName = response[i]["state"];
    //change li to option value inside select element that will be made
    let stateNameList = $("<li></li>").text(stateName)
    //<option value="full state name">WA</option>
    $("#search").append(stateNameList)
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

      let json = response["url"]
      let obj = JSON.stringify(json)
      console.log(obj)
      let parse = JSON.parse(obj)
      console.log(parse)

      var urlresponse = json.split("/")
      console.log(urlresponse)
      console.log(urlresponse[4])
      stateurl = urlresponse[4]
      statenameurl = stateurl.split("-")
      console.log(statenameurl)

      

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


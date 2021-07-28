//https://apidocs.covidactnow.org/data-definitions

//by specific parameter
//state https://api.covidactnow.org/v2/state/{state}.json?apiKey=1848b424826d4a65a0322573e16402b2
//county https://api.covidactnow.org/v2/county/{fips}.json?apiKey=1848b424826d4a65a0322573e16402b2
//metros https://api.covidactnow.org/v2/cbsa/{cbsa_code}.json?apiKey=1848b424826d4a65a0322573e16402b2

apikey = "1848b424826d4a65a0322573e16402b2";

//list of all data by category
requestCountyUrl =
  "https://api.covidactnow.org/v2/counties.json?apiKey=" + apikey;
requestStateUrl = "https://api.covidactnow.org/v2/states.json?apiKey=" + apikey;

//data for all counties
$.ajax({
  url: requestCountyUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
  //targeting specific place
  console.log(response[3049]["fips"]);
  let countyname = response[3049]["fips"];

  //data for specific county
  $.ajax({
    url:
      "https://api.covidactnow.org/v2/county/" +
      countyname +
      ".json?apiKey=" +
      apikey,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(response["county"] + response["state"]);
    console.log("risk level " + response["riskLevels"]["overall"]);
  });
});

//data for all states
$.ajax({
  url: requestStateUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
  //targeting specific place - placeholder, to be replaced with user selected state
  //console.log(response[49]["state"]);
  let statename = response[49]["state"];

  //data for specific state
  $.ajax({
    url:
      "https://api.covidactnow.org/v2/state/" +
      statename +
      ".json?apiKey=" +
      apikey,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(response["state"]);
    console.log("Risk Level (0=low,1=medium,2=high,3=very high,4=severe): " + response["riskLevels"]["overall"]);
    console.log(
      "Case Density (cases per 100k people)" +
        response["metrics"]["caseDensity"]
    );
    console.log("New Cases " + response["actuals"]["newCases"]);
    console.log(
      "Vaccines Completed (% of total pop) " + response["metrics"]["vaccinationsCompletedRatio"]
    );
    console.log("for more stats/info visit " + response["url"]);
  });
});

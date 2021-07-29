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

  for (let i = 0; i < response.length; i++) {
    let statename = response[i]["state"];
    $.ajax({
      url:
        "https://api.covidactnow.org/v2/state/" +
        statename +
        ".json?apiKey=" +
        apikey,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log(statename);
      console.log(
        "Risk Level (0=low,1=medium,2=high,3=very high,4=severe): " +
          response["riskLevels"]["overall"]
      );
      console.log(
        "Case Density (cases per 100k people)" +
          response["metrics"]["caseDensity"]
      );
      console.log("New Cases " + response["actuals"]["newCases"]);
      console.log(
        "Vaccines Completed (% of total pop) " +
          response["metrics"]["vaccinationsCompletedRatio"]
      );
      console.log("for more stats/info visit " + response["url"]);
    });
  }
});

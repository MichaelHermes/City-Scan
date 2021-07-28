//https://apidocs.covidactnow.org/data-definitions
//Congrats, your new API key is 1848b424826d4a65a0322573e16402b2

//list of all data by category
// https://api.covidactnow.org/v2/states.json?apiKey=1848b424826d4a65a0322573e16402b2
// https://api.covidactnow.org/v2/counties.json?apiKey=1848b424826d4a65a0322573e16402b2
// https://api.covidactnow.org/v2/cbsas.json?apiKey=1848b424826d4a65a0322573e16402b2

//by specific parameter
//state https://api.covidactnow.org/v2/state/{state}.json?apiKey=1848b424826d4a65a0322573e16402b2
//county https://api.covidactnow.org/v2/county/{fips}.json?apiKey=1848b424826d4a65a0322573e16402b2
//metros https://api.covidactnow.org/v2/cbsa/{cbsa_code}.json?apiKey=1848b424826d4a65a0322573e16402b2

requestCountyUrl = "https://api.covidactnow.org/v2/counties.json?apiKey=1848b424826d4a65a0322573e16402b2"

requestMetrosUrl = "https://api.covidactnow.org/v2/cbsas.json?apiKey=1848b424826d4a65a0322573e16402b2"


$.ajax({
    url: requestCountyUrl,
    method: 'GET',
  }).then(function (response) {
    console.log('Ajax Reponse \n-------------');
    console.log(response);
        //targeting specific place
        console.log(response[3049]);
        console.log(response[3049]["county"]);       
        console.log(response[3049]["actuals"]);        
        console.log(response[3049]["riskLevels"]);
  });

  //locationID is city name - 
  //documentation https://apidocs.covidactnow.org/api/#tag/CBSA-Data/paths/~1cbsas.json?apiKey={apiKey}/get
  //and github explanation https://github.com/covidatlas/li/blob/master/docs/reports-v1.md#general-notes
  $.ajax({
    url: requestMetrosUrl,
    method: 'GET',
  }).then(function (response) {
    console.log('Ajax Reponse \n-------------');
    console.log(response);

  });


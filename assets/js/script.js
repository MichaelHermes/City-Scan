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
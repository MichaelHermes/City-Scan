let citySearchURL = "https://api.teleport.org/api/cities/?search=";
let cityName = "Portland";
let stateName = "oregon";

let cityImageEl = $("#City-Image");
let livingRateEl = $("#Living-Rate");
let livingBarEl = $("#Living-Bar");
let housingRateEl = $("#Housing-Rate");
let housingBarEl = $("#Housing-Bar");
let commuteRateEl = $("#Commute-Rate");
let commuteBarEl = $("#Commute-Bar");
let healthcareRateEl = $("#Healthcare-Rate");
let healthcareBarEl = $("#Healthcare-Bar");

function init() {
	let searchCriteria = getSearchCriteria();

	let requestURL = `${citySearchURL}${cityName}`;
	console.log(requestURL);
	//console.log(`${citySearchURL}${searchCriteria["City-Name"]}`);

	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done((data, textStatus, jqXHR) => {
			// Handle the search results on "Success".
			let citySearchResults = data._embedded["city:search-results"];

			// console.log("CitySearch: Success");
			console.log(data);
			// console.log("city:search-results::");
			console.log(citySearchResults);

			let USOnly = citySearchResults.filter(city => {
				//return city.matching_full_name.includes("United States"); // TESTING ONLY
				return city.matching_full_name.endsWith("United States");
			});
			// console.log("US-Only search results::");
			// console.log(USOnly);

			if (USOnly.length == 0) {
				console.error("No matching US city found in search results.");
			} else if (USOnly.length == 1) {
				// If we found just one matching US city, us it.
				cityDetails(USOnly[0]._links["city:item"].href);
			} else {
				// We found more than one matching US city. We need to filter by state.
				let citiesInTargetState = USOnly.filter(city => {
					let fullNameParts = city.matching_full_name.split(",");
					//console.log(fullNameParts);

					// [0] = City, [1] = State, [2] = Country
					if (
						fullNameParts[1].trim().toLowerCase() === stateName.toLowerCase()
					) {
						return city;
					}
					return false;
				});
				console.log(citiesInTargetState);

				// In the rare case (if even possible...) that multiple matching cities in the target state were returned, just use the first one.
				cityDetails(citiesInTargetState[0]._links["city:item"].href);
			}
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("CitySearch", data, textStatus, errorThrown);
		});
}

function getSearchCriteria() {
	return JSON.parse(localStorage.getItem("City Search Criteria"));
}

function cityDetails(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			// console.log("CityDetails: Success");
			// console.log(data);
			urbanAreaDetails(data._links["city:urban_area"].href);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("CityDetails", data, textStatus, errorThrown);
		});
}

/* Scores, Images */
function urbanAreaDetails(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			// console.log("UrbanAreasDetails: Success");
			// console.log(data);
			urbanAreasScores(data._links["ua:scores"].href);
			urbanAreasImages(data._links["ua:images"].href);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("UrbanAreasDetails", data, textStatus, errorThrown);
		});
}

/* Healthcare, Cost of Living, Commute, Housing */
function urbanAreasScores(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			// console.log("UrbanAreasScores: Success");
			// console.log(data);

			let desiredScores = data.categories.filter(category => {
				return (
					category.name === "Healthcare" ||
					category.name === "Cost of Living" ||
					category.name === "Commute" ||
					category.name === "Housing"
				);
			});
			console.log(desiredScores);

			desiredScores.forEach(score => {
				switch (score.name) {
					case "Cost of Living":
						livingRateEl.text(Math.round(score.score_out_of_10));
						livingBarEl.attr("value", score.score_out_of_10);
						break;
					case "Housing":
						housingRateEl.text(Math.round(score.score_out_of_10));
						housingBarEl.attr("value", score.score_out_of_10);
						break;
					case "Commute":
						commuteRateEl.text(Math.round(score.score_out_of_10));
						commuteBarEl.attr("value", score.score_out_of_10);
						break;
					case "Healthcare":
						healthcareRateEl.text(Math.round(score.score_out_of_10));
						healthcareBarEl.attr("value", score.score_out_of_10);
						break;
				}
			});
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("UrbanAreasScores", data, textStatus, errorThrown);
		});
}

function urbanAreasImages(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			// console.log("UrbanAreasImages: Success");
			// console.log(data);
			// console.log("Web Image::");
			// console.log(data.photos[0].image.web);
			// console.log("Mobile Image::");
			// console.log(data.photos[0].image.mobile);

			cityImageEl.attr("src", data.photos[0].image.web);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("UrbanAreasImages", data, textStatus, errorThrown);
		});
}

function ajaxFailure(functionName, data, textStatus, errorThrown) {
	console.log(`${functionName}: Error`);
	console.log(data);
	console.log(`TextStatus: ${textStatus}, ErrorThrown: ${errorThrown}`);
}

init();

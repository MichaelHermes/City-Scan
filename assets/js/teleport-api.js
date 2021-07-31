// UI Elements
let cityImageEl = $("#City-Image");
let livingRateEl = $("#Living-Rate");
let livingBarEl = $("#Living-Bar");
let housingRateEl = $("#Housing-Rate");
let housingBarEl = $("#Housing-Bar");
let commuteRateEl = $("#Commute-Rate");
let commuteBarEl = $("#Commute-Bar");
let healthcareRateEl = $("#Healthcare-Rate");
let healthcareBarEl = $("#Healthcare-Bar");

let citySearchURL = "https://api.teleport.org/api/cities/?search=";

// Initialize the Teleport API data on page load, using search criteria from localStorage. Begin by making a "city search" query.
function init() {
	let searchCriteria = getSearchCriteriaFromLocalStorage();
	let requestURL = `${citySearchURL}${searchCriteria["City-Name"]}`;
	console.log(requestURL);
	console.log(`State: ${searchCriteria["State-Name"]}`);

	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done((data, textStatus, jqXHR) => {
			// Handle the search results on "Success". Start by filtering to US-only results.
			let USOnly = data._embedded["city:search-results"].filter(city => {
				return city.matching_full_name.endsWith("United States");
			});
			if (USOnly.length == 0) {
				console.error("Unable to locate a matching US city.");
				// TODO: Display the alert.
			} else if (USOnly.length == 1) {
				// If we found just one matching US city, us it.
				cityDetails(USOnly[0]._links["city:item"].href);
			} else {
				// We found more than one matching US city. We need to filter by state.
				let citiesInTargetState = USOnly.filter(city => {
					let fullNameParts = city.matching_full_name.split(",");
					let stateName = searchCriteria["State-Name"].replace("_", " ");
					// [0] = City, [1] = State, [2] = Country
					if (
						fullNameParts[1].trim().toLowerCase() === stateName.toLowerCase()
					) {
						return city;
					}
					return false;
				});

				if (citiesInTargetState.length > 0) {
					// In the rare case (if even possible...) that multiple matching cities in the target state were returned, just use the first one.
					cityDetails(citiesInTargetState[0]._links["city:item"].href);
				} else {
					console.error(
						"Unable to locate the target city in the target state."
					);
					// TODO: Display the alert.
				}
			}
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("CitySearch", data, textStatus, errorThrown);
		});
}

// Query localStorage for the search criteria supplied by the user on the index.html page.
function getSearchCriteriaFromLocalStorage() {
	return JSON.parse(localStorage.getItem("City Search Criteria"));
}

// Obtain city details from the target requestURL.
function cityDetails(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			urbanAreaDetails(data._links["city:urban_area"].href);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("CityDetails", data, textStatus, errorThrown);
		});
}

// Obtain urban area information from the target requestURL.
/* Desired data points: Scores, Images */
function urbanAreaDetails(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			urbanAreasScores(data._links["ua:scores"].href);
			urbanAreasImages(data._links["ua:images"].href);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("UrbanAreasDetails", data, textStatus, errorThrown);
		});
}

// Obtain urban area scores from the target requestURL. Populate these scores into the appropriate UI elements for display.
/* Desired scores: Healthcare, Cost of Living, Commute, Housing */
function urbanAreasScores(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			let desiredScores = data.categories.filter(category => {
				return (
					category.name === "Healthcare" ||
					category.name === "Cost of Living" ||
					category.name === "Commute" ||
					category.name === "Housing"
				);
			});

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

// Obtain the city images from the target requestURL. Populate this image into the appropriate UI element for display.
function urbanAreasImages(requestURL) {
	//console.log(requestURL);
	$.ajax({
		url: requestURL,
		method: "GET",
	})
		.done(data => {
			cityImageEl.attr("src", data.photos[0].image.web);
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("UrbanAreasImages", data, textStatus, errorThrown);
		});
}

// Log details about any AJAX failure that has occurred.
function ajaxFailure(functionName, data, textStatus, errorThrown) {
	console.log(`${functionName}: Error`);
	console.log(data);
	console.log(`TextStatus: ${textStatus}, ErrorThrown: ${errorThrown}`);
}

init();

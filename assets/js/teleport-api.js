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
let alertEl = $("#alert");
let cityNameEl = $("#City-Name");

let citySearchURL = "https://api.teleport.org/api/cities/?search=";

// Initialize the Teleport API data on page load, using search criteria from localStorage.
function init() {
	let searchCriteria = getSearchCriteriaFromLocalStorage();
	citySearch(searchCriteria["City-Name"], searchCriteria["State-Name"]);
}

// Query localStorage for the search criteria supplied by the user on the index.html page.
function getSearchCriteriaFromLocalStorage() {
	return JSON.parse(localStorage.getItem("City Search Criteria"));
}

// Obtain city search results from the target requestURL.
function citySearch(city, state) {
	let requestURL = `${citySearchURL}${city}`;
	let toggleAlert = (display, message) => {
		if (display) {
			alertEl.find("#alert-message").text(message);
			alertEl.removeClass("hide");
		} else {
			alertEl.removeAttr("style").addClass("hide");
		}
	};

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
				console.error(`Unable to locate a matching US city. (${city})`);
				toggleAlert(true, "Please enter a US city.");
			} else {
				// We found one or more matching US cities. We need to filter by state.
				let citiesInTargetState = USOnly.filter(city => {
					let fullNameParts = city.matching_full_name.split(",");

					// [0] = City, [1] = State, [2] = Country
					if (
						fullNameParts[1].trim().toLowerCase() ===
						state.replace("_", " ").toLowerCase()
					) {
						return city;
					}
					return false;
				});

				if (citiesInTargetState.length > 0) {
					cityNameEl.text(city);
					toggleAlert(false);
					cityDetails(citiesInTargetState[0]._links["city:item"].href);
				} else {
					console.error(
						`Unable to locate the target city in the target state. (${city}, ${state})`
					);
					toggleAlert(
						true,
						"Please ensure your city exists in the selected state."
					);
				}
			}
		})
		.fail((data, textStatus, errorThrown) => {
			ajaxFailure("CitySearch", data, textStatus, errorThrown);
		});
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
						livingRateEl.text(`${Math.round(score.score_out_of_10)}/10`);
						livingBarEl.attr("value", score.score_out_of_10);
						break;
					case "Housing":
						housingRateEl.text(`${Math.round(score.score_out_of_10)}/10`);
						housingBarEl.attr("value", score.score_out_of_10);
						break;
					case "Commute":
						commuteRateEl.text(`${Math.round(score.score_out_of_10)}/10`);
						commuteBarEl.attr("value", score.score_out_of_10);
						break;
					case "Healthcare":
						healthcareRateEl.text(`${Math.round(score.score_out_of_10)}/10`);
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

$("#search").on("submit", function (event) {
	event.preventDefault();

	citySearch($("#search-input").val(), $("#state-list").val());
});

init();

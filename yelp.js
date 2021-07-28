//YELP info ---
//Client ID
// aubh5OaIg5k2HVwTA5Cuwg

// API Key

// e2BwMzqg1HEbMbW-regclv9WYJ5419WanbkfH9dU5vbW03BjfF4ETOV8dEW1Ni21tBJc7k8XEJK6BQgl38xzLOknLazPc9O8sWjWhLMC2nMfPWdXkckPpALCO3f8YHYx
//

const apiKey ="e2BwMzqg1HEbMbW-regclv9WYJ5419WanbkfH9dU5vbW03BjfF4ETOV8dEW1Ni21tBJc7k8XEJK6BQgl38xzLOknLazPc9O8sWjWhLMC2nMfPWdXkckPpALCO3f8YHYx"
requestBizUrl = "https://api.yelp.com/v3/businesses/search?location=seattle&term=resturants&sort_by=rating&limit=5&"

// .addEventListener('click', (btn) => {
//     const city = document.getElementById('city').value;
// })

function api(){
$.ajax({
    url: requestBizUrl,
    method: 'GET',
    headers: {"Authorization": "Bearer " + apiKey, "Access-Control-Allow-Origin": "*"}
   
  })
  .then(function (response) {
    console.log('Ajax Reponse \n-------------');
    console.log(response);
        
  });
}
api();


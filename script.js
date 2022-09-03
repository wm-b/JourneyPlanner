// moves the current view off-screen to left and then brings the specified view on-screen from right
function nextView(viewNum) {
	document.getElementById("view" + viewNum).setAttribute("class", "leftOut");
	document.getElementById("view" + (viewNum + 1)).setAttribute("class", "rightIn");
	
    setTimeout(function(){
        document.getElementById("view" + viewNum).style.display = "none"
    }, 500);
	
    setTimeout(function(){
        document.getElementById("view" + (viewNum + 1)).style.display = "block"
    }, 500);
}

// moves the current view off-screen to right and then brings the specified view on-screen from left
function prevView(viewNum) {
	document.getElementById("view" + viewNum).setAttribute("class", "rightOut");
	document.getElementById("view" + (viewNum - 1)).setAttribute("class", "leftIn");

	setTimeout(function(){
        document.getElementById("view" + viewNum).style.display = "none"
    }, 500);

	setTimeout(function(){
        document.getElementById("view" + (viewNum - 1)).style.display = "block"
    }, 500);
}

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// moves the current view off-screen to right flashes the other views past before returning to view 1
async function reset() {
	document.getElementById("view4").setAttribute("class", "rightOut");
	await sleep(150);
	document.getElementById("view4").style.display = "none";
	
	for (i = 5; i > 1; i--) {
        document.getElementById("view" + i).style.display = "block";
        document.getElementById("view" + i).setAttribute("class", "reset");
        
        setTimeout(function(){
            document.getElementById("view" + i).style.display = "none"
        }, 200);
        
        await sleep(200);
	}
	
	document.getElementById("view1").setAttribute("class", "leftIn");
	document.getElementById("view1").style.display = "block";
}

// checks that the passed value is a valid UK postcode
function validatePostcode(input) {
    input = input.replace(/\s/g, "");
    var regex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    return regex.test(input);
}

// checks that all inputs on view 2 are valid
function validateInputs() {
    var error = "none";

    var postcode3 = document.getElementById('postcode3').value;
    if (postcode3 != "") {
        if(!validatePostcode(postcode3)) {
            error = "Postcode 3 is not a valid UK Postcode!"
        }
    }

    if(!validatePostcode(document.getElementById('postcode2').value)) {
        error = "Postcode 2 is not a valid UK Postcode!"
    }

    if(!validatePostcode(document.getElementById('postcode1').value)) {
        error = "Postcode 1 is not a valid UK Postcode!"
    }
    return error;
}

function buildURL() {
    var postcode1 = document.getElementById('postcode1').value;
    var postcode2 = document.getElementById('postcode2').value;
    var postcode3 = document.getElementById('postcode3').value;

    postcode1.replace(" ", "%20");
    postcode2.replace(" ", "%20");

    var url = "https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=";

    url += postcode1;
    url += ",";
    url += postcode2;

    if (document.getElementById('postcode3').value != "") {
        postcode3.replace(" ", "%20");
        url += ",";
        url += postcode3;
    }

    url += "&Format=Miles&TravelMode";

    url += document.getElementById('travelMode').value;

    url += "&TrafficModel=best_guess"

    return url;
}

// calls the API and handles any errors
function callAPI() {
    $.ajax({
        url: buildURL(),
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            displayData(data);
        },
        error: function (errorThrown) {
            document.getElementById("error").innerText = errorThrown;
        }
    });
}

// modifies the fields on the results view and changes the current view to the results view 
function displayData(data) {

    document.getElementById("displayPostcode1").innerText = document.getElementById('postcode1').value;
    document.getElementById("displayPostcode2").innerText = document.getElementById('postcode2').value;
    document.getElementById("displayPostcode3").innerText = document.getElementById('postcode2').value;
    document.getElementById("displayPostcode4").innerText = document.getElementById('postcode3').value;

    var dataString = String(data);
    var dataArray = dataString.split(";")[0].split(",");

    document.getElementById("minutesData1").innerText = dataArray[0];
    document.getElementById("milesData1").innerText = dataArray[1];

    if (data.substring(0, data.length - 2).includes(";")) {
        var dataArray = dataString.split(";")[1].split(",");
        document.getElementById("minutesData2").innerText = dataArray[0];
        document.getElementById("milesData2").innerText = dataArray[1];
    } else {
        document.getElementById("journey2").style.display = "none";
    }
    nextView(2);
}

// executes validation method, displays any errors, and calls the API if data is valid
function submit() {
    var error = validateInputs();

    if (!(error == "none")){
        document.getElementById("error").innerText = error;
        document.getElementById("submit").setAttribute("class", "submitError");
        
        setTimeout(function(){
            document.getElementById("submit").setAttribute("class", "submit");
        }, 400);
    } else {
        callAPI();
    }
}
//document ready jquery wrapper (page will render when ready)
$(document).ready(function(){ 
//event listener
$(".save-button").on("click", function(){ 
    //Setting up variables for the key/value pair with the entry time and the schedule entry.
    var entryTime = $(this).parent().attr("id");
    var userEntry = $(this).siblings(".block-entry").val();

    //Save entries to local storage
    localStorage.setItem(entryTime, userEntry);
    });

    //append current date to top of page using moment.js
    var currentDate = moment().format("dddd MMMM Do YYYY");
    $("#currentDay").text(currentDate);


});
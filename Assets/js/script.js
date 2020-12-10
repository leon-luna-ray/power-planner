//document ready jQuery wrapper (page will render when ready)
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
        var currentDay = moment().format("dddd MMMM Do YYYY");
        $("#currentDay").text(currentDay)

        // Current hour for changing the color
        var currentHour = moment().format("HH")
        
// Need a function that will change the color based on the current time. Figure out how to use "this" again to change the sibling

        // function changeColor(){
        //     if(currentHour > $(".9").attr(id).val)
        //     $("#future").attr("id", "#past");
        // }

// changeColor();


}); //jQuery wrapper
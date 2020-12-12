//document ready jQuery wrapper (page will render when ready)
$(document).ready(function(){ 
//event listener
    $(".save-button").on("click", function(){ 

        //Setting up variables for the key/value pair with the entry time and the schedule entry.
        var entryTime = $(this).parent().attr("id");
        var userEntry = $(this).siblings(".block-entry").val();


        //Save entries to local storage
        localStorage.setItem(entryTime, userEntry);

        // Created variable to get entry from local storage but I wasn't able to figure out how to get it to stick.

        var storedItem = localStorage.getItem(entryTime);

        });

        //append current date to top of page using moment.js
        var currentDay = moment().format("dddd MMMM Do YYYY");
        $("#currentDay").text(currentDay)

        // Function to change each block on the hour
        $(".block-entry").each(function (){
                var blockTime = $(this).attr("id");
                // Converted time to 24h format
                var currentTime = moment().format("HH")
                // Parsed the current time and and each block time
                var blockHour = parseInt(blockTime)
                var currentHour = parseInt(currentTime)
                // Else/if to change the ID for color based on time
                if(blockHour === currentHour) {
                        $(this).attr("id", "present")
                } else if (blockHour < currentHour) {
                        $(this).attr("id", "past")
                } else if (blockHour > currentHour) {
                        $(this).attr("id", "future")
                }
        });

}); //jQuery wrapper
var tvShows = ["Brooklyn Nine-Nine", "Unbreakable Kimmy Schmidt", "The Office", "Parks and Recreation",
          "The Big Bang Theory", "Friends", "NCIS", "Stranger Things", "Modern Family"];

var lastShowClicked;
var offset = 0;

$(document).ready(function(){

    function displayGifs() {

        var tvShow = $(this).attr("data-name");

        if (lastShowClicked !== tvShow){
            $("#gif-container").empty();
        } else {
            offset += 10;
        }

        lastShowClicked = tvShow;
        
        var reg = new RegExp(" ", "g");
        tvShow = tvShow.replace(reg, "+");
        console.log(tvShow);

        //Overloads the API trying to get 10 random gifs rapidly
        // var queryURL = "https://api.giphy.com/v1/gifs/random?tag=" + tvShow + 
        //                "&limit=10&apikey=tLZt6zH1ErHMmr32qJYz5So29FYJuwGe";

        // for (var i = 0; i < 10; i++) {

        //     $.ajax({
        //         url: queryURL,
        //         method: "GET"
        //     }).then(function(response){

        //         var gif = response.data

        //         console.log(gif);

        //         $("#gif-container").prepend(
        //             $("<div class='col-12 col-md-6 col-lg-4'>").append(
        //                 $("<img class='gif img-fluid'>").attr({
        //                     "src": gif.images.fixed_height_still.url,
        //                     "data-still": gif.images.fixed_height_still.url,
        //                     "data-animate": gif.images.fixed_height.url,
        //                     "data-state": "still"
        //                 })
        //             )
        //         );

        //     });

        // }

        //This is using their search results not random and I have to use an offset to
        // not get the same 10 gifs
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + tvShow + 
                       "&limit=10&offset=" + offset + "&apikey=tLZt6zH1ErHMmr32qJYz5So29FYJuwGe";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){

            var gifs = response.data;


            for (var i = 0; i < gifs.length; i++){

                console.log(gifs[i].images);

                $("#gif-container").prepend(
                    $("<div class='col-12 col-md-6 col-lg-4'>").append(
                        $("<img class='gif img-fluid'>").attr({
                            "src": gifs[i].images.fixed_height_still.url,
                            "data-still": gifs[i].images.fixed_height_still.url,
                            "data-animate": gifs[i].images.fixed_height.url,
                            "data-state": "still"
                        })
                    ).append(
                        $("<p>").text(
                            "Rating: " + gifs[i].rating
                        )
                    )
                );

            }

        });
    }

    $("#add-tvShow").on("click", function(event){
        event.preventDefault();

        var tvShow = $("#tvShow-input").val().trim();

        addButton(tvShow);
    });

    // Dynamically create buttons in the initial array
    function initializeButtons() {

        for (var i = 0; i < tvShows.length; i++) {
            $("#button-container").append(
                $("<button>").addClass(
                    "tvShow-btn btn btn-primary col"
                ).attr({
                    "data-name": tvShows[i]
                }).text(
                    tvShows[i]
                )
            );
        }

    }

    // Adds the one button that the user requests
    function addButton(tvShow) {

        tvShows.push(tvShow);

        $("#button-container").append(
            $("<button>").addClass(
                "tvShow-btn btn btn-primary"
            ).attr({
                "data-name": tvShow
            }).text(
                tvShow
            )
        );
    }

    $("#button-container").on("click", ".tvShow-btn", displayGifs);

    $("#gif-container").on("click", ".gif", function(){

        var state = $(this).attr("data-state");

        if (state === 'still') {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
          } else if (state === "animate") {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
          }
    });

    initializeButtons();

});
var human_colour = "white";
var machine_colour = "black";

function Rules () {
    
    var actual_colour = "white";
    
    var numeric_colours = {
        white: 1,
        black: -1
    };
    
    var expected_answer_counter = 1;
    
    var RETARDITION = 12001;
    
    /*  */
    
    function get_jump_targets (sources, colour) {
        var targets = [];
        var has_piece;
        for ( var i = 0; i < places.length; i++ ) {
            has_piece = places[i].has_piece;
            if ( !has_piece )
                targets.push(places[i]);
            else {
                if ( sources && (!colour || colour == has_piece) )
                    sources.push(places[i]);
            }
                
        }
        return targets;
    }
    function get_slides () {
        var slides = [];
        var tmp, j;
        for ( var i = 0; i < places.length; i++ ) {
            if ( places[i].has_piece == human_colour ) {
                tmp = [];
                for ( j = 0; j < Library.neighbours[i].length; j++ ) {
                    if ( !places[Library.neighbours[i][j]].has_piece )
                        tmp.push( places[Library.neighbours[i][j]] );
                }
                if ( tmp.length )
                    slides.push([places[i], tmp]);
            }
        }
        return slides;
    }

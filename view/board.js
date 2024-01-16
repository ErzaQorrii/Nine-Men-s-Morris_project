function generate_pieces (colour) {
    
    var pieces = [];
    
    for ( var i = 0; i < 9; i++ )
        pieces[i] = new Piece(colour);
    
    return pieces;
}
function generate_places () {
   
    var places = [];

    var parent_element = document.getElementById("base");
    var element, v, h, r;
    
    var s = [1, 1, 1, 4, 7, 7, 7, 4];


    for ( var i = 0; i < 24; i++ ) {
       
        element = document.createElement("div");
        
        r = parseInt(i / 8);
     
        v = s[i % 8];
      
        h = s[(i + 2) % 8];
        if ( r ) {

            if ( v != 4 )
                v = (v < 4) ? (v + r) : (v - r);
            if ( h != 4 )
                h = (h < 4) ? (h + r) : (h - r);
        }
        
        element.className = "place v" + v + " h" + h;
        
        places[i] = new Place(element, i);
        parent_element.appendChild(element);
    }
    
    return places;
}


var indicate_thinking = (function () {
    var indicator = document.getElementsByClassName("inner")[0];
    var colours = ["white", "black", "white_wins", "black_wins"];
    var assigned_colours = [];
    return function (colour) {
        var i, c;
        for ( i = (assigned_colours.length - 1); i >= 0; i-- ) {
            if ( assigned_colours[i] == colour )
                return;
            c = assigned_colours.pop();
            indicator.classList.remove(c);
        }
        for ( i = 0; i < colours.length; i++ ) {
            if ( colours[i] == colour ) {
                assigned_colours.push(colour);
                indicator.classList.add(colour);
                break;
            }
        }
    };
})();

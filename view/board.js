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

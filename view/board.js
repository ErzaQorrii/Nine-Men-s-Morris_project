function generate_pieces (colour) {
    
    var pieces = [];
    
    for ( var i = 0; i < 9; i++ )
        pieces[i] = new Piece(colour);
    
    return pieces;
}

function test_move_piece (own_board, opponent_board) {

    var joined_board = own_board | opponent_board;
    var new_board, neighbours, j;

    for ( var i = 0; i < 24; i++ ) {
        if ( !(own_board & (1 << i)) )
            continue;
        neighbours = Library.neighbours[i];
        for ( j = 0; j < neighbours.length; j++ ) {
            if ( joined_board & (1 << neighbours[j]) )
                continue;
            new_board = own_board;
            new_board ^= 1 << i;
            new_board |= 1 << neighbours[j];
            if ( builds_mill(new_board, neighbours[j]) )
                return true;
        }
    }
    
    return false;
}

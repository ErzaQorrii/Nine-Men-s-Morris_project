function test_jump_piece (own_board, opponent_board) {

    var joined_board = own_board | opponent_board;
    var new_board, i, j, jj;

    var builds_almost_mill;
    var mill_candidates = [];
    for ( i = 0; i < 24; i++ ) {
        if ( joined_board & (1 << i) )
            continue;
        builds_almost_mill = almost_builds_mill(opponent_board, joined_board, i);
        if ( builds_almost_mill[0] == 2 || builds_almost_mill[1] == 2 )
            mill_candidates.push(i);
    }

    if ( !mill_candidates.length )
        return false;

    for ( i = 0; i < 24; i++ ) {
        if ( !(own_board & (1 << i)) )
            continue;
        for ( jj = 0; jj < mill_candidates.length; jj++ ) {
            j = mill_candidates[jj];
            new_board = own_board;
            new_board ^= 1 << i;
            new_board |= 1 << j;
            if ( builds_mill(new_board, j) )
                return true;
        }
    }
    
    return false;
}
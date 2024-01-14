
function test_jump_piece (own_board, opponent_board) {
    // Combine the player's and the opponent's boards
    var joined_board = own_board | opponent_board;
    var new_board, i, j, jj;

    // Variable for checking if a move almost forms a mill
    var builds_almost_mill;
    var mill_candidates = [];
    // Check every position on the board
    for ( i = 0; i < 24; i++ ) {
        // Skip if the position is already occupied
        if ( joined_board & (1 << i) )
            continue;
        // Check if the current move can almost form a mill
        builds_almost_mill = almost_builds_mill(opponent_board, joined_board, i);
        // If it can, add it to mill candidates
        if ( builds_almost_mill[0] == 2 || builds_almost_mill[1] == 2 )
            mill_candidates.push(i);
    }

    // Return false if there are no candidates for forming a mill
    if ( !mill_candidates.length )
        return false;

    // Check if the player can move a piece to form a mill
    for ( i = 0; i < 24; i++ ) {
        // Continue if the player doesn't have a piece in this position
        if ( !(own_board & (1 << i)) )
            continue;
        // Iterate through mill candidates
        for ( jj = 0; jj < mill_candidates.length; jj++ ) {
            j = mill_candidates[jj];
            // Simulate the move
            new_board = own_board;
            new_board ^= 1 << i; // Remove piece from current position
            new_board |= 1 << j; // Add piece to new position
            // Check if this move forms a mill
            if ( builds_mill(new_board, j) )
                return true; // Return true if it forms a mill
        }
    }
    
    // Return false if no mill-forming move is found
    return false;
}

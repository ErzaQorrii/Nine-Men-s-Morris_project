var Mills = Array(24);
var AlmostMills = Array(24);
var tmp, tmp1, tmp2, tmp3, ni, n, na;
for ( i = 0; i < 24; i++ ) {
    Mills[i] = Array(2);
    AlmostMills[i] = Array(6);
    for ( j = 0; j < 2; j++ ) {
        tmp = 0;
        tmp1 = 0;
        tmp2 = 0;
        tmp3 = 0;
        for ( k = 0; k < 3; k++ ) {
            tmp |= 1 << Library.mills[i][j][k];
            if ( k )
                tmp1 |= 1 << Library.mills[i][j][k];
            if ( k != 1 )
                tmp2 |= 1 << Library.mills[i][j][k];
            if ( k != 2 )
                tmp3 |= 1 << Library.mills[i][j][k];
        }
        Mills[i][j] = tmp;
        AlmostMills[i][j * 3] = tmp1;
        AlmostMills[i][j * 3 + 1] = tmp2;
        AlmostMills[i][j * 3 + 2] = tmp3;
    }
}
var Neighbours = {};
var AllNeighbours = {};
for ( i = 0; i < 24; i++ ) {
    ni = 1 << i;
    n = Array(Library.neighbours[i].length);
    na = 0;
    for ( j = 0; j < Library.neighbours[i].length; j++ ) {
        n[j] = 1 << Library.neighbours[i][j];
        na |= n[j];
    }
    Neighbours[ni] = n;
    AllNeighbours[ni] = na;
}


// Function to check if building a mill is possible on the board at a given index.
function builds_mill(board, index) {
    var mill;

    // Loop through all possible mill configurations for the given index.
    for (var i = 0; i < Mills[index].length; i++) {
        mill = Mills[index][i]; // Get the current mill configuration

        // Check if the current mill configuration is present on the board.
        // The bitwise AND operation is used to compare the board state with the mill configuration.
        if ((mill & board) == mill)
            return true; // Return true if the current configuration forms a mill on the board.
    }

    return false; // Return false if no mill configuration is formed at the given index.
}

// Function to check if a player is almost building a mill on the board.
function almost_builds_mill(enemy_board, joined_board, index) {
    // Retrieve possible mill and almost mill configurations for the given index.
    var mills = Mills[index];
    var almost_mills = AlmostMills[index];

    // Initialize the result array to track the status of potential mills.
    var result = [0, 0];

    // Check for the first potential mill configuration.
    if (!(mills[0] & enemy_board) && (mills[0] & joined_board)) {
        // If the enemy hasn't formed the mill but the joined board has the configuration, set result to 1.
        result[0] = 1;

        // Check if the player is almost forming a mill.
        for (var i = 0; i < 3; i++) {
            if ((almost_mills[i] & joined_board) == almost_mills[i]) {
                // If an almost mill is formed, update the result to 2 and exit the loop.
                result[0] = 2;
                break;
            }
        }
    }

    // Repeat the check for the second potential mill configuration.
    if (!(mills[1] & enemy_board) && (mills[1] & joined_board)) {
        result[1] = 1; // Similar logic as above for the second configuration.
        
        // Loop through the next set of almost mill configurations.
        for (var i = 3; i < 6; i++) {
            if ((almost_mills[i] & joined_board) == almost_mills[i]) {
                result[1] = 2; // Update the result if an almost mill is found.
                break;
            }
        }
    }

    // Return the result array indicating the status of potential mills.
    return result;
}

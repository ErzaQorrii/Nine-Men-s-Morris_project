function randomise_indices () {
    var random_index, tmp;
    for ( var i = 0; i < 24; i++ ) {
        random_index = Math.floor(Math.random() * 24);
        if ( i == random_index )
            continue;
        tmp = indices[i];
        indices[i] = indices[random_index];
        indices[random_index] = tmp;
    }
}
randomise_indices();
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

// Function to determine the best move for a piece in a board game.
function move_piece(colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces) {

    var MAX = 6; // Define a constant MAX used for move depth or analysis intensity.

    var result;
    // Call a helper function to evaluate a move, initially with a depth of 2.
    var tmp_result = _move_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, 2);

    // Check the quality of the returned move, comparing it against a threshold (13247).
    if (tmp_result && tmp_result.length > 1 && tmp_result[1] && tmp_result[1].length > 1 && Math.abs(tmp_result[0]) > 13247)
        result = tmp_result;
    else {
        // If aggressive analysis is enabled, try a different strategy with depth 1.
        if (agressive_analyse) {
            tmp_result = _move_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, 1);
            if (tmp_result && tmp_result.length > 1 && tmp_result[1] && tmp_result[1].length > 1)
                push_position_to_front(tmp_result[1][0]); // Prioritize this move.
        }
        // Make a final attempt to determine a move, using the maximum depth or intensity.
        result = _move_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, MAX);
    }

    // Log the quality and details of the chosen move, if available.
    if (result)
        console.log("MOVE quality: " + result[0]);
    if (result && result.length > 1 && result[1] && result[1].length > 1)
        console.log("To move: " + result[1][0] + " --> " + result[1][1]);

    // If no valid move is found, log a message and prepare to give up.
    if (!result || result.length < 2 || !result[1] || result[1].length < 2) {
        console.log("Machine gives up in move_piece");
        var msg = {
            task: "give_up",
            id: callback_id // Use a callback identifier for the message.
        };
    }
    else {
        // If a valid move is found, prepare a message with the move details.
        var msg = {
            task: "move_piece",
            from: result[1][0],
            to: result[1][1],
            id: callback_id
        };
    }

    // Send the message (either a move or give up).
    postMessage(msg);
}

function analyse_respecting_neighbours (white_board, black_board) {

    if ( agressive_analyse )
        return analyse_agressively(white_board, black_board);

    var joined_board = white_board | black_board;
    var result = 0;
    
    var factor, i, j, building_mills, fac;
    
    for ( i = 0; i < 24; i++ ) {
        
        fac = 1 << i;
        
        if ( !(joined_board & fac) )
            continue;
        
        if ( white_board & fac ) {
            result += 576;
            factor = 1;
        }
        else {
            result -= 576;
            factor = -1;
        }

        for ( j = 0; j < Library.neighbours[i].length; j++ ) {
            if ( !(joined_board & (1 << Library.neighbours[i][j])) )
                result += factor * 12;
        }
    }

    return result;
}

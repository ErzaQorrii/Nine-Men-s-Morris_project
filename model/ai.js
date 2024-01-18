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


function convert (board) {
    var white_board = 0;
    var black_board = 0;
    var white_pieces = 0;
    var black_pieces = 0;
    for ( var i = 0; i < 24; i++ ) {
        if ( !board[i] )
            continue;
        if ( board[i] == 1 ) {
            white_board |= 1 << i;
            white_pieces++;
            continue;
        }
        black_board |= 1 << i;
        black_pieces++;
    }
    return {
        white_board: white_board,
        black_board: black_board,
        pieces: {
            white: white_pieces,
            black: black_pieces
        }
    };
}

/*  */

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

var agressive_analyse = null;
function analyse_agressively (white_board, black_board) {

    var reversed_board = ~(white_board | black_board);
    var own_board = (agressive_analyse == "white") ? white_board : black_board;
    var opponent_board = (agressive_analyse == "black") ? white_board : black_board;
    var factor = (agressive_analyse == "black") ? -1 : 1;

    var i, fac, new_neighbours;

    var result = 0;

    var neighbour_board = 0;
    for ( i = 0; i < 24; i++ ) {
        fac = 1 << i;
        if ( own_board & fac ) {
            result += 576 * factor;
            continue;
        }
        if ( !(opponent_board & fac) )
            continue;
        neighbour_board |= AllNeighbours[fac] & reversed_board;
    }

    var remembered = 0;
    while ( neighbour_board != remembered ) {
        new_neighbours = 0;
        remembered = neighbour_board;
        for ( i = 0; i < 24; i++ ) {
            fac = 1 << i;
            if ( !(neighbour_board & fac) )
                continue;
            new_neighbours |= AllNeighbours[fac] & reversed_board;
        }
        neighbour_board |= new_neighbours;
    }

    for ( i = 0; i < 24; i++ ) {
        fac = 1 << i;
        if ( !(neighbour_board & fac) )
            continue;
        result -= factor;
    }

    return result;
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
function analyse (white_board, black_board) {
    
    var joined_board = white_board | black_board;
    var result = 0;
    
    var factor, i, j, building_mills, own_board, opponent_board, fac;
    
    for ( i = 0; i < 24; i++ ) {
        
        fac = 1 << i;
        
        if ( !(joined_board & fac) )
            continue;
        
        if ( white_board & fac ) {
            result += 576;
            factor = 1;
            own_board = white_board;
            opponent_board = black_board;
        }
        else {
            result -= 576;
            factor = -1;
            own_board = black_board;
            opponent_board = white_board;
        }
        
        if ( !(i & 1) )
            result += factor;
        if ( i > 7 && i < 16 )
            result += factor * 2;
        
        if ( builds_mill(own_board, i) )
            result += factor * 24;
        else {
            building_mills = almost_builds_mill(opponent_board, joined_board, i);
            if ( building_mills[0] )
                result += factor * 13 * building_mills[0];
            if ( building_mills[1] )
                result += factor * 13 * building_mills[1];
        }
        
        for ( j = 0; j < Library.neighbours[i].length; j++ ) {
            if ( !(joined_board & (1 << Library.neighbours[i][j])) )
                result += factor * 5;
        }
    }
    
    return result;
}

/*  */
function jump_piece (colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces) {
    
    var MAX = 4;

    var tmp_result = _jump_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, 2);
    if ( tmp_result && tmp_result.length > 1 && tmp_result[1] && tmp_result[1].length > 1 && Math.abs(tmp_result[0]) < 13247 ) {
        push_position_to_front(tmp_result[1][0]);
        push_position_to_front(tmp_result[1][1], 1);
    }


    var result = _jump_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, MAX);

    if ( result )
        console.log( "JUMP quality: " + result[0] );
    if ( result && result.length > 1 && result[1] && result[1].length > 1 )
        console.log( "To jump: " + result[1][0] + " --> " + result[1][1] );

    if ( !result || result.length < 2 || !result[1] || result[1].length < 2 ) {
        console.log( "Machine gives up in jump_piece" );
        var msg = {
            task: "give_up",
            id: callback_id
        };
    }
    else {
        var msg = {
            task: "jump_piece",
            from: result[1][0],
            to: result[1][1],
            id: callback_id
        };
    }

    postMessage(msg);
}


function remove_piece (colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces) {
    
    var MAX = 4;

    var result = _remove_piece(null, colour, white_board, black_board, white_pieces, black_pieces, initial_white_pieces, initial_black_pieces, MAX);

    if ( result )
        console.log( "REMOVE quality: " + result[0] );
    if ( result && result.length > 1 && result[1] && result[1].length > 1 )
        console.log( "Place to remove: " + result[1][1] );

    if ( !result || result.length < 2 || !result[1] || result[1].length < 2 ) {
        console.log( "Machine gives up in remove_piece" );
        var msg = {
            task: "give_up",
            id: callback_id
        };
    }
    else {
        var msg = {
            task: "remove_piece",
            place: result[1][1],
            id: callback_id
        };
    }

    postMessage(msg);
}

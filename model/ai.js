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

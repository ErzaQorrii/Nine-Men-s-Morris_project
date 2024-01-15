function Machine (element) {
    
    function get_offset (src, tgt) {
        var src_coordinates = src.tell_position();
        var tgt_coordinates = tgt.tell_position();
        var left = parseInt(src_coordinates.left - tgt_coordinates.left);
        var top = parseInt(src_coordinates.top - tgt_coordinates.top);
        return [left, top];
    }
    
    function animate (cloned, coordinates) {
        cloned.style.transform = "translate(" + (0 - coordinates[0]) + "px, " + (0 - coordinates[1]) + "px)";
        cloned.addEventListener("transitionend", finish, true);
    }
    
    function finish (ev) {
        ev.target.removeEventListener("transitionend", finish, true);
        ev.target.parentNode.removeChild(ev.target);
        element.style.visibility = "visible";
    }

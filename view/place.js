function Place (element, index) {
    
    var myself = this;
    var piece;
    var click_function;
    
    var area;
    
    
    this.style = element.style;
    this.index = index;
    
    Object.defineProperty(myself, "has_piece", {
        get: function () {
            return piece && piece.colour;
        }
    });
    
    
    this.tell_position = function () {
        return element.getBoundingClientRect();
    };
    this.tell_area = function () {
        return area.getBoundingClientRect();
    };
    
    this.slide_piece = function (src_place, p) {
        if ( piece )
            return;
        piece = p;
        piece.slide(src_place, myself, element);
        element.appendChild(p.element);
    };
    
    this.set_piece = function (p, retarded) {
        if ( piece )
            return;
        if ( retarded == null && p.colour == machine_colour )
            retarded = true;
        piece = p;
        if ( retarded )
            piece.show_slowly("little_slower");
        element.appendChild(p.element);
    };
    this.unset_piece = function () {
        piece = null;
    };
    this.remove_piece = function (immediately) {
        if ( !piece )
            return;
        if ( immediately == null && piece.colour == machine_colour )
            immediately = true;
        if ( immediately )
            element.removeChild(piece.element);
        else
            piece.remove_slowly("little_slower");
        piece = null;
    };

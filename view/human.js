var Human = (function (playground) {

    function Mousedriven () {

        function remove_events (element) {
            playground.removeEventListener("mouseup", element.mouseup, false);
            playground.removeEventListener("mouseleave", element.mouseleave, false);
            playground.removeEventListener("mousemove", element.mousemove, false);

            if ( element.cloned && element.cloned.parentNode ) {
                element.cloned.removeEventListener("mouseup", element.mouseup, false);
                element.cloned.removeEventListener("mousemove", element.mousemove, false);
                element.cloned.parentNode.removeChild(element.cloned);
            }
            element.style.visibility = "visible";
        }

        function mousedown (ev) {
            var element = ev.target;
            var size = element.get_size();
            element.start(ev.pageX, ev.pageY, size);

            element.mousemove = function (ev) {
                element.move(ev.pageX, ev.pageY, size, remove_events);
            };
            playground.addEventListener("mousemove", element.mousemove, false);
            element.cloned.addEventListener("mousemove", element.mousemove, false);

            element.mouseup = function (ev) {
                mouseup(ev, element);
            };
            playground.addEventListener("mouseup", element.mouseup, false);
            element.cloned.addEventListener("mouseup", element.mouseup, false);

            element.mouseleave = function (ev) {
                mouseleave(ev, element);
            };
            playground.addEventListener("mouseleave", element.mouseleave, false);

            element.style.visibility = "hidden";
        }
        function mouseup (ev, element) {
            element.end(ev.pageX, ev.pageY);
            remove_events(element);
        }
        function mouseleave (ev, element) {
            if ( !ev.explicitOriginalTarget || ev.explicitOriginalTarget == element )
                return;
            if ( ev.pageX && ev.pageY )
                element.end(ev.pageX, ev.pageY);
            else
                element.end(-666, -666);
            remove_events(element);
        }

        this.initialise_events = function (element) {
            element.style.cursor = "pointer";
            element.addEventListener("mousedown", mousedown, false);
        };
        this.reset_events = function (element) {
            element.style.cursor = "default";
            element.removeEventListener("mousedown", mousedown, false);
        };

    }
    function Touchdriven () {

        function remove_events (element) {

            playground.removeEventListener("touchcancel", element.touchcancel, false);
            element.removeEventListener("touchmove", element.touchmove, false);

            if ( element.cloned && element.cloned.parentNode ) {
                element.cloned.parentNode.removeChild(element.cloned);
            }
            element.style.visibility = "visible";
        }

        function touchstart (ev) {
            ev.preventDefault();
            var element = ev.touches[0].target;
            var size = element.get_size();
            element.start(ev.touches[0].pageX, ev.touches[0].pageY, size);

            element.touchcancel = function (ev) {
                touchcancel(ev, element);
            };
            playground.addEventListener("touchcancel", element.touchcancel, false);

            element.touchmove = function (ev) {
                var touch = ev.targetTouches[0];
                element.move(touch.pageX, touch.pageY, size, remove_events);
            };
            element.addEventListener("touchmove", element.touchmove, false);

            element.style.visibility = "hidden";
        }
        function touchend (ev) {
            var touches = ev.changedTouches[0];
            var element = ev.changedTouches[0].target;

            element.end(touches.clientX, touches.clientY);
            remove_events(element);
        }
        function touchcancel (ev, element) {
            remove_events(element);
        }


        this.initialise_events = function (element) {
            element.addEventListener("touchstart", touchstart, false);
            element.addEventListener("touchend", touchend, false);
        };
        this.reset_events = function (element) {
            element.removeEventListener("touchstart", touchstart, false);
            element.removeEventListener("touchend", touchend, false);
        };
    }

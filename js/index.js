window.onload = function () {
    Array.prototype.forEach.call(document.getElementsByClassName("item"), function (element) {
        var classList = element.getElementsByClassName("ripple")[0].classList;
        var onDown = false;

        element.addEventListener('pointerdown', function () {
            onDown = true;
            classList.remove("ripple-off");
            classList.add("ripple-on");
        });
        element.addEventListener('pointerup', function () {
            onDown = false;
            classList.remove("ripple-on");
            classList.add("ripple-off");
        });
        element.addEventListener('pointermove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on");
                classList.add("ripple-off");
            }
        });

        element.addEventListener('mousedown', function () {
            onDown = true;
            classList.remove("ripple-off");
            classList.add("ripple-on");
        });
        element.addEventListener('mouseup', function () {
            onDown = false;
            classList.remove("ripple-on");
            classList.add("ripple-off");
        });
        element.addEventListener('mousemove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on");
                classList.add("ripple-off");
            }
        });

        element.addEventListener('touchstart', function () {
            onDown = true;
            classList.remove("ripple-off");
            classList.add("ripple-on");
        });
        element.addEventListener('touchend', function () {
            onDown = false;
            classList.remove("ripple-on");
            classList.add("ripple-off");
        });
        element.addEventListener('touchmove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on");
                classList.add("ripple-off");
            }
        });
    });
};
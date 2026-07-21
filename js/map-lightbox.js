document.addEventListener("DOMContentLoaded", function () {

    const maps = document.querySelectorAll(".cruise-route-map img");

    maps.forEach(function (map) {

        map.style.cursor = "zoom-in";

        map.addEventListener("click", function () {
            window.open(map.src, "_blank");
        });

    });

});

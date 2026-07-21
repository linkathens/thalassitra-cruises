document.addEventListener("DOMContentLoaded", function () {

    const maps = document.querySelectorAll(".cruise-route-map img");

    if (!maps.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "map-lightbox";

    lightbox.innerHTML = `
        <span class="close-map">&times;</span>
        <img src="" alt="Enlarged cruise route map">
    `;

    document.body.appendChild(lightbox);

    const enlargedMap = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".close-map");

    maps.forEach(function (map) {
        map.addEventListener("click", function () {
            enlargedMap.src = map.src;
            enlargedMap.alt = map.alt;
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox || event.target === enlargedMap) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });

});

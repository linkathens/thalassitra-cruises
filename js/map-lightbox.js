document.addEventListener("DOMContentLoaded", function () {

    const maps = document.querySelectorAll(".cruise-route-map img");

    if (!maps.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "map-lightbox";

    lightbox.innerHTML = `
        <button class="map-close" aria-label="Close map">&times;</button>

        <div class="map-viewport">
            <img class="map-zoom-image" src="" alt="">
        </div>

        <div class="map-controls">
            <button class="map-zoom-out" aria-label="Zoom out">−</button>
            <button class="map-reset" aria-label="Reset zoom">100%</button>
            <button class="map-zoom-in" aria-label="Zoom in">+</button>
        </div>
    `;

    document.body.appendChild(lightbox);

    const viewport = lightbox.querySelector(".map-viewport");
    const image = lightbox.querySelector(".map-zoom-image");
    const closeButton = lightbox.querySelector(".map-close");
    const zoomInButton = lightbox.querySelector(".map-zoom-in");
    const zoomOutButton = lightbox.querySelector(".map-zoom-out");
    const resetButton = lightbox.querySelector(".map-reset");

    let scale = 1;
    let positionX = 0;
    let positionY = 0;

    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    let pinchStartDistance = 0;
    let pinchStartScale = 1;

    const minimumScale = 1;
    const maximumScale = 6;

    function updateTransform() {
        image.style.transform =
            `translate(${positionX}px, ${positionY}px) scale(${scale})`;

        resetButton.textContent = `${Math.round(scale * 100)}%`;

        if (scale > 1) {
            image.classList.add("zoomed");
        } else {
            image.classList.remove("zoomed");
        }
    }

    function resetMap() {
        scale = 1;
        positionX = 0;
        positionY = 0;
        updateTransform();
    }

    function zoomMap(amount) {
        const newScale = Math.min(
            maximumScale,
            Math.max(minimumScale, scale + amount)
        );

        scale = newScale;

        if (scale === 1) {
            positionX = 0;
            positionY = 0;
        }

        updateTransform();
    }

    function openMap(map) {
        image.src = map.src;
        image.alt = map.alt || "Cruise route map";

        resetMap();

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMap() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
        resetMap();
    }

    maps.forEach(function (map) {
        map.style.cursor = "zoom-in";

        map.addEventListener("click", function () {
            openMap(map);
        });
    });

    closeButton.addEventListener("click", closeMap);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeMap();
        }
    });

    zoomInButton.addEventListener("click", function () {
        zoomMap(0.5);
    });

    zoomOutButton.addEventListener("click", function () {
        zoomMap(-0.5);
    });

    resetButton.addEventListener("click", resetMap);

    viewport.addEventListener("wheel", function (event) {
        event.preventDefault();

        if (event.deltaY < 0) {
            zoomMap(0.25);
        } else {
            zoomMap(-0.25);
        }
    }, { passive: false });

    image.addEventListener("dblclick", function () {
        if (scale === 1) {
            scale = 2;
        } else {
            resetMap();
            return;
        }

        updateTransform();
    });

    viewport.addEventListener("mousedown", function (event) {
        if (scale <= 1) return;

        dragging = true;
        dragStartX = event.clientX - positionX;
        dragStartY = event.clientY - positionY;

        viewport.classList.add("dragging");
    });

    window.addEventListener("mousemove", function (event) {
        if (!dragging) return;

        positionX = event.clientX - dragStartX;
        positionY = event.clientY - dragStartY;

        updateTransform();
    });

    window.addEventListener("mouseup", function () {
        dragging = false;
        viewport.classList.remove("dragging");
    });

    viewport.addEventListener("touchstart", function (event) {

        if (event.touches.length === 1 && scale > 1) {
            dragging = true;

            dragStartX = event.touches[0].clientX - positionX;
            dragStartY = event.touches[0].clientY - positionY;
        }

        if (event.touches.length === 2) {
            dragging = false;

            pinchStartDistance = getTouchDistance(event.touches);
            pinchStartScale = scale;
        }

    }, { passive: false });

    viewport.addEventListener("touchmove", function (event) {
        event.preventDefault();

        if (event.touches.length === 1 && dragging && scale > 1) {
            positionX = event.touches[0].clientX - dragStartX;
            positionY = event.touches[0].clientY - dragStartY;

            updateTransform();
        }

        if (event.touches.length === 2) {
            const currentDistance = getTouchDistance(event.touches);

            scale = pinchStartScale *
                (currentDistance / pinchStartDistance);

            scale = Math.min(
                maximumScale,
                Math.max(minimumScale, scale)
            );

            if (scale === 1) {
                positionX = 0;
                positionY = 0;
            }

            updateTransform();
        }

    }, { passive: false });

    viewport.addEventListener("touchend", function () {
        dragging = false;
        pinchStartDistance = 0;
    });

    function getTouchDistance(touches) {
        const x = touches[0].clientX - touches[1].clientX;
        const y = touches[0].clientY - touches[1].clientY;

        return Math.sqrt((x * x) + (y * y));
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMap();
        }

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "+") {
            zoomMap(0.5);
        }

        if (event.key === "-") {
            zoomMap(-0.5);
        }
    });

});

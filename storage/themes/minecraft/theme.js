import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

let scene = null;
let camera = null;
let renderer = null;
let skybox = null;
let animationId = null;
let resizeHandler = null;
let yaw = Number(localStorage.getItem("minecraftYaw")) || 0;
let lastSave = 0;

function disposeMinecraftTheme() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = null;
    }

    if (skybox) {
        if (Array.isArray(skybox.material)) {
            skybox.material.forEach(function (material) {
                if (material.map) {
                    material.map.dispose();
                }

                material.dispose();
            });
        }

        if (skybox.geometry) {
            skybox.geometry.dispose();
        }

        skybox = null;
    }

    if (renderer) {
        renderer.dispose();

        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }

        renderer = null;
    }

    scene = null;
    camera = null;

    const layer = document.getElementById("minecraft-theme-layer");

    if (layer) {
        layer.remove();
    }

    document.documentElement.classList.remove("minecraft-theme");
    document.body.classList.remove("minecraft-theme");
}

function startMinecraftTheme() {
    disposeMinecraftTheme();

    document.documentElement.classList.add("minecraft-theme");
    document.body.classList.add("minecraft-theme");

    const layer = document.createElement("div");
    layer.id = "minecraft-theme-layer";
    document.body.prepend(layer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    layer.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();

    function imagePath(file) {
        return new URL(file, import.meta.url).href;
    }

    function face(file) {
        const texture = loader.load(imagePath(file));
        texture.colorSpace = THREE.SRGBColorSpace;

        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
    }

    const materials = [
        face("panorama_1.png"),
        face("panorama_3.png"),
        face("panorama_4.png"),
        face("panorama_5.png"),
        face("panorama_0.png"),
        face("panorama_2.png")
    ];

    skybox = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        materials
    );

    scene.add(skybox);

    camera.rotation.order = "YXZ";

    function animate(time) {
        animationId = requestAnimationFrame(animate);

        yaw += 0.00035;

        const pitch = Math.sin(time * 0.0002) * 0.02;

        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

        renderer.render(scene, camera);

        if (time - lastSave > 750) {
            lastSave = time;
            localStorage.setItem("minecraftYaw", String(yaw));
        }
    }

    animationId = requestAnimationFrame(animate);

    resizeHandler = function () {
        if (!camera || !renderer) {
            return;
        }

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeHandler);
}

function applyNexusTheme() {
    const selectedTheme = localStorage.getItem("nexusTheme") || "default";

    if (selectedTheme === "minecraft") {
        startMinecraftTheme();
    } else {
        disposeMinecraftTheme();
    }
}

window.applyNexusTheme = applyNexusTheme;

window.addEventListener("storage", function (event) {
    if (event.key === "nexusTheme") {
        applyNexusTheme();
    }
});

window.addEventListener("message", function (event) {
    if (!event.data || event.data.type !== "nexus-theme-change") {
        return;
    }

    localStorage.setItem("nexusTheme", event.data.theme);
    applyNexusTheme();
});

window.addEventListener("pagehide", function () {
    localStorage.setItem("minecraftYaw", String(yaw));
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyNexusTheme);
} else {
    applyNexusTheme();
}
const phrases = [
    `the one guy that still uses quickadd`,
    `btw i know what you searched yesterday`,
    `i know the time is currently {time}`,
    `i wonder if someone has ever been on {hostname} at {time} and there battery was at {battery}`,
    `6'2 curly hair, why don't any of the girls like me?`,
    `uʍop ǝpᴉsdn ɯᴉ ʻɥɐǝʎ`,
    `quick alt tab`,
    `nexus`,
    `your battery is at {battery}`,
    `yo`,
    `nexus vpn » nord vpn (vpn coming soon!)`,
    `blocked, but never forgotten`,
    `{ip}`,
    `77.1% html, 22.4% javascript`,
    `follow my tiktok: nexus.website`,
    `coded in html`,
    `who actually still does quickadd`,
    `north london forever`,
    `for those who don't know this is actually my 4th redesign`,
    `cache error: sdk not initialised yet!!!`,
    `nexus 1 – iframe 0`,
    `support me: ko-fi.com/nexus2`,
    `my homework ate my dog`,
    `btw im making a vpn for iphone & android`,
    `click {here} for patch notes + updates`,
];

const paragraph = document.getElementById('randomText');

let userIP = null;
let flipped = false;
let currentPhrase = null;

function setFlip(state) {
    flipped = state;
    const rotation = flipped ? "180deg" : "0deg";
    ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"]
    .forEach(prefix => {
        document.body.style[prefix] = `rotate(${rotation})`;
    });
}

function resetFlip() {
    if (flipped) setFlip(false);
}

function getRandomPhrase() {
    if (phrases.length === 1) return phrases[0];
    let phrase;
    let attempts = 0;
    do {
        phrase = phrases[Math.floor(Math.random() * phrases.length)];
        attempts++;
        if (attempts > 10) break;
    } while (phrase === currentPhrase);
    return phrase;
}

async function changeText() {
    let randomPhrase = getRandomPhrase();
    currentPhrase = randomPhrase;

    if (typeof randomPhrase === "string") {
        if (randomPhrase.includes("{ip}")) {
            randomPhrase = randomPhrase.replaceAll("{ip}", userIP || "fetch error");
        }

        if (randomPhrase.includes("{hostname}")) {
            randomPhrase = randomPhrase.replaceAll("{hostname}", location.hostname);
        }

        if (randomPhrase.includes("{time}")) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
            randomPhrase = randomPhrase.replace("{time}", timeString);
        }

        if (randomPhrase.includes("{battery}")) {
            try {
                const battery = await navigator.getBattery();
                const batteryPercent = Math.round(battery.level * 100) + "%";
                randomPhrase = randomPhrase.replace("{battery}", batteryPercent);
            }
            catch (e) {
                randomPhrase = randomPhrase.replace("{battery}", ", actually i dont know what it is.");
                console.error("Battery info not available", e);
            }
        }

        if (randomPhrase.includes("{here}")) {
            randomPhrase = randomPhrase.replace(
                "{here}",
                `<a href="/storage/text/changelog.txt" target="_blank" style="color: lightblue; text-decoration: underline; cursor: pointer;">here</a>`
            );
            paragraph.innerHTML = randomPhrase;
        } else {
            paragraph.textContent = randomPhrase;
        }

        if (randomPhrase === "uʍop ǝpᴉsdn ɯᴉ ʻɥɐǝʎ") {
            setFlip(true);
        } else {
            resetFlip();
        }
    }
    else if (randomPhrase.type === "image") {
        paragraph.innerHTML = `<img src="${randomPhrase.src}" alt="Splash Image" style="max-width: ${randomPhrase.width}; height: auto;">`;
        resetFlip();
    }
    else if (randomPhrase.type === "video") {
        paragraph.innerHTML = `<video ${randomPhrase.other || ''} autoplay style="max-width: ${randomPhrase.width}; height: auto;" muted>
            <source src="${randomPhrase.src}" type="video/mp4">
        </video>`;
        resetFlip();
    }
}

window.onload = async () => {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        userIP = data.ip;
        console.log("internet protocol fetched:", userIP);
    }
    catch (e) {
        console.error("Failed to get IP", e);
    }

    await changeText();
};
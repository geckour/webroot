import {Random} from './random.js'

window.onload = function () {
    Array.prototype.forEach.call(document.getElementsByClassName("item"), function (element) {
        const classList = element.getElementsByClassName("ripple")[0].classList
        let onDown = false

        element.addEventListener('pointerdown', function () {
            onDown = true
            classList.remove("ripple-off")
            classList.add("ripple-on")
        })
        element.addEventListener('pointerup', function () {
            onDown = false
            classList.remove("ripple-on")
            classList.add("ripple-off")
        })
        element.addEventListener('pointermove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on")
                classList.add("ripple-off")
            }
        })

        element.addEventListener('mousedown', function () {
            onDown = true
            classList.remove("ripple-off")
            classList.add("ripple-on")
        })
        element.addEventListener('mouseup', function () {
            onDown = false
            classList.remove("ripple-on")
            classList.add("ripple-off")
        })
        element.addEventListener('mousemove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on")
                classList.add("ripple-off")
            }
        })

        element.addEventListener('touchstart', function () {
            onDown = true
            classList.remove("ripple-off")
            classList.add("ripple-on")
        })
        element.addEventListener('touchend', function () {
            onDown = false;
            classList.remove("ripple-on")
            classList.add("ripple-off")
        })
        element.addEventListener('touchmove', function () {
            if (onDown) {
                onDown = false;
                classList.remove("ripple-on")
                classList.add("ripple-off")
            }
        })
    })

    if (storageAvailable('localStorage')) {
        const config = {
            apiKey: "AIzaSyBKlzmlMPIEWhgGyN_hG_Wmqhor13aIJek",
            authDomain: "geckour-web-top.firebaseapp.com",
            databaseURL: "https://geckour-web-top.firebaseio.com",
            projectId: "geckour-web-top",
            storageBucket: "geckour-web-top.appspot.com",
            messagingSenderId: "964850818339",
            appId: "1:964850818339:web:06fcb8cfc7f10314a94096",
            measurementId: "G-50P7DCTYEF"
        }
        firebase.initializeApp(config)
        const database = firebase.database()

        database.ref('background/color').on("value", (snapshot) => {
            const data = snapshot.val()
            changeColors(document, data)
        })

        if (!localStorage.id) localStorage.id = generateUuid()
        if (localStorage.backgroundColor) changeColors(document, localStorage.backgroundColor)
        const today = new Date().toDateString()
        const seed = localStorage.id + today
        const color = getColor(seed.hashCode())

        const changeBgColorElem = document.getElementById("change-bg-color")
        changeBgColorElem.style.backgroundColor = color
        changeBgColorElem.addEventListener('touchstart', function () {
            sendSignal("1")
        })
        changeBgColorElem.addEventListener('pointerdown', function () {
            sendSignal("1")
        })
        changeBgColorElem.addEventListener('touchend', function () {
            sendSignal("0")
        })
        changeBgColorElem.addEventListener('pointerup', function () {
            sendSignal("0")
        })
        changeBgColorElem.onclick = function () {
            changeColors(document, color)
            const radius = Math.sqrt(Math.pow(changeBgColorElem.offsetLeft + 10, 2) + Math.pow(changeBgColorElem.offsetTop + 10, 2))
            const scale = radius / 10
            changeBgColorElem.animate([
                {
                    transform: "scale(1)",
                    borderRadius: "20%"
                },
                {
                    transform: `scale(${scale})`,
                    borderRadius: `${radius}px`
                }
            ], 500)
            database.ref('background').update({
                color: color
            })
        }
    }
}

function sendSignal(command) {
    fetch("http://api.geckour.com:5775/0/light/signal", {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: 'follow',
        body: `command=${command}`
    })
}

function changeColors(document, color) {
    const currentColor = getComputedStyle(document.body).backgroundColor
    if (storageAvailable('localStorage')) {
        localStorage.backgroundColor = color
    }
    document.body.animate([
        {backgroundColor: currentColor},
        {backgroundColor: color}
    ], {
        duration: 500,
        fill: "forwards"
    })

    document.getElementsByClassName("footer-txt")[0].animate([
        {color: currentColor},
        {color: color}
    ], {
        duration: 200,
        fill: "forwards"
    })

    const currentIconTint = getIconTint(currentColor)
    const iconTint = getIconTint(color)

    let currentGithubIcon
    let currentBlogIcon
    let currentTwitterIcon
    let githubIcon
    let blogIcon
    let twitterIcon

    if (currentIconTint > 0) {
        currentGithubIcon = "../img/GitHub-bright.svg"
        currentBlogIcon = "../img/blog-bright.svg"
        currentTwitterIcon = "../img/Twitter-bright.svg"
    } else {
        currentGithubIcon = "../img/GitHub-dark.svg"
        currentBlogIcon = "../img/blog-dark.svg"
        currentTwitterIcon = "../img/Twitter-dark.svg"
    }

    if (iconTint > 0) {
        githubIcon = "../img/GitHub-bright.svg"
        blogIcon = "../img/blog-bright.svg"
        twitterIcon = "../img/Twitter-bright.svg"
    } else {
        githubIcon = "../img/GitHub-dark.svg"
        blogIcon = "../img/blog-dark.svg"
        twitterIcon = "../img/Twitter-dark.svg"
    }

    document.getElementById("github").animate([
        {backgroundImage: `url(${currentGithubIcon})`},
        {backgroundImage: `url(${githubIcon})`},
    ], {
        duration: 500,
        fill: "forwards"
    })

    document.getElementById("blog").animate([
        {backgroundImage: `url(${currentBlogIcon})`},
        {backgroundImage: `url(${blogIcon})`},
    ], {
        duration: 500,
        fill: "forwards"
    })

    document.getElementById("twitter").animate([
        {backgroundImage: `url(${currentTwitterIcon})`},
        {backgroundImage: `url(${twitterIcon})`},
    ], {
        duration: 500,
        fill: "forwards"
    })
}

function storageAvailable(type) {
    let storage
    try {
        storage = window[type]
        let x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0)
    }
}

function generateUuid() {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("")
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16)
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
                break;
        }
    }
    return chars.join("")
}

function getColor(seed) {
    const random = new Random(seed)

    const r = random.nextInt(0, 255)
    const g = random.nextInt(0, 255)
    const b = random.nextInt(0, 255)

    return `rgb(${r}, ${g}, ${b})`
}

function getIconTint(backgroundColor) {
    const regex = /rgb\((.+),\s?(.+),\s?(.+)\)/i
    const r = Number(backgroundColor.replace(regex, "$1"))
    const g = Number(backgroundColor.replace(regex, "$2"))
    const b = Number(backgroundColor.replace(regex, "$3"))

    if (r + g + b > 384) {
        return -1
    } else {
        return 1
    }
}

String.prototype.hashCode = function () {
    let hash = 0
    for (let i = 0; i < this.length; i++) {
        hash = hash * 31 + this.charCodeAt(i)
        hash = hash | 0
    }

    return hash;
}

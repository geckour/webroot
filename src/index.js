import { Random } from './random.js'

window.onload = function () {
    Array.prototype.forEach.call(document.getElementsByClassName("item"), function (element) {
        var classList = element.getElementsByClassName("ripple")[0].classList
        var onDown = false

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

    if (storageAvailable('localStorage')) {
        if (!localStorage.id) localStorage.id = generateUuid()
        if (localStorage.backgroundColor) changeColors(document, localStorage.backgroundColor)
        const today = new Date().toDateString()
        const seed = localStorage.id + today
        const color = getColor(seed.hashCode())

        const changeBgColorElem = document.getElementById("change-bg-color")
        changeBgColorElem.style.backgroundColor = color
        changeBgColorElem.onclick = function() {
            changeColors(document)
            database.ref('background').update({
                color: color
            })
        }
    }
}

function changeColors(document, color) {
    if (storageAvailable('localStorage')) {
        localStorage.backgroundColor = color
    }
    document.body.style.backgroundColor = color
    document.getElementsByClassName("footer-txt")[0].style.color = color
}

function storageAvailable(type) {
    let storage
    try {
        storage = window[type]
        let x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
    }
    catch(e) {
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

String.prototype.hashCode = function(){
    let hash = 0
    for (let i = 0; i < this.length; i++) {
        hash = hash * 31 + this.charCodeAt(i)
        hash = hash | 0
    }

    return hash; 
}

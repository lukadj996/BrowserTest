window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed', performance.now());
    init_fn()
});

function init_fn() {
    for (let btn of document.querySelectorAll(".flex_container button")) {
        btn.addEventListener("click", window[`${btn.id}_fn`])
    }


}

function alert_fn() {
    alert("This is alert message!")
    this.nextElementSibling.innerText = "Alert shown!"
}

function confirm_fn() {
    if (confirm("This is confirm message!")) {
        this.nextElementSibling.innerText = "You pressed OK"
    } else {
        this.nextElementSibling.innerText = "You pressed Cancel"
    }
}

function prompt_fn() {
    let ret = prompt("This is promt message!")
    if (ret !== null) {
        if (ret === "") {
            this.nextElementSibling.innerText = "You pressed OK"
        } else {
            this.nextElementSibling.innerText = `You typed: "${ret}"`
        }
    } else {
        this.nextElementSibling.innerText = "You pressed Cancel"
    }
}

function loop_alert_fn() {
    for (let i = 0; i < 10; i++) {
        alert(`This is Alert #${i}`)
    }
    this.nextElementSibling.innerText = "10 Alerts shown!"
}

function get_user_agent_fn() {
    alert(window.navigator.userAgent)

}

function test_cookies_fn() {
    document.cookie = "testkey=testvalue;"
    let cookieEnabled = document.cookie.indexOf("testkey") != -1;

    if (cookieEnabled && navigator.cookieEnabled) {

        this.nextElementSibling.innerText = `Cookies are Enabled`
    } else {
        this.nextElementSibling.innerText = `Cookies are Disabled`

    }
}
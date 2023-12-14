// const passwordInputs = document.querySelectorAll('input[type="password"]');

// console.log("extension running")

// if (passwordInputs.length > 0) {
//     document.querySelectorAll('button[type="submit"]').forEach((submitButton) => {
//         console.log("password input field found")
//         submitButton.addEventListener('click', onFormSubmit)
//     })
// }

document.addEventListener('DOMContentLoaded', () => {
    console.log("hits here")
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    if (passwordInputs.length > 0) {
        console.log("password input field found")
        const website = window.location.href;
        getDataByWebsite(website);
    }
});

function getDataByWebsite(website) {
    fetch(`http://localhost:5000/get?website=${encodeURIComponent(website)}`, {
        method: 'GET'
    })
    .then(response => {
        console.log("response")
        console.log(response.status)
        if (!response.ok) {
            if (response.status === 404) {
                console.log("No credentials found. Waiting for user input.");
                attachSubmitListener(); // Attach listener to wait for user to submit form
            } else {
                console.log("credentials maybe found")
                console.error("Error fetching credentials:", response.statusText);
            }
            return null;
        }
        return response.json();
    })
    .then(credentials => {
        console.log("hits here 2")
        if (credentials) {
            console.log("credentials found")
            console.log(credentials)
            const usernameField = document.querySelector('input[type="text"]');
            const passwordField = document.querySelector('input[type="password"]');
            if (usernameField && passwordField) {
                usernameField.value = credentials.username;
                passwordField.value = credentials.password;
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function attachSubmitListener() {
    document.querySelectorAll('button[type="submit"]').forEach((submitButton) => {
        submitButton.addEventListener('click', onFormSubmit);
    });
}

function onFormSubmit(event) {
    console.log("form submit pressed")
    event.preventDefault()

    const form = event.target;
    const usernameField = document.querySelector('input[type="text"]').value;
    const passwordField = document.querySelector('input[type="password"]').value;
    const website = window.location.href;
    console.log(usernameField, passwordField, website)

    chrome.runtime.sendMessage({
        action: 'showPopup',
        username: usernameField,
        password: passwordField,
        website: website
    });
}
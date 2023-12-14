document.addEventListener('DOMContentLoaded', () => {
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
                console.log("credentials maybe found");
                console.error("Error fetching credentials:", response.statusText);
            }
            return null;
        }
        return response.json();
    })
    .then(credentials => {
        console.log("hits here 2")
        if (credentials) {
            decryptData(credentials.password, credentials.iv).then(password => {
                const usernameField = document.querySelector('input[type="text"]');
                const passwordField = document.querySelector('input[type="password"]');
                if (usernameField && passwordField) {
                    usernameField.value = credentials.username;
                    passwordField.value = password;
                }
            })
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
    event.preventDefault()


    const form = event.target.closest('form');
    if (!form) {
        console.error("No form found.");
        return;
    }

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

    form.submit()
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Decrypt data using AES-GCM
async function decryptData(encryptedDataBase64, ivBase64) {
    const encryptionKey = await getAndImportKey();
    const encryptedData = base64ToArrayBuffer(encryptedDataBase64);
    const iv = base64ToArrayBuffer(ivBase64);
    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        encryptionKey,
        encryptedData
    );

    // Convert the decrypted data back to a string
    return new TextDecoder().decode(decryptedData);
}

// Retrieve and import the encryption key
async function getAndImportKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['encryptionKey'], async (result) => {
            if (result.encryptionKey) {
                try {
                    const key = await crypto.subtle.importKey(
                        'jwk',
                        result.encryptionKey,
                        { name: 'AES-GCM', length: 256 },
                        true,
                        ['encrypt', 'decrypt']
                    );
                    resolve(key);
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(new Error('Encryption key not found'));
            }
        });
    });
}
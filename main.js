alert("The test extension is up and running")

// Assuming you have downloaded and included CryptoJS in your extension package
const CryptoJS = require('crypto-js');

// insert a username-password row into database
function insertData(username, password, website) {
    fetch('http://localhost:5000/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, website }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// delete a username-password row from the database
function deleteData(rowId) {
    fetch(`http://localhost:5000/delete?row_id=${rowId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to encrypt
function encryptData(data) {
  var key = "3gH!9_@f4mP*Lr2Wqz"; // Replace with your key
  return CryptoJS.AES.encrypt(data, key).toString();
}

// // Function to decrypt
function decryptData(data) {
  var key = "your-encryption-key"; // Replace with your key
  return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

// Detect password fields and add listeners
document.querySelectorAll('input[type="password"]').forEach(inputField => {
  inputField.addEventListener('focus', () => {
    // Code to create and display the popup UI
    createPopupUI(inputField);
  });
});

// Function to create Popup UI
function createPopupUI(inputField) {
    // Remove existing popups to avoid duplicates
    removeExistingPopups();

    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'encryptionPopup';
    popup.style.position = 'absolute';
    popup.style.border = '1px solid black';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.5)';

    // Position the popup
    const rect = inputField.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    // const insertButton = document.createElement('button');
    // insertButton.textContent = 'insert';
    // // Modify the Encrypt Button's click event listener
    // insertButton.addEventListener('click', () => {
    //     // const encryptedValue = encryptData(inputField.value);
    //     // inputField.value = encryptedValue;

    //     // Example of using insertData - replace with actual data
    //     insertData('exampleUsername', "inputField.value", 'exampleWebsite');
    //     removeExistingPopups();
    // });

    // Create the Encrypt Button that automatically adds the username-password to the database
    const encryptButton = document.createElement('button');
    encryptButton.textContent = 'Encrypt';
    encryptButton.style.marginRight = '10px';
    encryptButton.addEventListener('click', () => {
        inputField.value = encryptData(inputField.value);
        insertData('exampleUsername', "inputField.value", 'exampleWebsite');
        removeExistingPopups();
    });

    // Create the Decrypt Button
    const decryptButton = document.createElement('button');
    decryptButton.textContent = 'Decrypt';
    decryptButton.addEventListener('click', () => {
        inputField.value = decryptData(inputField.value);
        removeExistingPopups();
    });

    // Append buttons to the popup
    popup.appendChild(encryptButton);
    popup.appendChild(decryptButton);
    // popup.appendChild(insertButton)

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Helper function to remove existing popups
function removeExistingPopups() {
    const existingPopup = document.getElementById('encryptionPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
}
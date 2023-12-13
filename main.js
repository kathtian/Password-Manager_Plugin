import { generateEncryptionKey } from './encryption.js';

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
// ---------------------------------------------

// Detect password fields and add listeners
document.querySelectorAll('input[type="password"]').forEach(inputField => {
  inputField.addEventListener('change', async () => {
    try {
        const encryptionKey = await generateEncryptionKey();

        const { encryptedData, iv } = await encryptData(inputField.value, encryptionKey);
        console.log('Encrypted data:', encryptedData);

        const decryptedData = await decryptData(encryptedData, encryptionKey, iv);
        console.log('Decrypted data:', decryptedData);
    } catch (error) {
        console.error('Error:', error);
    }
  });
});
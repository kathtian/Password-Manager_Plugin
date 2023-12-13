import { generateEncryptionKey } from './encryption.js';

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
// import { generateEncryptionKey } from './encryption.js';

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'savePassword') {
        console.log("Message Recieved");
        storePassword();
    }
});

// Save password in the DB
async function storePassword() {
        const encryptionKey = await generateEncryptionKey();

        const { encryptedData, iv } = await encryptData(inputField.value, encryptionKey);
        console.log('Encrypted data:', encryptedData);
    
        const decryptedData = await decryptData(encryptedData, encryptionKey, iv);
        console.log('Decrypted data:', decryptedData);
}

// Detect password fields and add listeners
document.querySelectorAll('input[type="password"]').forEach(inputField => {
  inputField.addEventListener('change', async () => {
    try {
        // trigger the popup
        chrome.runtime.sendMessage({ action: 'showPopup' });
    } catch (error) {
        console.error('Error:', error);
    }
  });
});

// ------------------------------------------------------------- //

async function generateEncryptionKey() {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

// Encrypt data using AES-GCM
async function encryptData(data, encryptionKey) {
    // Convert the data to Uint8Array
    const dataUint8 = new TextEncoder().encode(data);
  
    // Generate an IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
  
    // Perform encryption
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      dataUint8
    );
  
    return { encryptedData, iv };
}

// Decrypt data using AES-GCM
async function decryptData(encryptedData, encryptionKey, iv) {
    // Perform decryption
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      encryptedData
    );
  
    // Convert the decrypted data back to a string
    return new TextDecoder().decode(decryptedData);
}
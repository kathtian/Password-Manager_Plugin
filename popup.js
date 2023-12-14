const noButton = document.getElementById('no');
const yesButton = document.getElementById('yes');
const info = document.getElementById('info');

noButton.addEventListener('click', handleNoClick)
yesButton.addEventListener('click', handleYesClick)

var queryParams = new URLSearchParams(window.location.search);
var username = queryParams.get('username');
var password = queryParams.get('password');
var website = queryParams.get('website');

var key = generateEncryptionKey()
response = encryptData(password, key);
password = repsonse.encryptedData;
var iv = response.iv;

console.log(username, password, iv, website);

function handleNoClick() {
    window.close()
}

function handleYesClick() {
    // insertData(username, password, website)
    console.log("submission success!");
    window.close()
}

// ------------------------------------------------------------- //

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
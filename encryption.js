// Encrpytion.js
// Stores all function sthat have to do with encryption/decryption of
// data.

export async function generateEncryptionKey() {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

// Encrypt data using AES-GCM
export async function encryptData(data, encryptionKey) {
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
export async function decryptData(encryptedData, encryptionKey, iv) {
    // Perform decryption
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      encryptedData
    );
  
    // Convert the decrypted data back to a string
    return new TextDecoder().decode(decryptedData);
}
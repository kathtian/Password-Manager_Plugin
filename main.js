const passwordInputs = document.querySelectorAll('input[type="password"]');

console.log("extension running")

if (passwordInputs.length > 0) {
    document.querySelectorAll('button[type="submit"]').forEach((submitButton) => {
        console.log("password input field found")
        submitButton.addEventListener('click', onFormSubmit)
    })
}

function onFormSubmit(event) {
    console.log("form submit pressed")
    event.preventDefault()

    const form = event.target;
    const usernameField = document.querySelector('input[type="text"]').value; // Adjust if necessary
    const passwordField = document.querySelector('input[type="password"]').value;
    const website = window.location.href;
    console.log(usernameField, passwordField, website)

    // var data = {
    //     username: usernameField,
    //     password: passwordField,
    //     website: website
    // }
    
    // if usernameField
    chrome.runtime.sendMessage({
        action: 'showPopup',
        username: usernameField,
        password: passwordField,
        website: website
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
          // trigger the popup
        //   chrome.runtime.sendMessage({
        //       action: 'showPopup',
        //       username: ,
        //       password: inputfield,
        //       website: 
        //   });
      } catch (error) {
          console.error('Error:', error);
      }
    });
  });

  function getDataByWebsite(website) {
    fetch(`http://localhost:5000/get?website=${encodeURIComponent(website)}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No credentials found for this website');
        }
        return response.json();
    })
    .then(credentials => {
        console.log('Credentials found:', credentials);
        // You can now use the retrieved credentials as needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
const noButton = document.getElementById('no');
const yesButton = document.getElementById('yes');

noButton.addEventListener('click', handleNoClick)
yesButton.addEventListener('click', handleYesClick)

function handleNoClick() {
  window.close()
}

function handleYesClick() {
    console.log("Yes Clicked");
    chrome.runtime.sendMessage({ action: 'savePassword' });
    console.log("Message sent");
    // window.close()
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showPopup') {
        // Trigger the popup to appear
        chrome.windows.create({
            type: 'popup',
            url: 'popup.html',
            width: 400,
            height: 300,
          });
    }
});
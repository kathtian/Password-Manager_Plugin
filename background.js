chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showPopup') {
        // Trigger the popup to appear
        const username = encodeURIComponent(request.username);
        const password = encodeURIComponent(request.password);
        const website = encodeURIComponent(request.website);

        chrome.windows.create({
            type: 'popup',
            url: 'popup.html?username=' + username + '&password=' + password + '&website=' + website,
            width: 400,
            height: 300,
          });
    }
});
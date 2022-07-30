chrome.action.onClicked.addListener((tab) => {
  // TODO: will redirect to readme page
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("update1.html"),
    },
    function (tab) {}
  );
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.scripting.executeScript(
    { target: { tabId: tabId, allFrames: true }, files: ["script.js"] },
    () => {}
  );
});

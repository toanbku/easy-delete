chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("homepage.html"),
    },
    function (tab) {}
  );
});

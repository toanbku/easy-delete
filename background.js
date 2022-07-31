// TODO: we need to move it to the new file
const DEFAULT_HOST = {
  "github.com": {
    host: "github.com",
    enable: true,
    source:
      "#options_bucket > div.Box.color-border-danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > p:nth-child(2) > strong",
    target:
      "#options_bucket > div.Box.color-border-danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > form > p > input",
  },
  "gitlab.com": {
    host: "gitlab.com",
    enable: true,
    source:
      "#delete-project-modal-2___BV_modal_body_ > div > p:nth-child(3) > code",
    target: "#confirm_name_input",
  },
  // add more to default support for gitlab,...
};

// init default setting
async function initStorage() {
  const storageGetter = await chrome.storage.local.get(["initial"]);
  const isInitial = storageGetter.initial;

  if (!isInitial) {
    chrome.storage.local.set({ initial: true, config: DEFAULT_HOST }, () => {});
  }
}

initStorage();

// for debug purpose, display console when the storage change
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was `,
      oldValue,
      `new value is".`,
      newValue
    );
  }
});

// when user click icon on extension, we'll bring them to config page
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("homepage.html"),
    },
    function (tab) {}
  );
});

// inject the main script to every tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId, allFrames: true },
      function: main,
    },
    () => {}
  );
});

// main work for our extension
async function main() {
  const storageGetter = await chrome.storage.local.get(["config"]);
  const config = storageGetter.config;
  if (!config) {
    return;
  }

  const currentHostName = document.location.hostname;
  const selectedConfig = config[currentHostName];

  // early return to make sure we only listen hosts that we defined
  if (!selectedConfig) {
    return;
  }

  document.addEventListener("click", async () => {
    const sourceElement = document.querySelector(selectedConfig.source);
    const source = sourceElement && sourceElement.innerHTML;
    const target = document.querySelector(selectedConfig.target);

    if (!source || !target) {
      console.log("Cannot find source or target, please check again");
      console.log("info:", source, target);
      return;
    }

    // assign value
    target.value = source;

    // trigger event onchange to simulate typing action
    target.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

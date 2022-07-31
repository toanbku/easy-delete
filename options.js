async function getConfig() {
  const storageGetter = await chrome.storage.local.get(["config"]);
  return storageGetter.config;
}

// return promise, we need to await it
function setConfig(newConfig) {
  return chrome.storage.local.set({ config: newConfig });
}

async function deleteConfig(key) {
  if (!key) {
    return;
  }
  const config = await getConfig();
  const newConfig = JSON.parse(JSON.stringify(config));
  delete newConfig[key];

  await setConfig(newConfig);
}

// UI
function addRow(host, config) {
  const rowElement = document.querySelector("#template");
  const cloneRowNode = rowElement.content.cloneNode(true);

  Object.keys(config)
    .filter((c) => !["enable"].includes(c))
    .forEach((c) => {
      cloneRowNode.querySelector(`.${c}`).value = config[c];
    });

  cloneRowNode.querySelector(".delete").addEventListener("click", () => {
    deleteConfig(config.host);
    location.reload();
  });

  document.querySelector("#form-body").appendChild(cloneRowNode);
}

async function main() {
  const config = await getConfig();
  Object.keys(config).forEach((key) => {
    addRow(key, config[key]);
  });

  // add new row
  addRow("", {});

  document.querySelector("#saveHost").addEventListener("click", () => {
    let newConfig = {};

    document.querySelectorAll(".item").forEach((item) => {
      const host = item.querySelector(".host").value;
      const source = item.querySelector(".source").value;
      const target = item.querySelector(".target").value;

      newConfig[`${host}`] = {
        enable: true,
        host,
        source,
        target,
      };
    });

    // filter empty host
    delete newConfig[""];

    setConfig(newConfig);
    location.reload();
  });
}

// Execute
main();

console.log("1");
document.addEventListener("click", () => {
  const repo = document.querySelector(
    "#options_bucket > div.Box.color-border-danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > p:nth-child(2) > strong"
  ).innerHTML;

  if (repo) {
    const target = document.querySelector(
      "#options_bucket > div.Box.color-border-danger > ul > li:nth-child(4) > details > details-dialog > div.Box-body.overflow-auto > form > p > input"
    );

    // assign value
    target.value = repo;

    // trigger event onchange
    target.dispatchEvent(new Event("change", { bubbles: true }));
  }
});

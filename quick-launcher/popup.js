const linksList = document.getElementById("linksList");

chrome.storage.local.get("links", ({ links }) => {
  if (links) {
    links.forEach((link) => {
      const button = document.createElement("button");
      button.textContent = link.name;
      button.addEventListener("click", () => {
        chrome.tabs.create({ url: link.url });
      });
      linksList.appendChild(button);
    });
  }
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

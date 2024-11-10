const linkList = document.getElementById("linkList");

function updateLinks() {
  linkList.innerHTML = "";
  chrome.storage.local.get("links", ({ links = [] }) => {
    links.forEach((link) => {
      const div = document.createElement("div");
      div.textContent = `${link.name} - ${link.url}`;
      linkList.appendChild(div);
    });
  });
}

document.getElementById("addLink").addEventListener("click", () => {
  const name = document.getElementById("linkName").value;
  const url = document.getElementById("linkURL").value;

  chrome.storage.local.get("links", ({ links = [] }) => {
    links.push({ name, url });
    chrome.storage.local.set({ links }, updateLinks);
  });
});

updateLinks();

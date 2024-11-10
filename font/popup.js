document.getElementById("applyFont").addEventListener("click", () => {
  const font = document.getElementById("fontSelect").value;

  // Check if Chrome's scripting API is available
  if (chrome && chrome.scripting) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: applyFont,
        args: [font],
      });
    });
  }
});

// Function that will be injected into the content of the active page
function applyFont(font) {
  console.log(`Applying font: ${font}`); // Confirm font selection

  const googleFonts = {
    Poppins:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap",
    Roboto:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
  };

  if (googleFonts[font]) {
    const linkId = "font-changer-link"; // Unique ID for the link tag
    let link = document.getElementById(linkId);

    // If link doesn't exist, create it
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = linkId;
      document.head.appendChild(link);
    }

    link.href = googleFonts[font];
  }

  // Inject a style block to forcefully apply the font-family to all elements
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    * {
      font-family: ${font} !important;
    }
  `;
  document.head.appendChild(styleTag);
}

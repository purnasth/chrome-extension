document.getElementById("applyFont").addEventListener("click", () => {
  const font = document.getElementById("fontSelect").value;

  // Get selected tags
  const selectedTags = [];
  document.querySelectorAll('.font-tag:checked').forEach(tag => selectedTags.push(tag.value));

  // Check if Chrome's scripting API is available
  if (chrome && chrome.scripting) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: applyFont,
        args: [font, selectedTags],
      });
    });
  }

  // Update preview in popup
  document.querySelector('.font-preview-text').style.fontFamily = font;
  document.querySelector('.font-preview-text').innerHTML = `Previewing: ${font}`;

  // Uncheck checkboxes and update label
  document.querySelectorAll('.font-tag:checked').forEach(tag => {
    tag.checked = false;
    const label = tag.parentElement.querySelector('label');
    if (label) {
      label.innerHTML = `${label.innerHTML.split(':')[0]}: ${font}`;
    }
  });
});

document.getElementById("clearFont").addEventListener("click", () => {
  // Check if Chrome's scripting API is available
  if (chrome && chrome.scripting) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: clearFont,
      });
    });
  }

  // Reset preview text
  document.querySelector('.font-preview-text').style.fontFamily = "Arial";
  document.querySelector('.font-preview-text').innerHTML = "Preview Reset.";
});

// Function to apply the font to the selected tags
function applyFont(font, tags) {
  console.log(`Applying font: ${font} to ${tags.join(", ")}`); // Confirm font selection

  const googleFonts = {
    Poppins:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap",
    Roboto:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
  };

  // If the font has a Google font link
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

  // Apply the font to selected tags
  const styleTag = document.createElement("style");
  styleTag.innerHTML = tags.map(tag => `${tag} { font-family: ${font} !important; }`).join(" ");
  document.head.appendChild(styleTag);
}

// Function to clear any applied fonts
function clearFont() {
  console.log("Clearing custom font styles");

  // Remove the font link if it exists
  const link = document.getElementById("font-changer-link");
  if (link) {
    link.remove();
  }

  // Remove custom styles
  const styleTags = document.querySelectorAll('style');
  styleTags.forEach((style) => {
    if (style.innerHTML.includes('font-family')) {
      style.remove();
    }
  });
}
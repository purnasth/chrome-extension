document.addEventListener("DOMContentLoaded", () => {
  const fonts = {
      "sans-serif": ["Arial", "Roboto", "Poppins"],
      "serif": ["Times New Roman", "Georgia", "Garamond"],
      "script": ["Brush Script MT", "Pacifico", "Dancing Script"],
  };

  const fontOptionsDiv = document.getElementById("fontOptions");
  const fontSelect = document.getElementById("categorySelect");
  const searchFont = document.getElementById("searchFont");
  const resetFontBtn = document.getElementById("resetFont");
  const tagCheckboxes = document.querySelectorAll(".tag-checkbox");

  // Load all fonts across categories
  const allFonts = Object.values(fonts).flat();

  // Load fonts into the popup
  const loadFonts = (category) => {
      const fontList = category === "all" ? allFonts : fonts[category];
      fontOptionsDiv.innerHTML = fontList
          .map((font) => `<div class="font-btn" data-font="${font}">${font}</div>`)
          .join("");
  };

  // Change font category
  fontSelect.addEventListener("change", () => {
      loadFonts(fontSelect.value);
  });

  // Search fonts
  searchFont.addEventListener("input", () => {
      const query = searchFont.value.toLowerCase();
      const fontList = fontSelect.value === "all" ? allFonts : fonts[fontSelect.value];
      const filteredFonts = fontList.filter((font) => font.toLowerCase().includes(query));
      fontOptionsDiv.innerHTML = filteredFonts
          .map((font) => `<div class="font-btn" data-font="${font}">${font}</div>`)
          .join("");
  });

  // Apply font to tags or all elements by default
  fontOptionsDiv.addEventListener("click", (e) => {
      if (e.target.classList.contains("font-btn")) {
          const font = e.target.dataset.font;
          const selectedTags = Array.from(tagCheckboxes)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.value);

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  func: applyFont,
                  args: [font, selectedTags],
              });
          });
      }
  });

  // Reset fonts
  resetFontBtn.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: resetFont,
          });
      });
  });

  loadFonts("all"); // Load all fonts by default
});

// Script to apply font to the webpage
function applyFont(font, tags) {
  const styleTag = document.getElementById("font-style-tag") || document.createElement("style");
  styleTag.id = "font-style-tag";
  const tagStyles = tags.length
      ? tags.map((tag) => `${tag} { font-family: '${font}' !important; }`).join(" ")
      : `* { font-family: '${font}' !important; }`;
  styleTag.textContent = tagStyles;
  document.head.appendChild(styleTag);
}

// Script to reset fonts on the webpage
function resetFont() {
  const styleTag = document.getElementById("font-style-tag");
  if (styleTag) styleTag.remove();
}

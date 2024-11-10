const noteElement = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

if (chrome.storage) {
  // Load saved note on popup load
  chrome.storage.local.get("note", ({ note }) => {
    if (note) noteElement.value = note;
  });

  // Save note
  saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({ note: noteElement.value }, () => {
      alert("Note saved!");
    });
  });

  // Clear note
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.remove("note", () => {
      noteElement.value = "";
    });
  });
} else {
  console.error("chrome.storage is not available.");
}

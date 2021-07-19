// Needs to be done here as this is cilent-side.

const allCommentButtons = document.querySelectorAll(".commentButton");
allCommentButtons.forEach(function(button) {
  const buttonId = button.id;
  const areaId = buttonId.slice(0, -6);
  const associatedInputArea = document.getElementById(areaId);
  button.addEventListener("click", function() {
    if (associatedInputArea.style.display == "none") {
      associatedInputArea.style.display = "flex";
    } else {
      associatedInputArea.style.display = "none";
    }
  })
})
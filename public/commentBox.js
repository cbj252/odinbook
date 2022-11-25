// Needs to be done here as this is cilent-side.

function isVisible(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

const allCommentButtons = document.querySelectorAll(".commentButton");
allCommentButtons.forEach(function (button) {
  const buttonId = button.id;
  const areaId = buttonId.slice(0, -6);
  const associatedInputArea = document.getElementById(areaId);
  button.addEventListener("click", function () {
    if (associatedInputArea.style.display == "none") {
      associatedInputArea.style.display = "flex";
      // 200 is arbitary - anything more than the width of one comment box is fine.
      document.documentElement.scrollTop =
        document.documentElement.scrollTop + 200;
      document.body.scrollTop = document.body.scrollTop + 200;
    } else {
      associatedInputArea.style.display = "none";
    }
  });
});

var link1 = document.getElementById("link1");
var link2 = document.getElementById("link2");
var link3 = document.getElementById("link3");
var articleContent = document.getElementById("articleContent");

function loadMarkdownFile(filename) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "md/" + filename, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var markdownContent = xhr.responseText;
      var converter = new showdown.Converter();
      var htmlContent = converter.makeHtml(markdownContent);
      articleContent.innerHTML = htmlContent;
    }
  };
  xhr.send();
}

link1.addEventListener("click", function (event) {
  event.preventDefault();
  loadMarkdownFile("link1.md");
});

link2.addEventListener("click", function (event) {
  event.preventDefault();
  loadMarkdownFile("link2.md");
});

link3.addEventListener("click", function (event) {
  event.preventDefault();
  loadMarkdownFile("link3.md");
});
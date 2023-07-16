var link1 = document.getElementById("link1");
var link2 = document.getElementById("link2");
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
  console.log("link1被点击了");
  loadMarkdownFile("link1.md");
  console.log("articleContent的内容已更新");
});

link2.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("link2被点击了");
  loadMarkdownFile("link2.md");
  console.log("articleContent的内容已更新");
});

document.addEventListener("DOMContentLoaded", function() {
    // 添加按钮点击事件处理程序
    document.getElementById("convertButton").addEventListener("click", function () {
        var inputText = document.getElementById("textarea").value;
        var outputText = processInput(inputText);
        document.getElementById("outputDiv").innerText = outputText;
    });
});

function processInput(input) {
    // 调用外部的处理函数
    return process(input);
}
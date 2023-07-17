function process(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var charCode = input.charCodeAt(i);
        output += "\\u" + charCode.toString(16).padStart(4, "0");
    }
    return output;
}
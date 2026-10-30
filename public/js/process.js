function process(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        var charCode = input.charCodeAt(i);
        output += encodeURIComponent(input[i]);
    }
    return output;
}
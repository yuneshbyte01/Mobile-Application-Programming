function sum() {
    var a = Number(document.getElementById("num1").value);
    var b = Number(document.getElementById("num2").value);
    var c = a + b;
    document.getElementById("display_sum").innerHTML = "The sum of " + a + " and " + b + " is: " + c;
}
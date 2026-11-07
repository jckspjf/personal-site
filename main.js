var texts = [
    "C'est la vie.",
    "The Devil's in the details.",
    "Every Bird must leave its Nest.",
    "Every Nest should support a Bird.",
    "Per Aspera Ad Astra.",
    "Mercury, Venus, Terra, Mars... wait, Terra?",
    "Watching, for 'your' safety.. we swear.",
    "Your body betrays your degeneracy."
];

const fontToggle = document.getElementById("fontToggle");

const savedFont = localStorage.getItem("accessibleFont") === "true";

document.body.classList.toggle("accessibleFont", savedFont);
fontToggle.checked = savedFont;

fontToggle.addEventListener("change", () => {
    const enabled = fontToggle.checked;

    document.body.classList.toggle("accessibleFont", enabled);
    localStorage.setItem("accessibleFont", enabled);
});

document.getElementById('randomText').textContent = texts[Math.floor(Math.random() * texts.length)];
var randomText = function() {
    document.getElementById('randomText').textContent = texts[Math.floor(Math.random() * texts.length)];
};

var today = new Date()
var presentHr = today.getHours()
var time = null;

if (presentHr < 12) {
    var time = "morning";
} else if (presentHr < 18) {
    var time = "afternoon";
} else {
    var time = "evening";
}
document.getElementById("time").textContent = time;

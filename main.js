var texts = [
    "C'est la vie.",
    "The Devil's in the details.",
    "Every Bird must leave its Nest.",
    "Per Aspera Ad Astra.",
    "Mercury, Venus, Terra, Mars... wait, Terra?"
];

document.getElementById('randomText').value = texts[Math.floor(Math.random()*texts.length)];

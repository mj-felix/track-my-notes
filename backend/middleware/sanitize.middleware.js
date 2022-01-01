const sanitizer = require("express-html-sanitizer");

const allowed = {
  allowedTags: [
    "u",
    "em",
    "strong",
    "a",
    "p",
    "li",
    "ul",
    "ol",
    "img",
    "h1",
    "h2",
    "h3",
    "br",
    "hr",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target"],
    img: ["src", "alt", "style"],
  },
};

module.exports = sanitizer(allowed);

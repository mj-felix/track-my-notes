const sanitizer = require('express-html-sanitizer');

const allowed = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'li', 'ul', 'ol', 'img', 'h1', 'h2', 'h3', 'br', 'pre'],
    allowedAttributes: {
        'a': ['href', 'target'],
        'img': ['src', 'class', 'alt'],
    }
};

module.exports = sanitizer(allowed);
const sanitizer = require('express-html-sanitizer');

const allowed = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'li', 'ul', 'ol', 'img'],
    allowedAttributes: {
        'a': ['href', 'target'],
        'img': ['src', 'class', 'alt'],
    }
};

module.exports = sanitizer(allowed);
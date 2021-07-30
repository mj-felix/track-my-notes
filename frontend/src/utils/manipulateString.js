export const replaceLinks = (str) => {
    const pattern = /((ftp|https?|file):\/\/[\S]+(\b|$))(?=[\s|<])/gim;
    return str.replace(pattern, "<a href='$1' target='_blank'>$1</a>");
};

export const breakLines = (str) => str.split('').reverse().join('').split(/\n(?=>a|>\/|>me|>gnorts|\b|\n)/).join('>/ rb<').split('').reverse().join('');

export const removeProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '');
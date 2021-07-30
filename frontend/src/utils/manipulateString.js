export const replaceLinks = (str) => {
    const pattern = /(?<!")((ftp|http|https|file):\/\/[\S]+(\b|$))/gim;
    return str.replace(pattern, "<a href='$1' target='_blank'>$1</a>");
};

export const breakLines = (str) => str.split(/(?<=a>|\/>|em>|strong>|\b|\n)\n/).join('<br />');

export const removeProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '');
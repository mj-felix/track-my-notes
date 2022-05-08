export const replaceLinks = (str) => {
  const pattern = /((ftp|https?|file):\/\/[\S]+(\b|$))(?=[\s|<])/gim;
  return str.replace(pattern, "<a href='$1' target='_blank'>$1</a>");
};
// eslint-disable-next-line
export const breakLines = (str) =>
  str
    .split("")
    .reverse()
    .join("")
    // eslint-disable-next-line
    .split(/\n(?=>a|>\/|>me|>gnorts|\b|\n|\s|[.?!@#$%^&*()\[\]\{\}_+-=;:,…])/)
    .join(">/ rb<")
    .split("")
    .reverse()
    .join("");

export const removeProtocol = (url) => url.replace(/(^\w+:|^)\/\//, "");

export const addStopPropagation = (str) =>
  str.replace(
    /<a /gi,
    '<a onclick="(function (e) { e.stopPropagation(); })(arguments[0]);" '
  );

export const replaceStringWithMapping = (str, mappings) => {
  var output = str;
  for (var mapping of mappings) {
    output = output.replace(
      new RegExp(`${mapping.toReplace}`, "g"),
      mapping.replaceWith
    );
  }
  return output;
};

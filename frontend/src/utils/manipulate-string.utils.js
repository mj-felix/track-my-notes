import DOMPurify from "dompurify";
import { marked } from "marked";

export const removeProtocol = (url) => url.replace(/(^\w+:|^)\/\//, "");

export const addStopPropagation = (str) =>
  str.replace(
    /<a /gi,
    '<a onclick="(function (e) { e.stopPropagation(); })(arguments[0]);" '
  );

export const openLinksInNewTab = (str) =>
  str.replace(/<a /gi, '<a target="_blank" ');

export const amendLinks = (str) => openLinksInNewTab(addStopPropagation(str));

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

export const convertMarkdownToHtmlSafely = (str) => {
  return DOMPurify.sanitize(marked.parse(str));
};

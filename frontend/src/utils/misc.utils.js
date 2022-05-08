export const generateColor = (color) => {
  const colors = ["primary", "success", "info", "warning"];
  const index = color % 4;
  return colors[index];
};

export const generateMappingFromFiles = (files) => {
  return files.map((file) => {
    return {
      toReplace: file.storedFileName,
      replaceWith: file.url,
    };
  });
};

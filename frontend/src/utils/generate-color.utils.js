export const generateColor = (color) => {
  const colors = ["primary", "success", "info", "warning"];
  const index = color % 4;
  return colors[index];
};

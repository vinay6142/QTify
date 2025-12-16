// Utility function to truncate text with ellipsis
export const truncate = (string, maxLength) => {
  if (string && string.length > maxLength) {
    return string.slice(0, maxLength) + "...";
  }
  return string;
};

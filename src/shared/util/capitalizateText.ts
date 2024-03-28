export const capitalizeText = (text: string): string => {
  const capitalizedText = text.replace(
    /\b\w+/g,
    match => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
  );
  const trimmedText = capitalizedText.replace(/\s+/g, ' ').trim();
  return trimmedText;
};

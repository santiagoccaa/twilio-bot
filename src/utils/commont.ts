/**
 *
 * Remove useless white spaces
 *
 * --> "   This\nis    a     messy   string.\t\t"
 * --> "This is a messy string."
 */

export const optimizeText = (text: string): string => {
  return text
    .replace(/[*_~`#]/g, "") // Elimina *, _, ~, `, #
    .replace(/\[.*?\]\(.*?\)/g, "") // Elimina links en formato [texto](url)
    .replace(/^[-+*]\s+/gm, "") // Elimina viñetas de listas
    .replace(/\s+/g, " ") // Remueve espacios dobles o saltos de línea innecesarios
    .trim();
};

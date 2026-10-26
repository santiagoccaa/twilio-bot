/**
 *
 * Remove useless white spaces
 *
 * --> "   This\nis    a     messy   string.\t\t"
 * --> "This is a messy string."
 */

export const optimizeText = (text: string) => text.replace(/\s+/g, " ").trim();

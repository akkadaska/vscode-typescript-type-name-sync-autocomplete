/**
 * Convert to all caps with removal of underscores
 * @param str
 * @returns
 */
export const toUpper = (str: string): string => {
  const camelCaseStr = str.replace(/_([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  );

  return camelCaseStr.toUpperCase();
};

/**
 * Convert to upper camel case
 * @param str
 * @returns
 */
export const upperCamelToCamelCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

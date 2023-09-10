import { toUpper } from '../utils';

/**
 * Get sort text prefix.
 * @param label
 * @param variableName
 * @param isPriority
 * @returns Sort text prefix
 */
export const getSortTextPrefix = (
  label: string,
  variableName: string,
  isPriority: boolean,
): string => {
  const upperLabel = toUpper(label);
  const upperCamelCaseVariableName = toUpper(variableName);
  if (upperCamelCaseVariableName === upperLabel) {
    return isPriority ? '00' : '05';
  } else if (upperCamelCaseVariableName.endsWith(upperLabel)) {
    return isPriority ? '01' : '11';
  } else if (upperCamelCaseVariableName.startsWith(upperLabel)) {
    return isPriority ? '02' : '12';
  } else if (upperLabel.endsWith(upperCamelCaseVariableName)) {
    return isPriority ? '03' : '13';
  } else if (upperLabel.startsWith(upperCamelCaseVariableName)) {
    return isPriority ? '04' : '14';
  } else if (upperLabel.includes(upperCamelCaseVariableName)) {
    return isPriority ? '20' : '30';
  } else if (upperCamelCaseVariableName.includes(upperLabel)) {
    return isPriority ? '21' : '31';
  } else {
    return isPriority ? '15' : '40';
  }
};

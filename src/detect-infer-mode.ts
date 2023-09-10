/**
 * infer mode from variable name.
 */
export const INFER_MODE = {
  /**
   * Name inference mode.
   * In this mode, the variable name is inferred from the type name.
   */
  NAME: 'name',

  /**
   * Type inference mode.
   * In this mode, the type name is inferred from the variable name.
   */
  TYPE: 'type',
} as const;

/**
 * Name infer mode type.
 */
export type NameInferMode = {
  /**
   * Infer mode.
   */
  readonly mode: typeof INFER_MODE.NAME;
};

/**
 * Type infer mode type.
 */
export type TypeInferMode = {
  /**
   * Infer mode.
   */
  readonly mode: typeof INFER_MODE.TYPE;
};

/**
 * Infer mode type.
 */
export type InferMode = NameInferMode | TypeInferMode;

/**
 * Detect infer mode from variable name.
 * @param variableName
 * @returns
 */
export const detectInferMode = (variableName: string): InferMode => {
  if (variableName === '_') {
    return { mode: INFER_MODE.NAME } as const;
  }
  return { mode: INFER_MODE.TYPE } as const;
};

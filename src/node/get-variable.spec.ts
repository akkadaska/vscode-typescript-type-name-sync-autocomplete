import { getCursorVariableInfo } from './get-cursor-variable-info';

const getCodeAndCursor = (
  codeWithCursor: string,
): { code: string; cursorPosition: number } => {
  const cursorPosition = codeWithCursor.indexOf('|') - 1;
  const code = codeWithCursor.replace('|', '');
  return { code, cursorPosition };
};

describe('getCursorVariableInfo', () => {
  describe('variable declaration case should return a variable node', () => {
    it('no space, not EOF', () => {
      const codeWithCursor = `const apple:|\nconst banana: Banana = new Banana();`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(':');
    });

    it('no space, EOF', () => {
      const codeWithCursor = `const apple:|`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(':');
    });

    it('leading space, not EOF', () => {
      const codeWithCursor = `const apple :|\nconst banana: Banana = new Banana();`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(' :');
    });

    it('leading space, EOF', () => {
      const codeWithCursor = `const apple :|`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(' :');
    });

    it('trailing space, not EOF', () => {
      const codeWithCursor = `const apple: |\nconst banana: Banana = new Banana();`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(': ');
    });

    it('trailing space, EOF', () => {
      const codeWithCursor = `const apple: |`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(': ');
    });
  });

  describe('function parameter case should return a variable node', () => {
    it('no space', () => {
      const codeWithCursor = `function apple(banana:|) {}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(':');
    });

    it('leading space', () => {
      const codeWithCursor = `function apple(banana :|) {}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(' :');
    });

    it('trailing space', () => {
      const codeWithCursor = `function apple(banana: |) {}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(': ');
    });
  });

  describe('class property case should return a variable node', () => {
    it('no space', () => {
      const codeWithCursor = `class Apple {\n\tbanana:|\n}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(':');
    });

    it('leading space', () => {
      const codeWithCursor = `class Apple {\n\tbanana :|\n}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(' :');
    });

    it('trailing space', () => {
      const codeWithCursor = `class Apple {\n\tbanana: |\n}`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('banana');
      expect(result?.variableStartsAt).toBe(code.indexOf('banana'));
      expect(result?.precedingCodeSegment).toBe(': ');
    });
  });

  describe('type declaration case should return a variable node', () => {
    it('no space', () => {
      const codeWithCursor = `type Apple = { color:| }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('color');
      expect(result?.variableStartsAt).toBe(code.indexOf('color'));
      expect(result?.precedingCodeSegment).toBe(':');
    });

    it('trailing space', () => {
      const codeWithCursor = `type Apple = { color: | }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('color');
      expect(result?.variableStartsAt).toBe(code.indexOf('color'));
      expect(result?.precedingCodeSegment).toBe(': ');
    });

    it('leading space', () => {
      const codeWithCursor = `type Apple = { color :| }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('color');
      expect(result?.variableStartsAt).toBe(code.indexOf('color'));
      expect(result?.precedingCodeSegment).toBe(' :');
    });
  });

  describe('TODO: n case should return a variable node', () => {
    it('not EOF', () => {
      const codeWithCursor = `const apple = new |\nconst banana: Banana = new Banana();`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(' = new ');
    });

    it('EOF', () => {
      const codeWithCursor = `const apple = new |`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result?.variableName).toBe('apple');
      expect(result?.variableStartsAt).toBe(code.indexOf('apple'));
      expect(result?.precedingCodeSegment).toBe(' = new ');
    });
  });

  describe('Type case should NOT return a variable node', () => {
    it('no space', () => {
      const codeWithCursor = `const apple = { color:| }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result).toBeUndefined();
    });

    it('trailing space', () => {
      const codeWithCursor = `const apple = { color: | }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result).toBeUndefined();
    });

    it('leading space', () => {
      const codeWithCursor = `const apple = { color :| }`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result).toBeUndefined();
    });
  });

  describe('Specific cases should NOT return a variable node', () => {
    it('c', () => {
      const codeWithCursor = `c|`;
      const { code, cursorPosition } = getCodeAndCursor(codeWithCursor);
      const result = getCursorVariableInfo(code, cursorPosition);
      expect(result).toBeUndefined();
    });
  });
});

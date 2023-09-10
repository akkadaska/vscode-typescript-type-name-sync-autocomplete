import { SyntaxKind, type Node, Project } from 'ts-morph';

/**
 * CursorVariableInfo
 * Represents the variable information at the current cursor position in the editor.
 * For example, given the code `const apple: |`, the `variableName` will be "apple",
 * the `variableStartsAt` will be the starting position of "apple", and the `precedingCodeSegment` will be ": ".
 */
export type CursorVariableInfo = {
  /**
   * The name of the variable located immediately before the cursor.
   * For example, in `const apple: |`, the `variableName` is "apple".
   */
  readonly variableName: string;

  /**
   * The starting position (index) of the variable in the code.
   */
  readonly variableStartsAt: number;

  /**
   * The segment of code from the end of the variable to the cursor position.
   * For example, in `const apple: |`, the `precedingCodeSegment` is ": ".
   */
  readonly precedingCodeSegment: string;
};

/**
 * Create AST from document and get node at cursor if exists, otherwise return undefined.
 * @param code code string
 * @param cursorPosition cursor position
 * @returns Node | undefined
 */
const getNodeAtCursor = (
  code: string,
  cursorPosition: number,
): Node | undefined => {
  const project = new Project();
  const sourceFile = project.createSourceFile('temp.ts', code);

  return sourceFile.getDescendantAtPos(cursorPosition);
};

const getVariableNodeFromSyntaxList = (
  syntaxListNode: Node,
): Node | undefined => {
  const lastChildrenNode = syntaxListNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.Parameter) {
    const variableNode = getVariableNodeFromParameterNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  } else if (lastChildrenNode?.getKind() === SyntaxKind.VariableStatement) {
    const variableNode =
      getVariableNodeFromVariableStatementNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  } else if (lastChildrenNode?.getKind() === SyntaxKind.VariableDeclaration) {
    const variableNode =
      getVariableNodeFromVariableDeclarationNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  } else if (lastChildrenNode?.getKind() === SyntaxKind.PropertyDeclaration) {
    const variableNode =
      getVariableNodeFromVariablePropertyDeclarationNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  } else if (lastChildrenNode?.getKind() === SyntaxKind.PropertySignature) {
    const variableNode =
      getVariableNodeFromPropertySignatureNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  }
  return undefined;
};

const getVariableNodeFromVariablePropertyDeclarationNode = (
  variablePropertyDeclarationNode: Node,
): Node | undefined => {
  const lastChildrenNode = variablePropertyDeclarationNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.TypeReference) {
    return getVariableNodeFromTypeReferenceNode(lastChildrenNode);
  }

  return undefined;
};

const getVariableNodeFromPropertySignatureNode = (
  propertySignatureNode: Node,
): Node | undefined => {
  const lastChildrenNode = propertySignatureNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.TypeReference) {
    return getVariableNodeFromTypeReferenceNode(lastChildrenNode);
  }

  return undefined;
};

const getVariableNodeFromVariableDeclarationNode = (
  variableDeclarationNode: Node,
): Node | undefined => {
  const lastChildrenNode = variableDeclarationNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.TypeReference) {
    return getVariableNodeFromTypeReferenceNode(lastChildrenNode);
  } else if (lastChildrenNode?.getKind() === SyntaxKind.VariableStatement) {
    return getVariableNodeFromVariableStatementNode(lastChildrenNode);
  } else if (lastChildrenNode?.getKind() === SyntaxKind.NewExpression) {
    return getVariableNodeFromNewExpressionNode(lastChildrenNode);
  }

  return undefined;
};

const getVariableNodeFromVariableStatementNode = (
  variableStatementNode: Node,
): Node | undefined => {
  const lastChildrenNode = variableStatementNode.getLastChild();
  if (lastChildrenNode?.getKind() === SyntaxKind.VariableDeclarationList) {
    const variableNode =
      getVariableNodeFromVariableDeclarationListNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  } else if (lastChildrenNode?.getKind() === SyntaxKind.SyntaxList) {
    const variableNode = getVariableNodeFromSyntaxList(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

const getVariableNodeFromVariableDeclarationListNode = (
  variableDeclarationListNode: Node,
): Node | undefined => {
  const lastChildrenNode = variableDeclarationListNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.SyntaxList) {
    const variableNode = getVariableNodeFromSyntaxList(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

const getVariableNodeFromParameterNode = (
  parameterNode: Node,
): Node | undefined => {
  const lastChildrenNode = parameterNode.getLastChild();

  if (lastChildrenNode?.getKind() === SyntaxKind.TypeReference) {
    const variableNode = getVariableNodeFromTypeReferenceNode(lastChildrenNode);

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

const getVariableNodeFromTypeReferenceNode = (
  typeReferenceNode: Node,
): Node | undefined => {
  const colonToken = typeReferenceNode.getPreviousSibling();

  if (colonToken?.getKind() === SyntaxKind.ColonToken) {
    const variableNode = getVariableNodeFromColonToken(colonToken);

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

const getVariableNodeFromEndOfFileToken = (
  endOfFileTokenNode: Node,
): Node | undefined => {
  const previousSiblingNode = endOfFileTokenNode.getPreviousSibling();

  if (previousSiblingNode?.getKind() === SyntaxKind.SyntaxList) {
    const variableNode = getVariableNodeFromSyntaxList(previousSiblingNode);

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

const getVariableNodeFromColonToken = (
  colonTokenNode: Node,
): Node | undefined => {
  const parent = colonTokenNode.getParent();
  if (!parent) {
    return undefined;
  }
  const parentKind = parent.getKind();
  if (
    parentKind !== SyntaxKind.VariableDeclaration &&
    parentKind !== SyntaxKind.PropertyDeclaration &&
    parentKind !== SyntaxKind.Parameter &&
    parentKind !== SyntaxKind.PropertySignature
  ) {
    return undefined;
  }
  const previousNode = colonTokenNode.getPreviousSibling();
  if (!previousNode || previousNode.getKind() !== SyntaxKind.Identifier) {
    return undefined;
  }
  return previousNode;
};

const getVariableNodeFromNewExpressionNode = (
  newExpressionNode: Node,
): Node | undefined => {
  const parent = newExpressionNode.getParent();
  if (!parent) {
    return undefined;
  }
  const parentKind = parent.getKind();
  if (parentKind !== SyntaxKind.VariableDeclaration) {
    return undefined;
  }
  const previousNode = newExpressionNode.getPreviousSibling();
  if (!previousNode || previousNode.getKind() !== SyntaxKind.EqualsToken) {
    return undefined;
  }

  const previousPreviousNode = previousNode.getPreviousSibling();
  if (
    !previousPreviousNode ||
    previousPreviousNode.getKind() !== SyntaxKind.Identifier
  ) {
    return undefined;
  }
  return previousPreviousNode;
};

const getVariableNode = (node: Node): Node | undefined => {
  const kind = node.getKind();
  if (kind === SyntaxKind.ColonToken) {
    return getVariableNodeFromColonToken(node);
  }
  // TODO: new Token case

  if (kind === SyntaxKind.EndOfFileToken) {
    const variableNode = getVariableNodeFromEndOfFileToken(node);

    if (variableNode) {
      return variableNode;
    }
  }

  const parentNode = node.getParent();

  if (parentNode?.getKind() === SyntaxKind.TypeReference) {
    const variableNode = getVariableNodeFromTypeReferenceNode(parentNode);

    if (variableNode) {
      return variableNode;
    }
  }

  const previousSiblingNode = node.getPreviousSibling();

  if (previousSiblingNode?.getKind() === SyntaxKind.SyntaxList) {
    const variableNode = getVariableNodeFromSyntaxList(previousSiblingNode);

    if (variableNode) {
      return variableNode;
    }
  }

  const grandparentNode = parentNode?.getParent();

  const grandparentPreviousSiblingNode =
    grandparentNode?.getParent() && grandparentNode?.getPreviousSibling();

  if (
    grandparentPreviousSiblingNode?.getKind() === SyntaxKind.VariableStatement
  ) {
    const variableNode = getVariableNodeFromVariableStatementNode(
      grandparentPreviousSiblingNode,
    );

    if (variableNode) {
      return variableNode;
    }
  }

  return undefined;
};

/**
 * Get cursor variable info from code and cursor position if exists, otherwise return undefined.
 * @param code code string
 * @param cursorPosition cursor position
 * @returns CursorVariableInfo  | undefined
 */
export const getCursorVariableInfo = (
  code: string,
  cursorPosition: number,
): CursorVariableInfo | undefined => {
  const nodeAtCursor = getNodeAtCursor(code, cursorPosition);
  if (!nodeAtCursor) {
    return undefined;
  }
  const variableNode = getVariableNode(nodeAtCursor);
  if (!variableNode) {
    return undefined;
  }
  const variableName = variableNode.getText();
  const variableStartsAt = variableNode.getStart();
  const variableEndsAt = variableNode.getEnd();

  if (nodeAtCursor.getKind() === SyntaxKind.ColonToken) {
    const cursorNodeEndsAt = nodeAtCursor.getEnd();
    const leadingSpaces = nodeAtCursor
      .getNextSibling()
      ?.getFullText()
      .startsWith(' ');
    const precedingCodeSegmentEndsAt =
      cursorNodeEndsAt + (leadingSpaces ? 1 : 0);
    const precedingCodeSegment = code.substring(
      variableEndsAt,
      precedingCodeSegmentEndsAt,
    );
    return {
      variableName,
      variableStartsAt,
      precedingCodeSegment,
    } as const;
  } else {
    const cursorNodeFullStartsAt = nodeAtCursor.getFullStart();
    const isLeadingSpaces = nodeAtCursor.getFullText().startsWith(' ');
    const precedingCodeSegmentEndsAt =
      cursorNodeFullStartsAt + (isLeadingSpaces ? 1 : 0);
    const precedingCodeSegment = code.substring(
      variableEndsAt,
      precedingCodeSegmentEndsAt,
    );
    return {
      variableName,
      variableStartsAt,
      precedingCodeSegment,
    } as const;
  }
};

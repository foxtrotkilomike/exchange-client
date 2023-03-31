const findTextNode = (textToFind: string) => {
  return (content: string, foundNode: Element | null): boolean => {
    if (foundNode === null) {
      return false;
    }

    const hasText = (node: Element) => node.textContent === textToFind;
    const hasNodeText = hasText(foundNode);
    /* to avoid returning more nodes than needed we are making sure
    that none of the children has the same text as its parent */
    const haveChildrenNodeText = Array.from(foundNode.children).some((child) =>
      hasText(child),
    );

    return hasNodeText && !haveChildrenNodeText;
  };
};

export default findTextNode;

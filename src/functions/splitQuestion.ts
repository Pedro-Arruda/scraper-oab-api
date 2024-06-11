export const splitQuestion = (questionWithAlternatives: string) => {
  const regex = /[A-D]\)\s+/;

  const splitAlternatives = questionWithAlternatives
    .split(regex)
    .map((q) => q.trim());

  return {
    question: splitAlternatives[0].replaceAll("\n", ""),
    alternativeA: splitAlternatives[1].replaceAll("\n", ""),
    alternativeB: splitAlternatives[2].replaceAll("\n", ""),
    alternativeC: splitAlternatives[3].replaceAll("\n", ""),
    alternativeD: splitAlternatives[4].replaceAll("\n", ""),
  };
};

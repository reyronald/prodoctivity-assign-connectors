// @flow

export function splitMatches(
  text: string,
  matches: number[]
): Array<{|
  str: string,
  isMatch: boolean
|}> {
  const result = [];
  for (let i = 0; i < text.length; i += 1) {
    const isMatch = i === matches[0];
    if (isMatch) {
      matches.shift();
    }

    const lastIndex = result.length - 1;
    if (lastIndex !== -1 && result[lastIndex].isMatch === isMatch) {
      result[lastIndex].str += text[i];
    } else {
      result.push({ str: text[i], isMatch });
    }
  }
  return result;
}

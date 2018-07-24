// @flow
import * as React from "react";
import { match } from "fuzzaldrin-plus";

function splitMatches(
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

export function highlightMathces(text: string, query: string): React.Node {
  if (!query) {
    return text;
  }

  const matches = match(text, query);
  const splitMatchesResult = splitMatches(text, matches);
  const result = splitMatchesResult.reduce((prev, curr) => {
    return (
      <React.Fragment>
        {prev}
        {curr.isMatch ? (
          <mark
            style={{
              padding: 0,
              fontWeight: 600,
              backgroundColor: "transparent"
            }}
          >
            {curr.str}
          </mark>
        ) : (
          curr.str
        )}
      </React.Fragment>
    );
  }, "");
  return result;
}

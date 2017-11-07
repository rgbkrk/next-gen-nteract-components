// @flow
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
  docco,
  dark,
  idea,
  rainbow
} from "react-syntax-highlighter/dist/styles";

type CellProps = {
  executionCount?: "*" | number | null,
  source: string,
  outputs: Array<Output>,
  className: string
};

type Output = any;

export const Cell = (
  { executionCount, source, outputs, className }: CellProps = {
    executionCount: null,
    source: "",
    outputs: [],
    className: "cell"
  }
) => {
  return (
    <div className={`cell ${className}`}>
      <div className="input-container">
        <div className="prompt">[{executionCount ? executionCount : " "}]</div>
        <div className="input">
          <SyntaxHighlighter
            language="python"
            style={idea}
            className="input"
            customStyle={{ padding: "10px 0px 10px 10px" }}
          >
            {source ? source : ""}
          </SyntaxHighlighter>
        </div>
      </div>
      <div>
        {outputs ? (
          <div className="outputs">
            {outputs.map(output => {
              switch (output.mimetype) {
                case "text/plain":
                  return <pre key={output.key}>{output.data}</pre>;
                case "text/html":
                  return <pre key={output.key}>html here</pre>;
                case "application/vdom.v1+json":
                  const { tagName, attributes, children } = output.data;
                  return React.createElement(tagName, attributes, children);
                default:
                  return null;
              }
            })}
          </div>
        ) : null}
      </div>
      <style jsx global>{``}</style>
      <style jsx>{`
        div {
          /* well this is neat, I can set the css variable inline */
          --actual-prompt-width: var(--prompt-width, 50px);
          --main-bg-color: white;
          --main-fg-color: rgb(51, 51, 51);
          --primary-border: #cbcbcb;
          --cell-bg: white;
          --cell-bg-hover: #eeedee;
          --cell-bg-focus: #e2dfe3;
        }

        .prompt {
          font-family: monospace;
          background-color: rgb(226, 223, 227);
          color: rgb(140, 138, 142);
          width: var(--actual-prompt-width);
          padding: 9px 0;
          text-align: center;
          flex: 0 0 auto;

          font-size: 14px;
          line-height: 20px;

          margin: 0 auto;
          padding: 10px 0px 10px 0px !important;
        }

        .cell {
          position: relative;
          background: var(--cell-bg);
          transition: all 0.1s ease-in-out;
        }

        .input {
          background-color: blue;
        }

        .input-container {
          display: flex;
          flex-direction: row;
          padding: 0px;
        }

        .cell:hover .prompt,
        .cell:active .prompt {
          background-color: var(--cell-bg-hover);
        }

        .cell:focus .prompt,
        .cell.focused .prompt {
          background-color: var(--cell-bg-focus);
        }

        .cell:hover {
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.12),
            -1px -1px 3px rgba(0, 0, 0, 0.12);
        }

        .cell.focused {
          box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.12),
            -3px -3px 9px rgba(0, 0, 0, 0.12);
        }

        .input {
          flex: 1 1 auto;
          overflow: auto;
          font-family: "Source Code Pro", monospace;
          background-color: rgb(250, 250, 250);
          font-size: 14px;
        }

        .input > :global(*) {
          padding: 0px;
          margin: 0px;
        }

        .outputs {
          padding: 10px 10px 10px calc(var(--actual-prompt-width) + 10px);
        }

        .outputs pre {
          white-space: pre-wrap;
          font-size: 14px;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

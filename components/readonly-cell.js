// @flow
import React from "react";

type CellProps = {
  executionCount?: "*" | number | null,
  source: string,
  outputs: Array<Output>
};

type Output = any;

export const Cell = (
  { executionCount, source, outputs }: CellProps = {
    executionCount: null,
    source: "",
    outputs: []
  }
) => {
  return (
    <div className="cell">
      <div className="input-container">
        <div className="prompt">[{executionCount ? executionCount : " "}]</div>
        <pre className="input">{source}</pre>
      </div>
      <div>
        {outputs ? (
          <div className="outputs">
            {outputs.map(output => {
              switch (output.mimetype) {
                case "text/plain":
                  return <pre>{output.data}</pre>;
                case "text/html":
                  return <pre>html here</pre>;
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
        pre {
          /* There are currently global styles that are overwriting <pre> to
          have terrible defaults, complete with their own !important */
          padding: 0px !important;
          box-shadow: none;
        }

        div {
          /* well this is neat, I can set the css variable inline */
          --prompt-width: 50px;
        }

        .cell {
          /* only for hover though */
          box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.12),
            -3px -3px 9px rgba(0, 0, 0, 0.12);

          position: relative;
          background: var(--cell-bg);
          transition: all 0.1s ease-in-out;
        }

        .input-container {
          display: flex;
          flex-direction: row;
          padding: 0px;
        }

        .input {
          flex: 1 1 auto;
          overflow: auto;
          font-family: "Source Code Pro", monospace;
          letter-spacing: 0.3px;
          word-spacing: 1px;
          background-color: rgb(250, 250, 250);
          font-size: 14px;
          line-height: 20px;

          position: relative;
          top: 0px;
          margin: 0 auto;
          padding: 10px 0px 10px 10px !important;
        }

        .outputs {
          padding: 10px 10px 10px calc(var(--prompt-width) + 10px);
        }

        .outputs pre {
          white-space: pre-wrap;
          font-size: 14px;
          word-wrap: break-word;
        }

        .prompt {
          font-family: monospace;
          background-color: rgb(226, 223, 227);
          color: rgb(140, 138, 142);
          width: var(--prompt-width);
          padding: 9px 0;
          text-align: center;
          flex: 0 0 auto;

          font-size: 14px;
          line-height: 20px;

          margin: 0 auto;
          padding: 10px 0px 10px 0px !important;
        }
      `}</style>
    </div>
  );
};

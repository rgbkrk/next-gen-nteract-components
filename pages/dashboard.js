// @flow
import React from "react";
import { notebook, Outputs } from "../components/composable/notebook";
import ReactMarkdown from "react-markdown";

export default () => (
  <div>
    <div className="grid">
      <header className="header full-width">
        <h1>Dashboard Demo</h1>
        <h2>Semi hokey implementation</h2>
      </header>
      {["abc", "gru", "gru", "abc"].map(cellID => {
        const cell = notebook.cells[cellID];

        return (
          <Outputs>
            {cell.type === "markdown" ? (
              <ReactMarkdown source={cell.code} />
            ) : (
              cell.outputs
            )}
          </Outputs>
        );
      })}
    </div>
    <style jsx>{`
      * {
        box-sizing: border-box;
      }

      .grid {
        width: 100%;
        display: grid;
        /* 2 columns left @ 164px wide - 1 column middle @ 1fr wide - 2 columns right @ 164px wide*/
        grid-template-columns: repeat(2, 1fr);
        /* set vertical and horizontal gutters at 20px*/
        grid-gap: 20px;
      }

      /* give all grid items color for demo purposes */
      .grid > :global(*) {
        font-family: "Source Sans Pro", Helvetica Neue, Helvetica, Arial,
          sans-serif;
      }

      .grid :global(div:nth-child(odd)) {
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .header {
        text-align: center;
      }

      h1,
      h2 {
        margin: 4px 0;
      }

      .middle-panel {
        grid-column: 3 / 4;
        grid-row: 2 / span 2;
        background: green !important;
        color: white;
        text-align: center;
      }

      .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
);

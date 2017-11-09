// @flow
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { idea } from "react-syntax-highlighter/dist/styles";

export const Output = () => <pre>I am output</pre>;

type OutputsProps = {
  children: React$Node,
  className?: string,
  hidden: boolean
};

export class Outputs extends React.Component<OutputsProps> {
  static defaultProps = {
    children: null,
    className: "outputs",
    hidden: false
  };

  render() {
    if (this.props.children) {
      return <div className={this.props.className}>{this.props.children}</div>;
    }
    return null;
  }
}

type PromptProps = {
  counter?: number | null,
  running?: boolean,
  queued?: boolean
};

// Totally fake component for consistency with indents of the editor area
class PromptBuffer extends React.Component<*> {
  render() {
    return null;
  }
}

class Prompt extends React.Component<PromptProps> {
  static defaultProps = {
    counter: null,
    running: false,
    queued: false
  };

  text = () => {
    if (this.props.running) {
      return "[*]";
    }
    if (this.props.queued) {
      return "[…]";
    }
    if (this.props.counter !== null && this.props.counter !== undefined) {
      return `[${this.props.counter}]`;
    }
    return "[ ]";
  };

  render() {
    return this.text();
  }
}

type EditorProps = {
  language: string,
  children: string | React$Element<any>,
  className?: string
};

class Editor extends React.Component<EditorProps> {
  static defaultProps = {
    children: "",
    language: "python",
    className: "input"
  };

  render() {
    if (typeof this.props.children === "string") {
      return (
        <SyntaxHighlighter
          style={idea}
          language={this.props.language}
          className={this.props.className}
          customStyle={{
            padding: "10px 0px 10px 10px",
            margin: "0px",
            backgroundColor: "var(--cm-background)"
          }}
        >
          {this.props.children}
        </SyntaxHighlighter>
      );
    }
    return this.props.children;
  }
}

type InputProps = {
  children: React$Node,
  hidden: boolean
};

class Input extends React.Component<InputProps> {
  static defaultProps = {
    children: null,
    hidden: false
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const children = React.Children.map(this.props.children, child => {
      if (!child) {
        return null;
      }
      switch (child.type) {
        case Prompt:
        case PromptBuffer:
          return <div className="prompt">{child}</div>;
        case Editor:
          return React.cloneElement(child, { className: "input" });
        default:
          return child;
      }
    });
    return <div className="input-container">{children}</div>;
  }
}

/* What sort of children do I care about for a Cell */

export const Cell = (props: { isSelected: boolean, children?: React$Node }) => {
  const children = React.Children.map(props.children, child => {
    if (!child) {
      return null;
    } else if (child.type === Outputs) {
      return React.cloneElement(child, { className: "outputs" });
    }
    return child;
  });

  return (
    <div className={`cell ${props.isSelected ? "focused" : ""}`}>
      <style jsx>{`
        div {
          /* well this is neat, I can set the css variable inline */
          --prompt-width: 50px;
          --main-bg-color: white;
          --main-fg-color: rgb(51, 51, 51);
          --primary-border: #cbcbcb;
          --cell-bg: white;
          --cell-bg-hover: #eeedee;
          --cell-bg-focus: #e2dfe3;
          --cm-background: #fafafa;
          --prompt-bg: var(--cm-background);
        }

        .cell {
          position: relative;
          background: var(--cell-bg);
          transition: all 0.1s ease-in-out;
        }

        .cell:hover {
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.12),
            -1px -1px 3px rgba(0, 0, 0, 0.12);
        }

        .cell.focused {
          box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.12),
            -3px -3px 9px rgba(0, 0, 0, 0.12);
        }

        .cell:hover :global(.prompt),
        .cell:active :global(.prompt) {
          background-color: var(--cell-bg-hover);
        }

        .cell:focus :global(.prompt),
        .cell.focused :global(.prompt) {
          background-color: var(--cell-bg-focus);
        }

        .cell :global(.outputs) {
          padding: 10px 10px 10px calc(var(--actual-prompt-width) + 10px);
        }

        .cell :global(.outputs pre) {
          white-space: pre-wrap;
          font-size: 14px;
          word-wrap: break-word;
        }

        .cell :global(.outputs) {
          word-wrap: break-word;
          padding: 10px 10px 10px calc(var(--prompt-width) + 10px);
          overflow-y: auto;
        }

        .cell :global(.outputs) > div:empty {
          display: none;
        }

        .cell :global(.input-container) {
          display: flex;
          flex-direction: row;
        }

        /**
         *  TODO: This styling is intended for when the input is hidden
         *  (dashboard / report mode). I'm not sure what it should be in this
         *  new setup
         */

        .cell :global(.input-container.invisible) {
          height: 34px;
        }

        .cell :global(.prompt) {
          font-family: monospace;
          font-size: 12px;

          width: var(--prompt-width);
          padding: 9px 0;

          text-align: center;

          color: var(--input-color);
          background-color: var(--prompt-bg);

          flex: 0 0 auto;
        }

        .cell :global(.input) {
          flex: 1 1 auto;
          overflow: auto;
          background-color: var(--cm-background);
        }
      `}</style>
      {children}
    </div>
  );
};

Cell.defaultProps = {
  isSelected: false,
  children: null
};

export const Notebook = (props: { children: React$Node, selected: string }) => {
  const children = React.Children.map(props.children, child =>
    React.cloneElement((child: React$Element<any>), {
      isSelected: child.props.id === props.selected
    })
  );
  return (
    <div className="cells">
      <style jsx>{`
        .cells > :global(*) {
          margin: 20px;
        }

        .cells {
          font-family: "Source Sans Pro", Helvetica Neue, Helvetica, Arial,
            sans-serif;
        }
      `}</style>
      {children}
    </div>
  );
};

type CodeCell = {|
  code: string,
  outputs: any,
  running: boolean,
  queued: boolean,
  type: "code",
  executionCount?: number | null
|};

type MarkdownCell = {|
  code: string,
  type: "markdown",
  mode: "edit" | "view"
|};

type CellData = MarkdownCell | CodeCell;

type Cells = {
  [string]: CellData
};

const cells: Cells = {
  md: {
    type: "markdown",
    code:
      "# Exploring the world of Harry Potter\nAs we explore the gringotts data, we should make sure to _document_ our observations, assumptions, etc.",
    mode: "view"
  },
  abc: {
    code: "from hogwarts import characters;\ndisplay(characters)",
    outputs: (
      <div>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>bio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>Regulus Arcturus Black</td>
              <td>Brother of Sirius. Used to be a Death Eater but defected.</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Sirius Black</td>
              <td>Best friend of James Potter and godfather of Harry.</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Lavender Brown</td>
              <td>
                Killed by a werewolf. She was a gryffindor student who dated
                Ron.{" "}
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Cho Chang</td>
              <td>
                Ravenclaw student who dated Cedric Diggory and Harry Potter.
              </td>
            </tr>
          </tbody>
        </table>
        <p>... 60 more entries</p>
        <style jsx>{`
          /* This is how you can tell this is a hokey demo */

          th {
            padding: 20px;
            text-align: left;
            vertical-align: middle;
            color: white;
            background-color: #111;
          }

          th:first-child {
            border-top-left-radius: 3px;
          }

          th:last-child {
            border-top-right-radius: 3px;
            border-right: none;
          }

          tr {
            font-weight: normal;
            background: #f8f8f8;
          }

          tr:hover td {
            background: #e7e7e7;
          }

          tr:first-child {
            border-top: none;
          }

          tr:last-child {
            border-bottom: none;
          }

          tr:nth-child(odd) td {
            background: #f0f0f0;
          }

          tr:nth-child(odd):hover td {
            background: #e7e7e7;
          }

          td {
            padding: 20px;
            text-align: left;
            vertical-align: middle;
          }
        `}</style>
      </div>
    ),
    running: false,
    queued: false,
    type: "code",
    executionCount: 0
  },
  bde: {
    code:
      "from gringotts import analyze_plots, harry_plotter\ndf = analyze_plots()",
    outputs: null,
    running: true,
    queued: false,
    type: "code",
    executionCount: null
  },
  gru: {
    code: "harry_plotter(df)",
    outputs: (
      <img src="http://i.dailymail.co.uk/i/pix/2016/07/08/00/360EA41C00000578-3679510-image-m-4_1467934667802.jpg" />
    ),
    running: false,
    queued: true,
    type: "code"
  },
  md2: {
    type: "markdown",
    code:
      "There is a _lot_ more data around Harry Potter I'd **love to explore**. This is it for now I think... ",
    mode: "edit"
  }
};

const cellOrder = ["md", "abc", "bde", "gru", "md2"];

export const notebook = {
  cells,
  cellOrder,
  selected: "abc"
};

export const Example = () => (
  <Notebook selected="bde">
    <Cell>
      <Input>
        <Prompt />
        <Editor>{"import wizardry\nwizardry.birthday()"}</Editor>
      </Input>
      <Outputs>
        <img
          src="https://i.ytimg.com/vi/YFNsRogBqb0/maxresdefault.jpg"
          width="200"
        />
        <h2>yer a wizard harry</h2>
      </Outputs>
    </Cell>

    {cellOrder.map(cellID => {
      const cell: CellData = cells[cellID];

      return (
        <Cell id={cellID} key={cellID}>
          {cell.type === "code" ||
          (cell.type === "markdown" && cell.mode === "edit") ? (
            <Input>
              {cell.type === "markdown" ? (
                <PromptBuffer />
              ) : (
                <Prompt
                  running={cell.running}
                  queued={cell.queued}
                  counter={cell.executionCount}
                />
              )}
              <Editor>
                <SyntaxHighlighter
                  style={idea}
                  language={cell.type === "markdown" ? "markdown" : "python"}
                  className={"input"}
                  customStyle={{
                    padding: "10px 0px 10px 10px",
                    margin: "0px",
                    backgroundColor: "var(--cm-background)"
                  }}
                >
                  {cell.code}
                </SyntaxHighlighter>
              </Editor>
            </Input>
          ) : null}
          <Outputs>
            {cell.type === "markdown" ? (
              <ReactMarkdown source={cell.code} />
            ) : (
              cell.outputs
            )}
          </Outputs>
        </Cell>
      );
    })}
  </Notebook>
);

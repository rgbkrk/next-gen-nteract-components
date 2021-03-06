// @flow
import React from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { idea } from "react-syntax-highlighter/dist/styles";

export const Output = () => <pre>I am output</pre>;

export type OutputsProps = {
  children: React$Node,
  hidden: boolean
};

export class Outputs extends React.Component<OutputsProps> {
  static defaultProps = {
    children: null,
    hidden: false
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    if (this.props.children) {
      return (
        <div className="outputs">
          {this.props.children}
          <style jsx>{`
            .outputs {
              padding: 10px 10px 10px calc(var(--prompt-width, 50px) + 10px);
              word-wrap: break-word;
              overflow-y: auto;
            }

            .outputs > :global(div:empty) {
              display: none;
            }

            .outputs :global(pre)) {
              white-space: pre-wrap;
              font-size: 14px;
              word-wrap: break-word;
            }
          `}</style>
        </div>
      );
    }

    return null;
  }
}
// Totally fake component for consistency with indents of the editor area
export class PromptBuffer extends React.Component<*> {
  render() {
    return <div className="prompt" />;
  }
}

export function promptText(props: PromptProps) {
  if (props.running) {
    return "[*]";
  }
  if (props.queued) {
    return "[…]";
  }
  if (typeof props.counter === "number") {
    return `[${props.counter}]`;
  }
  return "[ ]";
}

type PromptProps = {
  counter: number | null,
  running: boolean,
  queued: boolean
};

export class Prompt extends React.Component<PromptProps> {
  static defaultProps = {
    counter: null,
    running: false,
    queued: false
  };

  render() {
    return <div className="prompt">{promptText(this.props)}</div>;
  }
}

export type EditorProps = {
  language: string,
  children: string | React$Element<any>,
  className?: string
};

export class Editor extends React.Component<EditorProps> {
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

export type InputProps = {
  children: React$Node,
  hidden: boolean
};

export class Input extends React.Component<InputProps> {
  static defaultProps = {
    children: null,
    hidden: false
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <div className="input-container">
        {this.props.children}
        <style jsx>{`
          .input-container {
            display: flex;
            flex-direction: row;
          }

          .input-container.invisible {
            height: 34px;
          }

          .input-container :global(.prompt) {
            font-family: monospace;
            font-size: 12px;

            width: var(--prompt-width, 50px);
            padding: 9px 0;

            text-align: center;

            color: var(--input-color, black);
            background-color: var(--prompt-bg, #fafafa);

            flex: 0 0 auto;
          }

          .input-container :global(.input) {
            flex: 1 1 auto;
            overflow: auto;
            background-color: var(--cm-background, #fafafa);
          }
        `}</style>
      </div>
    );
  }
}

/* What sort of children do I care about for a Cell */

export const Cell = (props: { isSelected: boolean, children?: React$Node }) => {
  const children = props.children;
  return (
    <div className={`cell ${props.isSelected ? "focused" : ""}`}>
      <style jsx>{`
        .cell {
          position: relative;
          background: var(--cell-bg, white);
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
          background-color: var(--cell-bg-hover, #eeedee);
        }

        .cell:focus :global(.prompt),
        .cell.focused :global(.prompt) {
          background-color: var(--cell-bg-focus, #e2dfe3);
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

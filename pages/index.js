import {
  Example,
  Cell,
  Input,
  Prompt,
  Editor,
  Outputs
} from "../components/composable/notebook";

import SyntaxHighlighter from "react-syntax-highlighter";

import {
  agate,
  androidstudio,
  docco
} from "react-syntax-highlighter/dist/styles";

const cellText = `<Cell>
  <Input>
    <Prompt counter={11} />
    <Editor>{"import wizardry\nwizardry.birthday()"}</Editor>
  </Input>
  <Outputs>
    <img
    src="https://i.ytimg.com/vi/YFNsRogBqb0/maxresdefault.jpg"
    width="200"
    />
    <h2>yer a wizard harry</h2>
  </Outputs>
</Cell>`;

const ExampleCell = () => (
  <Cell>
    <Input>
      <Prompt counter={11} />
      <Editor>{"import wizardry\nwizardry.birthday()"}</Editor>
    </Input>
    <Outputs>
      <img
        src="https://i.ytimg.com/vi/YFNsRogBqb0/maxresdefault.jpg"
        width="200"
      />
      <h2>yer a wizard harry</h2>
    </Outputs>
    {/* WTF, how is color being set to white when this is a separate
      component in the eyes of styled-jsx */}
    <style jsx>{`color: black;`}</style>
  </Cell>
);

export default () => (
  <div className="root">
    <Example />
    <div className="explainer">
      <h1>On the left is a notebook</h1>
      <p>It was built with compound components like this</p>
      <SyntaxHighlighter style={agate}>{cellText}</SyntaxHighlighter>
      <p>The result of which is this component</p>
      <ExampleCell />
      <p>Neat, huh?</p>
    </div>
    <style jsx>{`
      .root {
        display: flex;
      }
      .root > :global(.cells) {
        width: 50%;
      }
      .explainer {
        background-color: black;
        color: white;
        flex: 1;
        font-family: "Source Sans Pro", Helvetica Neue, Helvetica, Arial,
          sans-serif;
        padding: 20px;
        border-left: 1px solid #e7e7e7;
      }
    `}</style>
  </div>
);

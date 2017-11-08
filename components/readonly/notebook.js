import { Cell } from "./cell";

export const Notebook = () => (
  <div className="root">
    <style jsx>{`
      .cells > :global(*) {
        margin: 20px;
      }

      .cells {
        font-family: "Source Sans Pro", Helvetica Neue, Helvetica, Arial,
          sans-serif;
      }
    `}</style>

    <div className="cells">
      <h1>This isn't a live notebook</h1>
      <Cell
        source="print('hello')"
        outputs={[{ mimetype: "text/plain", data: "hello", key: "1234" }]}
        className="focused"
      />
      <p>It's mostly here to make an example notebook layout</p>
      <Cell
        source={`from vdom import h1\nh1("👌🏻")`}
        outputs={[
          {
            mimetype: "application/vdom.v1+json",
            data: {
              tagName: "h1",
              children: "👌🏻",
              attributes: {}
            },
            key: "2345"
          }
        ]}
      />
      <div>
        <p>Code can be interspersed with "markdown"</p>
      </div>
      <Cell />
    </div>
  </div>
);

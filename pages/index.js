import { Cell } from "../components/readonly-cell";

export default () => (
  <div className="root">
    <style jsx>{`
      .cells > :global(.cell) {
        margin: 20px;
      }
    `}</style>

    <div className="cells">
      <Cell
        source="print('hello')"
        outputs={[{ mimetype: "text/plain", data: "hello", key: "1234" }]}
      />
      <Cell
        source={`from vdom import h1\nh1("👌🏻")`}
        outputs={[
          {
            mimetype: "application/vdom.v1+json",
            data: {
              tagName: "h1",
              children: "👌🏻",
              attributes: {}
            }
          }
        ]}
      />
      <Cell />
    </div>
  </div>
);

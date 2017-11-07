import { Cell } from "../components/readonly-cell";

export default () => (
  <div className="cells">
    <style jsx>{`
      .cells > :global(*) {
        margin: 20px;
      }
    `}</style>
    <Cell />
    <Cell />
    <Cell />
    <Cell />
    <Cell />
  </div>
);

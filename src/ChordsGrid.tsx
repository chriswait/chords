import { CARD_STYLE, SPACING } from "./util";

const ChordsGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        ...CARD_STYLE,
        margin: SPACING * 2,
        padding: SPACING * 2,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gridAutoRows: "auto",
        columnGap: SPACING * 2,
        rowGap: SPACING * 4,
      }}
    >
      {children}
    </div>
  );
};

export default ChordsGrid;

import { CARD_STYLE, SPACING } from "./util";

const ChordsGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        ...CARD_STYLE,
        padding: SPACING * 2,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 280px))",
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

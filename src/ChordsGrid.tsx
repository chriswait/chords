import useBreakpoint from "use-breakpoint";
import { BREAKPOINTS, CARD_STYLE, SPACING } from "./util";

const ChordsGrid = ({ children }: { children: React.ReactNode }) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "xl");
  return (
    <div
      style={{
        ...CARD_STYLE,
        margin: SPACING * 2,
        padding: SPACING * 2,
        display: "grid",
        gridTemplateColumns: `repeat(${
          breakpoint === "xs"
            ? 1
            : breakpoint === "sm"
            ? 2
            : breakpoint === "md"
            ? 3
            : breakpoint === "lg"
            ? 4
            : 6
        }, 1fr)`,
        gap: SPACING * 2,
      }}
    >
      {children}
    </div>
  );
};

export default ChordsGrid;

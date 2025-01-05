import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { COLORS, RADIUS, SPACING } from "./util";

type MyButtonType = {
  isSelected?: boolean;
  secondary?: boolean;
  text?: boolean;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const BUTTON_STYLE = {
  paddingLeft: SPACING,
  paddingRight: SPACING,
  paddingTop: SPACING / 2,
  paddingBottom: SPACING / 2,
  borderRadius: RADIUS,
  fontSize: 20,
  border: "none",
  outline: "none",
  cursor: "pointer",
};

const SELECTED_STYLE = {
  fontWeight: "bold",
};

const Button = ({
  style,
  isSelected = false,
  secondary = false,
  text = false,
  ...rest
}: MyButtonType) => {
  const computedStyle = rest.disabled
    ? {
        backgroundColor: "#ffdace",
        color: "grey",
      }
    : isSelected
    ? {
        backgroundColor: "rgb(240 98 60)",
        color: "white",
      }
    : secondary
    ? {
        backgroundColor: "#4c4e99",
        color: "white",
      }
    : text
    ? {}
    : {
        backgroundColor: "#ffbda8",
        color: COLORS.text,
      };

  return (
    <button
      type="button"
      style={{
        ...BUTTON_STYLE,
        ...(isSelected ? SELECTED_STYLE : {}),
        ...computedStyle,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Button;

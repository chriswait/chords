import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { COLORS, RADIUS, SPACING } from "./util";

type MyButtonType = { isSelected?: boolean } & DetailedHTMLProps<
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
};

const SELECTED_STYLE = {
  fontWeight: "bold",
};

const Button = ({ style, isSelected = false, ...rest }: MyButtonType) => {
  const backgroundColor = rest.disabled
    ? "#ffdace"
    : isSelected
    ? "rgb(240 98 60)"
    : "#ffbda8";
  const color = rest.disabled ? "grey" : isSelected ? "white" : COLORS.text;

  return (
    <button
      type="button"
      style={{
        ...BUTTON_STYLE,
        ...(isSelected ? SELECTED_STYLE : {}),
        backgroundColor,
        color,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Button;

// components/MyButton.tsx
import React from "react";
import { Button as PaperButton, ButtonProps } from "react-native-paper";

interface MyButtonProps extends ButtonProps {
  // custom props if needed
}

export default function MyButton({
  mode = "contained",
  buttonColor = "#7F3DFF", // purple
  labelStyle = { color: "#fff" },
  style,
  ...rest
}: MyButtonProps) {
  return (
    <PaperButton
      mode={mode}
      buttonColor={buttonColor}
      labelStyle={labelStyle}
      style={[{ marginVertical: 6 }, style]}
      {...rest}
    />
  );
}

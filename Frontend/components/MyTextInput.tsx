// components/MyTextInput.tsx
import React from "react";
import {
  TextInput as PaperTextInput,
  TextInputProps,
} from "react-native-paper";

interface MyTextInputProps extends TextInputProps {
  // You can add custom props if needed
}

export default function MyTextInput({
  mode = "outlined",
  outlineColor = "#ccc",
  activeOutlineColor = "#7F3DFF", // your purple accent
  style,
  ...rest
}: MyTextInputProps) {
  return (
    <PaperTextInput
      mode={mode}
      outlineColor={outlineColor}
      activeOutlineColor={activeOutlineColor}
      style={[{ marginBottom: 12 }, style]}
      {...rest}
    />
  );
}

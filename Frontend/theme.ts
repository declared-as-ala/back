// theme.ts
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    secondary: "#FF6B6B", // Custom accent replacement (red-ish)
  },
};

export const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    secondary: "#FF6B6B",
  },
};

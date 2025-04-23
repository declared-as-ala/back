import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    secondary: "#FF6B6B", // custom accent replacement
  },
};

export const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    secondary: "#FF6B6B",
  },
};

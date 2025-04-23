// constants/theme.ts
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#7F3DFF",
    background: "#F8F9FB",
    surface: "#fff",
    text: "#1E1E1E",
    onSurface: "#000",
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#BB86FC",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#fff",
    onSurface: "#fff",
  },
};

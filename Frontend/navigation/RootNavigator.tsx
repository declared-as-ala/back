import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppStore } from "../store";
import AuthNavigator from "./AuthNavigator";
import DrawerNavigator from "./DrawerNavigator";

export default function RootNavigator() {
  const token = useAppStore((state) => state.token);

  return <>{token ? <DrawerNavigator /> : <AuthNavigator />}</>;
}

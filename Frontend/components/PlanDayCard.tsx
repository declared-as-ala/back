import React from "react";
import { TouchableOpacity } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

interface Props {
  day: string;
  preview?: string;
  onPress: () => void;
}

export const PlanDayCard = ({ day, preview, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={{ marginVertical: 8, borderRadius: 10, elevation: 3 }}>
      <Card.Title
        title={day}
        titleStyle={{ color: "#7c3aed" }}
        left={(props) => <IconButton {...props} icon="calendar" />}
      />
      <Card.Content>
        <Text>{preview ? preview : "Tap to view workout"}</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

// components/DayCard.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { ExerciseDetail } from "@/app/types";
import { StyleSheet } from "react-native";
type Props = {
  day: string;
  exercises: ExerciseDetail[];
  onPress: () => void;
};

const DayCard: React.FC<Props> = ({ day, exercises, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.card}>
      <Card.Title
        title={day}
        titleStyle={styles.title}
        left={(props) => <IconButton {...props} icon="calendar" />}
      />
      <Card.Content>
        <Text>{exercises[0]?.exercise || "Tap to view"}</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    color: "#7c3aed",
  },
});

export default DayCard;

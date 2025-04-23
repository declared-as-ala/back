import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";

type Props = {
  steps: number;
  calories: number;
};

const TodayStatsCard: React.FC<Props> = ({ steps, calories }) => (
  <Card style={styles.card}>
    <Card.Title
      title="Today's Activity"
      left={(props) => <Avatar.Icon {...props} icon="walk" />}
      titleStyle={styles.title}
    />
    <Card.Content>
      <Text>Steps: {steps}</Text>
      <Text>Calories Burned: {calories.toFixed(0)} kcal</Text>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { marginVertical: 8, backgroundColor: "#fff", borderRadius: 12 },
  title: { color: "#7F3DFF" },
});

export default TodayStatsCard;

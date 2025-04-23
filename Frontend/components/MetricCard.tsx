import React from "react";
import { StyleSheet } from "react-native";
import { Card, Avatar, Paragraph, useTheme } from "react-native-paper";

interface Props {
  icon: string;
  label: string;
  value: string;
}

export default function MetricCard({ icon, label, value }: Props) {
  const theme = useTheme();
  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Title
        title={label}
        left={(props) => <Avatar.Icon {...props} icon={icon} />}
        titleStyle={styles.title}
      />
      <Card.Content>
        <Paragraph style={styles.value}>{value}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 8,
  },
});

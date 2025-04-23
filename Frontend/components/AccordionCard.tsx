import React, { ReactNode, useState } from "react";
import { Card, IconButton, List } from "react-native-paper";

interface Props {
  title: string;
  icon: string;
  children: ReactNode;
  bg?: string; // optional tint
}

export default function AccordionCard({
  title,
  icon,
  children,
  bg = "#FFFFFF",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      style={{
        marginVertical: 8,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: bg,
      }}
    >
      <List.Accordion
        title={title}
        expanded={open}
        onPress={() => setOpen(!open)}
        left={(p) => <IconButton {...p} icon={icon} />}
        titleStyle={{ fontWeight: "600" }}
        style={{ paddingRight: 8 }}
      >
        <Card.Content style={{ paddingBottom: 12 }}>{children}</Card.Content>
      </List.Accordion>
    </Card>
  );
}

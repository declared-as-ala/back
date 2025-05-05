// src/components/PlanSections.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import AccordionCard from "@/components/AccordionCard";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface PlanSectionsProps {
  equipment: string[];
  recommendation: string;
  diet?: string;
}

const PlanSections: React.FC<PlanSectionsProps> = ({
  equipment,
  recommendation,
  diet,
}) => {
  const { theme } = useAppStore();
  const t = themes[theme];

  return (
    <View style={styles.container}>
      <AccordionCard title="Equipment" icon="dumbbell" bg={t.card}>
        <View style={styles.wrap}>
          {equipment.map((eq, i) => (
            <Chip key={i} style={styles.chip}>
              {eq}
            </Chip>
          ))}
        </View>
      </AccordionCard>

      <AccordionCard
        title="Recommendation"
        icon="lightbulb-on-outline"
        bg={t.card}
      >
        <Text style={styles.text}>{recommendation}</Text>
      </AccordionCard>

      {diet && (
        <AccordionCard title="Diet" icon="food-apple-outline" bg={t.card}>
          <View style={styles.wrap}>
            {diet
              .split(/[,;()]/)
              .map((d, i) => d.trim())
              .filter(Boolean)
              .map((d, i) => (
                <Chip key={i} icon="leaf" style={styles.chip}>
                  {d}
                </Chip>
              ))}
          </View>
        </AccordionCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { marginVertical: 2 },
  text: { lineHeight: 22 },
});

export default React.memo(PlanSections);

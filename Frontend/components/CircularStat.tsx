// components/CircularStat.tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularStatProps {
  label: string;
  value: number;
  unit: string;
  ratio: number; // between 0 and 1
  size?: number; // defaults to 100
  strokeWidth?: number; // defaults to 10
  color: string; // progress color
}

export default function CircularStat({
  label,
  value,
  unit,
  ratio,
  size = 100,
  strokeWidth = 10,
  color,
}: CircularStatProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);

  return (
    <View style={{ width: size, alignItems: "center" }}>
      <View style={{ width: size, height: size, position: "relative" }}>
        <Svg width={size} height={size}>
          {/* background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* progress arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* center text */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.unitText}>{unit}</Text>
        </View>
      </View>

      {/* label underneath */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  unitText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
  },
});

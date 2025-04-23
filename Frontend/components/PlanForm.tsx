// components/PlanForm.tsx
import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button } from "react-native-paper";

export type FormState = {
  sex: string;
  age: string;
  height: string;
  weight: string;
  bmi: string;
  level: string;
  goal: string;
  days: string;
  hypertension: string;
  diabetes: string;
};

type Props = {
  values: FormState;
  /** change *any* field */
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  /** called when the user presses *Generate plan* */
  onSubmit: () => void;
};

const PlanForm: React.FC<Props> = ({ values, onChange, onSubmit }) => (
  <View>
    {(Object.keys(values) as (keyof FormState)[]).map((k) => (
      <TextInput
        key={k}
        style={styles.input}
        placeholder={k}
        value={values[k]}
        onChangeText={(t) => onChange(k, t)}
      />
    ))}
    <Button mode="contained" onPress={onSubmit} style={{ marginTop: 12 }}>
      Generate plan
    </Button>
  </View>
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f3e8ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderColor: "#c084fc",
    borderWidth: 1,
  },
});

export default PlanForm;

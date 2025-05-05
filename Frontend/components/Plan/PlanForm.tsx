import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

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
  onChange: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onSubmit: () => void;
};

const PlanForm: React.FC<Props> = ({ values, onChange, onSubmit }) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: t.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {(Object.keys(values) as (keyof FormState)[]).map((k) => (
          <TextInput
            key={k}
            style={[
              styles.input,
              {
                backgroundColor: t.inputBg,
                borderColor: t.primary,
                color: t.textPrimary,
              },
            ]}
            placeholder={k}
            placeholderTextColor={t.textSecondary}
            value={values[k]}
            onChangeText={(v) => onChange(k, v)}
          />
        ))}
        <Button
          mode="contained"
          onPress={onSubmit}
          contentStyle={styles.buttonContent}
          style={[styles.button, { backgroundColor: t.primary }]}
        >
          Generate Plan
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  button: { marginTop: 16, borderRadius: 24 },
  buttonContent: { height: 44 },
});
export default React.memo(PlanForm);

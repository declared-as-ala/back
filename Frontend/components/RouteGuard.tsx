// components/RouteGuard.tsx
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAppStore } from "@/store";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const segments = useSegments();
  const token = useAppStore((state) => state.token);

  const isAuthPage = segments[0] === "screens" && segments[1] === "auth";

  useEffect(() => {
    // 🚫 إذا لم يكن هناك توكن، لا تدخل إلى drawer أو أي صفحات محمية
    if (!token && !isAuthPage && segments[0] !== null) {
      router.replace("/");
    }

    // ✅ إذا هناك توكن، لا تدخل إلى login/signup
    if (token && isAuthPage) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [segments, token]);

  return children;
}

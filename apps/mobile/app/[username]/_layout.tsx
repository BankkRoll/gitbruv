import { Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";

export default function UserLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#111827" : "#ffffff",
        },
        headerTintColor: isDark ? "#f9fafb" : "#111827",
        headerBackTitle: "Back",
      }}
    />
  );
}

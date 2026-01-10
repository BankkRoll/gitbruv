import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession, signOut } from "@/lib/auth-client";
import { api, type RepositoryWithStars } from "@/lib/api";

export default function ProfileScreen() {
  const { data: session, isPending } = useSession();
  const [repos, setRepos] = useState<RepositoryWithStars[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserRepos();
    }
  }, [session?.user]);

  const fetchUserRepos = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const data = await api.repositories.getUserRepos(
        (session.user as { username?: string }).username || ""
      );
      setRepos(data.repos);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!session?.user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <View className="items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <FontAwesome name="user" size={40} color="#6b7280" />
          </View>
          <Text className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Not signed in
          </Text>
          <Text className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Sign in to view your profile and repositories
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable className="rounded-lg bg-blue-600 px-6 py-3 active:bg-blue-700">
              <Text className="font-medium text-white">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  const user = session.user as {
    name?: string;
    email?: string;
    username?: string;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="items-center border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <FontAwesome name="user" size={48} color="#6b7280" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">
          {user.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          @{user.username}
        </Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          {user.email}
        </Text>
      </View>

      <View className="p-4">
        <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Your Repositories
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#2563eb" />
        ) : repos.length === 0 ? (
          <View className="rounded-xl bg-white p-6 dark:bg-gray-800">
            <Text className="text-center text-gray-600 dark:text-gray-400">
              You haven't created any repositories yet
            </Text>
          </View>
        ) : (
          repos.map((repo) => (
            <Link
              key={repo.id}
              href={`/${user.username}/${repo.name}`}
              asChild
            >
              <Pressable className="mb-3 rounded-xl bg-white p-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {repo.name}
                      </Text>
                      <View
                        className={`ml-2 rounded px-2 py-0.5 ${repo.visibility === "private" ? "bg-yellow-100" : "bg-green-100"}`}
                      >
                        <Text
                          className={`text-xs ${repo.visibility === "private" ? "text-yellow-800" : "text-green-800"}`}
                        >
                          {repo.visibility}
                        </Text>
                      </View>
                    </View>
                    {repo.description && (
                      <Text
                        className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                        numberOfLines={1}
                      >
                        {repo.description}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <FontAwesome name="star" size={14} color="#eab308" />
                    <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      {repo.starCount}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))
        )}
      </View>

      <View className="p-4 pt-0">
        <Pressable
          onPress={handleSignOut}
          className="rounded-xl bg-red-50 p-4 active:bg-red-100 dark:bg-red-900/20 dark:active:bg-red-900/30"
        >
          <View className="flex-row items-center justify-center">
            <FontAwesome name="sign-out" size={18} color="#dc2626" />
            <Text className="ml-2 font-medium text-red-600">Sign Out</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

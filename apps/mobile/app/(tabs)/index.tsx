import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession } from "@/lib/auth-client";
import { api, type RepositoryWithStars } from "@/lib/api";

export default function HomeScreen() {
  const { data: session, isPending } = useSession();
  const [repos, setRepos] = useState<RepositoryWithStars[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRepos = async () => {
    try {
      const data = await api.repositories.getPublic("updated", 10);
      setRepos(data.repos);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRepos();
  };

  if (isPending || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {session?.user ? (
          <View className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome back, {session.user.name}!
            </Text>
            <Text className="mt-1 text-gray-600 dark:text-gray-400">
              Check out the latest repositories below
            </Text>
          </View>
        ) : (
          <View className="mb-6 rounded-xl bg-blue-600 p-4">
            <Text className="text-lg font-semibold text-white">
              Welcome to GitBruv
            </Text>
            <Text className="mt-1 text-blue-100">
              Sign in to start exploring and creating repositories
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable className="mt-3 rounded-lg bg-white px-4 py-2 active:bg-gray-100">
                <Text className="text-center font-medium text-blue-600">
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        )}

        <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Recent Repositories
        </Text>

        {repos.length === 0 ? (
          <View className="rounded-xl bg-white p-6 dark:bg-gray-800">
            <Text className="text-center text-gray-600 dark:text-gray-400">
              No repositories found
            </Text>
          </View>
        ) : (
          repos.map((repo) => (
            <Link
              key={repo.id}
              href={`/${repo.owner.username}/${repo.name}`}
              asChild
            >
              <Pressable className="mb-3 rounded-xl bg-white p-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700">
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <FontAwesome
                      name="code-fork"
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {repo.owner.username}/{repo.name}
                    </Text>
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
    </ScrollView>
  );
}

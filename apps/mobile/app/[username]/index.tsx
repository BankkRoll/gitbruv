import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Link, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { api, type UserProfile, type RepositoryWithStars } from "@/lib/api";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<RepositoryWithStars[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!username) return;
    try {
      const [userData, reposData] = await Promise.all([
        api.users.getProfile(username),
        api.repositories.getUserRepos(username),
      ]);
      setUser(userData);
      setRepos(reposData.repos);
      setError(null);
    } catch (err) {
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <FontAwesome name="exclamation-circle" size={48} color="#dc2626" />
        <Text className="mt-4 text-lg text-gray-900 dark:text-white">
          {error || "User not found"}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: user.name }} />
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          {user.bio && (
            <Text className="mt-3 text-center text-gray-600 dark:text-gray-400">
              {user.bio}
            </Text>
          )}
          <View className="mt-4 flex-row flex-wrap justify-center gap-4">
            {user.location && (
              <View className="flex-row items-center">
                <FontAwesome name="map-marker" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {user.location}
                </Text>
              </View>
            )}
            {user.website && (
              <View className="flex-row items-center">
                <FontAwesome name="link" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-blue-600">
                  {user.website}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="p-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Repositories ({repos.length})
          </Text>

          {repos.length === 0 ? (
            <View className="rounded-xl bg-white p-6 dark:bg-gray-800">
              <Text className="text-center text-gray-600 dark:text-gray-400">
                No public repositories
              </Text>
            </View>
          ) : (
            repos.map((repo) => (
              <Link
                key={repo.id}
                href={`/${username}/${repo.name}`}
                asChild
              >
                <Pressable className="mb-3 rounded-xl bg-white p-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {repo.name}
                      </Text>
                      {repo.description && (
                        <Text
                          className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                          numberOfLines={2}
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
    </>
  );
}

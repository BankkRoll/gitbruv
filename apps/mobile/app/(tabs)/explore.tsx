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
import { api, type RepositoryWithStars, type PublicUser } from "@/lib/api";

type SortOption = "stars" | "updated" | "created";

export default function ExploreScreen() {
  const [repos, setRepos] = useState<RepositoryWithStars[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [tab, setTab] = useState<"repos" | "users">("repos");

  const fetchData = async () => {
    try {
      const [reposData, usersData] = await Promise.all([
        api.repositories.getPublic(sortBy, 20),
        api.users.getPublic("newest", 20),
      ]);
      setRepos(reposData.repos);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortBy]);

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

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Pressable
          onPress={() => setTab("repos")}
          className={`flex-1 px-4 py-3 ${tab === "repos" ? "border-b-2 border-blue-600" : ""}`}
        >
          <Text
            className={`text-center font-medium ${tab === "repos" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
          >
            Repositories
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("users")}
          className={`flex-1 px-4 py-3 ${tab === "users" ? "border-b-2 border-blue-600" : ""}`}
        >
          <Text
            className={`text-center font-medium ${tab === "users" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
          >
            Users
          </Text>
        </Pressable>
      </View>

      {tab === "repos" && (
        <View className="flex-row gap-2 p-4">
          {(["stars", "updated", "created"] as SortOption[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setSortBy(option)}
              className={`rounded-full px-3 py-1.5 ${sortBy === option ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <Text
                className={`text-sm font-medium ${sortBy === option ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 pt-0">
          {tab === "repos" ? (
            repos.map((repo) => (
              <Link
                key={repo.id}
                href={`/${repo.owner.username}/${repo.name}`}
                asChild
              >
                <Pressable className="mb-3 rounded-xl bg-white p-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700">
                  <View className="flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <FontAwesome name="code-fork" size={20} color="#6b7280" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {repo.owner.username}/{repo.name}
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
          ) : (
            users.map((user) => (
              <Link key={user.id} href={`/${user.username}`} asChild>
                <Pressable className="mb-3 rounded-xl bg-white p-4 active:bg-gray-50 dark:bg-gray-800 dark:active:bg-gray-700">
                  <View className="flex-row items-center">
                    <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <FontAwesome name="user" size={24} color="#6b7280" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        @{user.username}
                      </Text>
                      {user.bio && (
                        <Text
                          className="mt-1 text-sm text-gray-500 dark:text-gray-500"
                          numberOfLines={1}
                        >
                          {user.bio}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center">
                      <FontAwesome name="code-fork" size={14} color="#6b7280" />
                      <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {user.repoCount}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

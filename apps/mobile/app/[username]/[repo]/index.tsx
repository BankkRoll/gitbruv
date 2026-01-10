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
import { api, type RepoPageData, type FileEntry } from "@/lib/api";

export default function RepositoryScreen() {
  const { username, repo } = useLocalSearchParams<{
    username: string;
    repo: string;
  }>();
  const [data, setData] = useState<RepoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starring, setStarring] = useState(false);

  const fetchData = async () => {
    if (!username || !repo) return;
    try {
      const pageData = await api.repositories.getPageData(username, repo);
      setData(pageData);
      setError(null);
    } catch (err) {
      setError("Failed to load repository");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username, repo]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleStar = async () => {
    if (!data) return;
    setStarring(true);
    try {
      const result = await api.repositories.toggleStar(data.repo.id);
      setData({
        ...data,
        repo: {
          ...data.repo,
          starred: result.starred,
          starCount: result.starred
            ? data.repo.starCount + 1
            : data.repo.starCount - 1,
        },
      });
    } catch (err) {
      console.error("Failed to star:", err);
    } finally {
      setStarring(false);
    }
  };

  const getFileIcon = (file: FileEntry) => {
    if (file.type === "tree") return "folder";
    const ext = file.name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return "file-code-o";
      case "md":
        return "file-text-o";
      case "json":
        return "file-o";
      default:
        return "file-o";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <FontAwesome name="exclamation-circle" size={48} color="#dc2626" />
        <Text className="mt-4 text-lg text-gray-900 dark:text-white">
          {error || "Repository not found"}
        </Text>
      </View>
    );
  }

  const sortedFiles = [...data.files].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "tree" ? -1 : 1;
  });

  return (
    <>
      <Stack.Screen options={{ title: data.repo.name }} />
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <View className="flex-row items-center">
            <Link href={`/${username}`} asChild>
              <Pressable>
                <Text className="text-blue-600">{username}</Text>
              </Pressable>
            </Link>
            <Text className="mx-1 text-gray-400">/</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">
              {data.repo.name}
            </Text>
            <View
              className={`ml-2 rounded px-2 py-0.5 ${data.repo.visibility === "private" ? "bg-yellow-100" : "bg-green-100"}`}
            >
              <Text
                className={`text-xs ${data.repo.visibility === "private" ? "text-yellow-800" : "text-green-800"}`}
              >
                {data.repo.visibility}
              </Text>
            </View>
          </View>

          {data.repo.description && (
            <Text className="mt-2 text-gray-600 dark:text-gray-400">
              {data.repo.description}
            </Text>
          )}

          <View className="mt-4 flex-row gap-3">
            <Pressable
              onPress={handleStar}
              disabled={starring}
              className={`flex-row items-center rounded-lg px-4 py-2 ${
                data.repo.starred
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <FontAwesome
                name={data.repo.starred ? "star" : "star-o"}
                size={16}
                color={data.repo.starred ? "#eab308" : "#6b7280"}
              />
              <Text
                className={`ml-2 font-medium ${
                  data.repo.starred
                    ? "text-yellow-800 dark:text-yellow-200"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {data.repo.starCount}
              </Text>
            </Pressable>

            <View className="flex-row items-center rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
              <FontAwesome name="code-fork" size={16} color="#6b7280" />
              <Text className="ml-2 text-gray-700 dark:text-gray-300">
                {data.repo.defaultBranch}
              </Text>
            </View>
          </View>
        </View>

        <View className="p-4">
          {data.isEmpty ? (
            <View className="rounded-xl bg-white p-6 dark:bg-gray-800">
              <Text className="text-center text-gray-600 dark:text-gray-400">
                This repository is empty
              </Text>
            </View>
          ) : (
            <View className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
              {sortedFiles.map((file, index) => (
                <Pressable
                  key={file.oid}
                  className={`flex-row items-center px-4 py-3 active:bg-gray-50 dark:active:bg-gray-700 ${
                    index < sortedFiles.length - 1
                      ? "border-b border-gray-100 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <FontAwesome
                    name={getFileIcon(file)}
                    size={16}
                    color={file.type === "tree" ? "#3b82f6" : "#6b7280"}
                  />
                  <Text className="ml-3 flex-1 text-gray-900 dark:text-white">
                    {file.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

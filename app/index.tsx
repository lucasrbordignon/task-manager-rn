import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import TaskItem from "../components/TaskItem";
import { getData, storeData } from "../utils/storage";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const statusBarHeight = Constants.statusBarHeight

const Index: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    storeData("tasks", tasks);
  }, [tasks]);

  const loadTasks = async () => {
    const savedTasks = await getData("tasks");
    if (savedTasks) setTasks(savedTasks);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), title: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <View className="flex-1 p-6 bg-gray-100" style={{ marginTop: statusBarHeight + 8}}>
      <Text className="text-3xl font-extrabold text-blue-600 text-center mb-6">
        Task Manager
      </Text>

      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 p-3 border border-gray-300 rounded-l-lg bg-white text-gray-800 placeholder-gray-400"
          placeholder="Add a new task"
          placeholderTextColor="#9CA3AF"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity
          onPress={addTask}
          className="bg-blue-500 px-4 rounded-r-lg flex justify-center"
        >
          <Text className="text-white font-semibold">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mb-4">
        <TouchableOpacity
          onPress={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${
            filter === "all" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold">All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md ${
            filter === "completed" ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold">Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("pending")}
          className={`px-4 py-2 rounded-md ${
            filter === "pending" ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-semibold">Pending</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
      />

      {filteredTasks.length === 0 && (
        <Text className="text-center text-gray-500 mt-4">
          No tasks available. Start by adding a task!
        </Text>
      )}
    </View>
  );
};

export default Index;

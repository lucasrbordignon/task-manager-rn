import { Task } from "@/app";
import React from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";
import { CheckCircleIcon, TrashIcon } from "react-native-heroicons/solid";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <Animated.View
      className={`flex-row items-center justify-between p-4 mb-4 rounded-xl shadow-lg`}
    >
      <View
        className="flex flex-col justify-center rounded-lg"
      >
        {task.completed && <CheckCircleIcon size={20} color={'green'} />}
      </View>

      <Pressable
        onPress={() => onToggle(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Mark "${task.title}" as ${
          task.completed ? "pending" : "completed"
        }`}
        className="flex flex-col justify-center flex-1"
      >
        <Text
          className={`font-semibold ${
            task.completed ? "text-gray-500 line-through" : "text-gray-800"
          }`}
        >
          {task.title}
        </Text>
        
      </Pressable>

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete task: "${task.title}"`}
        className="p-3 rounded-lg hover:bg-red-200 active:bg-red-300"
      >
        <TrashIcon size={20} color="red" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TaskItem;

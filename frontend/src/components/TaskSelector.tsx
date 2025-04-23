
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProcessingTask } from "@/lib/types";
import { getTasksByCategory } from "@/data/tasks";

interface TaskSelectorProps {
  onSelectTask: (task: ProcessingTask) => void;
}

const TaskSelector = ({ onSelectTask }: TaskSelectorProps) => {
  const [selectedTask, setSelectedTask] = useState<ProcessingTask | null>(null);
  const tasksByCategory = getTasksByCategory();
  const categories = Object.keys(tasksByCategory);
  
  const handleSelectTask = (task: ProcessingTask) => {
    setSelectedTask(task);
    onSelectTask(task);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Processing Task</CardTitle>
        <CardDescription>
          Choose an image processing operation to apply
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksByCategory[category].map((task) => (
                  <Card
                    key={task.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTask?.id === task.id
                        ? "border-primary"
                        : "border-border"
                    }`}
                    onClick={() => handleSelectTask(task)}
                  >
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-base">{task.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-5">
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      {task.returnsZip && (
                        <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">
                          Returns multiple images
                        </p>
                      )}
                      {task.requiresMultipleImages && (
                        <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                          Requires multiple images
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskSelector;

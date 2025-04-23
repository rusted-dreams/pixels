import { useState, useEffect } from "react";
import { TaskParameter } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface TaskParametersProps {
  parameters?: TaskParameter[];
  onChange: (params: Record<string, string | number>) => void;
}

const TaskParameters = ({ parameters, onChange }: TaskParametersProps) => {
  const [paramValues, setParamValues] = useState<
    Record<string, string | number>
  >({});

  useEffect(() => {
    if (parameters && Object.keys(paramValues).length === 0) {
      const defaultValues = parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue;
        return acc;
      }, {} as Record<string, string | number>);

      setParamValues(defaultValues);
      onChange(defaultValues);
    }
  }, [parameters, onChange, paramValues]);

  const handleParamChange = (id: string, value: string | number) => {
    const newValues = { ...paramValues, [id]: value };
    setParamValues(newValues);
    onChange(newValues);
  };

  if (!parameters || parameters.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={param.id}>{param.name}</Label>
                {param.type === "number" && (
                  <span className="text-sm text-muted-foreground">
                    {paramValues[param.id]}
                  </span>
                )}
              </div>

              {param.type === "number" && (
                <div className="space-y-2">
                  <Slider
                    id={param.id}
                    min={param.min ?? 0}
                    max={param.max ?? 100}
                    step={param.step ?? 1}
                    value={[Number(paramValues[param.id])]}
                    onValueChange={(values) =>
                      handleParamChange(param.id, values[0])
                    }
                  />
                  {param.description && (
                    <p className="text-xs text-muted-foreground">
                      {param.description}
                    </p>
                  )}
                </div>
              )}

              {param.type === "select" && param.options && (
                <div className="space-y-2">
                  <Select
                    value={paramValues[param.id]?.toString()}
                    onValueChange={(value) =>
                      handleParamChange(param.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {param.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {param.description && (
                    <p className="text-xs text-muted-foreground">
                      {param.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskParameters;

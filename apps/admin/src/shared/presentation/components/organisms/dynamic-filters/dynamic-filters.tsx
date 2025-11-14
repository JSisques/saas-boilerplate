"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { PlusIcon, XIcon } from "lucide-react";

export interface FilterField {
  key: string;
  label: string;
  type: "text" | "enum" | "number" | "date";
  enumOptions?: { label: string; value: string }[];
}

export interface DynamicFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface DynamicFiltersProps {
  fields: FilterField[];
  operators: { label: string; value: string }[];
  filters: DynamicFilter[];
  onFiltersChange: (filters: DynamicFilter[]) => void;
  className?: string;
}

export function DynamicFilters({
  fields,
  operators,
  filters,
  onFiltersChange,
  className,
}: DynamicFiltersProps) {
  const addFilter = () => {
    const newFilter: DynamicFilter = {
      id: `filter-${Date.now()}`,
      field: fields[0]?.key || "",
      operator: operators[0]?.value || "",
      value: "",
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter((f) => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<DynamicFilter>) => {
    onFiltersChange(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const getFieldType = (fieldKey: string): FilterField["type"] => {
    return fields.find((f) => f.key === fieldKey)?.type || "text";
  };

  const getFieldEnumOptions = (fieldKey: string) => {
    return fields.find((f) => f.key === fieldKey)?.enumOptions || [];
  };

  const renderValueInput = (filter: DynamicFilter) => {
    const fieldType = getFieldType(filter.field);

    if (fieldType === "enum") {
      const enumOptions = getFieldEnumOptions(filter.field);
      return (
        <Select
          value={filter.value}
          onValueChange={(value) => updateFilter(filter.id, { value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {enumOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={
          fieldType === "number"
            ? "number"
            : fieldType === "date"
              ? "date"
              : "text"
        }
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
        placeholder="Enter value"
        className="w-[180px]"
      />
    );
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 items-end">
        {filters.map((filter) => {
          return (
            <div key={filter.id} className="flex items-center gap-2">
              {/* Field Selector */}
              <Select
                value={filter.field}
                onValueChange={(value) => {
                  updateFilter(filter.id, { field: value, value: "" });
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Operator Selector */}
              <Select
                value={filter.operator}
                onValueChange={(value) =>
                  updateFilter(filter.id, { operator: value })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Value Input/Select */}
              {renderValueInput(filter)}

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(filter.id)}
                className="h-9 w-9"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          );
        })}

        {/* Add Filter Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addFilter}
          className="h-9"
        >
          <PlusIcon className="size-4 mr-2" />
          Add Filter
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterCategory {
  id: string;
  label: string;
  count: number;
  enabled: boolean;
}

const initialFilters: FilterCategory[] = [
  {
    id: "operational-intents",
    label: "Operational Intents",
    count: 12,
    enabled: true,
  },
  { id: "subscriptions", label: "Subscriptions", count: 8, enabled: true },
  { id: "utm-zones", label: "UTM Zones", count: 5, enabled: false },
  { id: "constraints", label: "Constraints", count: 3, enabled: true },
];

export const OperationalFilters = () => {
  const [filters, setFilters] = useState<FilterCategory[]>(initialFilters);

  const toggleFilter = (id: string) => {
    setFilters(
      filters.map((filter) =>
        filter.id === id ? { ...filter, enabled: !filter.enabled } : filter,
      ),
    );
  };

  const enabledCount = filters.filter((f) => f.enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-white">
            Operational Filters
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {enabledCount} active
        </Badge>
      </div>

      <div className="space-y-3">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center space-x-3">
            <Checkbox
              id={filter.id}
              checked={filter.enabled}
              onCheckedChange={() => toggleFilter(filter.id)}
            />
            <label
              htmlFor={filter.id}
              className="flex-1 text-sm cursor-pointer text-gray-300"
            >
              {filter.label}
            </label>
            <Badge
              variant={filter.enabled ? "default" : "outline"}
              className="text-xs px-2 py-0"
            >
              {filter.count}
            </Badge>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t border-gray-600">
        <div className="flex gap-2">
          <button
            onClick={() =>
              setFilters(filters.map((f) => ({ ...f, enabled: true })))
            }
            className="text-xs px-2 py-1 rounded text-blue-400 hover:bg-gray-700"
          >
            Select All
          </button>
          <button
            onClick={() =>
              setFilters(filters.map((f) => ({ ...f, enabled: false })))
            }
            className="text-xs px-2 py-1 rounded text-gray-400 hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

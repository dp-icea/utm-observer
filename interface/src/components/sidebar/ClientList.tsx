import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  status: "active" | "inactive";
  lastSeen: string;
  operationalIntents: number;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "SkyDrone Corp",
    status: "active",
    lastSeen: "2 min ago",
    operationalIntents: 3,
  },
  {
    id: "2",
    name: "AeroTech Solutions",
    status: "active",
    lastSeen: "5 min ago",
    operationalIntents: 1,
  },
  {
    id: "3",
    name: "FlightPath LLC",
    status: "inactive",
    lastSeen: "2 hours ago",
    operationalIntents: 0,
  },
  {
    id: "4",
    name: "DroneLogistics",
    status: "active",
    lastSeen: "1 min ago",
    operationalIntents: 2,
  },
];

export const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-white">
          Clients ({filteredClients.length})
        </span>
      </div>

      {/* Search and Filter */}
      <div className="space-y-2">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs"
        />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="h-6 px-2 text-xs"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className="h-6 px-2 text-xs"
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className="h-6 px-2 text-xs"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-2 rounded-lg border bg-gray-750 border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-white">
                {client.name}
              </span>
              <Badge
                variant={client.status === "active" ? "default" : "secondary"}
                className="text-xs px-2 py-0"
              >
                {client.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-400">
              Last seen: {client.lastSeen}
            </div>
            <div className="text-xs text-gray-400">
              Intents: {client.operationalIntents}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

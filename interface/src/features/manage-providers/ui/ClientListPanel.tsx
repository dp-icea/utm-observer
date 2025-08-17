import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useMap } from "@/contexts/MapContext";
import {
  isOperationalIntent,
  isConstraint,
  isIdentificationServiceArea,
} from "@/utils/interface-hook";

interface Client {
  name: string;
  active: boolean;
  operationalIntents: number;
  constraints: number;
  identificationServiceAreas: number;
}

export const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { volumes, setManagerFilter } = useMap();

  const [clients, setClients] = useState<Client[]>([]);

  const onVolumesUpdate: React.EffectCallback = () => {
    const currentClients: Record<string, Client> = {};

    clients.forEach((client) => {
      currentClients[client.name] = {
        ...client,
        operationalIntents: 0,
        constraints: 0,
        identificationServiceAreas: 0,
      };
    });

    volumes.forEach((volume) => {
      const clientName = isIdentificationServiceArea(volume)
        ? volume.reference.owner
        : volume.reference.manager;

      if (clientName) {
        if (!currentClients[clientName]) {
          currentClients[clientName] = {
            name: clientName,
            active: true,
            operationalIntents: 0,
            constraints: 0,
            identificationServiceAreas: 0,
          };
        }

        if (isOperationalIntent(volume)) {
          currentClients[clientName].operationalIntents += 1;
        } else if (isConstraint(volume)) {
          currentClients[clientName].constraints += 1;
        } else if (isIdentificationServiceArea(volume)) {
          currentClients[clientName].identificationServiceAreas += 1;
        }
      }
    });

    const newClients = Object.values(currentClients).filter(
      (client) =>
        client.operationalIntents > 0 ||
        client.constraints > 0 ||
        client.identificationServiceAreas > 0,
    );

    setClients(newClients);
    setManagerFilter(
      newClients.filter((client) => client.active).map((client) => client.name),
    );
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && client.active) ||
      (statusFilter === "inactive" && !client.active);
    return matchesSearch && matchesStatus;
  });

  const toggleClient = (clientName: string) => {
    // Placeholder for toggling client status
    const newClients = clients.map((client) => {
      if (client.name === clientName) {
        return { ...client, active: !client.active };
      }
      return client;
    });

    setClients(newClients);

    setManagerFilter(
      newClients.filter((client) => client.active).map((client) => client.name),
    );
  };

  useEffect(onVolumesUpdate, [volumes]);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-white">
          {volumes.length > 0 ? `Providers (${filteredClients.length})` : "Providers"}
        </span>
      </div>

      {volumes.length === 0 && (
        <div className="p-3 rounded-lg border bg-gray-750 border-gray-600">
          <span className="text-xs text-gray-400">
            No providers detected in the area.
          </span>
        </div>
      )}

      {/* Search and Filter */}
      {volumes.length > 0 && (
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
      )}

      {/* Client List */}
      {volumes.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.name}
              className="p-2 rounded-lg border bg-gray-750 border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => {
                toggleClient(client.name);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">
                  {client.name}
                </span>
                <Badge
                  variant={client.active ? "default" : "secondary"}
                  className="text-xs px-2 py-0"
                >
                  {client.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="text-xs text-gray-400 text-start">
                Operational Intents: {client.operationalIntents}
              </div>
              <div className="text-xs text-gray-400 text-start">
                Constraints: {client.constraints}
              </div>
              <div className="text-xs text-gray-400 text-start">
                Identification Service Areas: {client.identificationServiceAreas}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

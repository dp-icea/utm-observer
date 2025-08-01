import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import { useMap } from "@/contexts/MapContext";
import { constraintManagementService } from "@/services/constraintManagement";

export const ConstraintManagement = () => {
  const [isConstraintEnabled, setIsConstraintEnabled] = useState(false);

  const { loadingConstraintRequest, setLoadingConstraintRequest } = useMap();

  const handleEnableConstraint = async () => {
    setLoadingConstraintRequest(true);
    try {
      await constraintManagementService.enableConstraint();
    } catch (error) {
      console.error("Error enabling constraint:", error);
    } finally {
      setLoadingConstraintRequest(false);
    }
  };

  const handleDisableConstraint = async () => {
    setLoadingConstraintRequest(true);
    try {
      await constraintManagementService.disableConstraint();
    } catch (error) {
      console.error("Error disabling constraint:", error);
    } finally {
      setLoadingConstraintRequest(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium text-white">
          Constraint Management
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4"></div>
      <div className="space-y-3">
        <Button
          onClick={handleEnableConstraint}
          disabled={isConstraintEnabled || loadingConstraintRequest}
          className={`w-full flex items-center gap-2 ${isConstraintEnabled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
        >
          <Shield className="h-4 w-4" />
          Enable Constraint
        </Button>

        <Button
          onClick={handleDisableConstraint}
          disabled={loadingConstraintRequest}
          variant="outline"
          className={
            "w-full flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
          }
        >
          <ShieldOff className="h-4 w-4" />
          Disable Constraint
        </Button>
      </div>
    </div>
  );
};

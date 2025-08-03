import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMap } from "@/contexts/MapContext";
import { constraintManagementService } from "@/services/constraintManagement";
import { toast } from "@/hooks/use-toast";

export const ConstraintManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { loadingConstraintRequest, setLoadingConstraintRequest } = useMap();

  const handleConfirmConstraint = async () => {
    setLoadingConstraintRequest(true);
    try {
      await constraintManagementService.enableConstraint();
      toast({
        title: "Constraint Enabled",
        description: "The constraint has been successfully created.",
      });
    } catch (error) {
      console.error("Error enabling constraint:", error);
      toast({
        title: "Error",
        description: "Failed to create the constraint. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingConstraintRequest(false);
      setIsDialogOpen(false);
    }
  };

  const handleCancelConstraint = () => {
    setIsDialogOpen(false);
  }

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
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              disabled={loadingConstraintRequest}
              className={`w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white`}
            >
              <Shield className="h-4 w-4" />
              Enable Constraint
            </Button>
          </DialogTrigger>
          <DialogContent
            onPointerDownOutside={(e) => {
              if (!loadingConstraintRequest) {
                setIsDialogOpen(false);
              } else {
                e.preventDefault()
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Confirm Constraint Creation</DialogTitle>
              <DialogDescription>
                Are you sure you want to create a constraint? The constraint will be placed at
                <strong> Instituto de Estudos Avançados (IEAv)</strong> and will last for <strong>3 minutes</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelConstraint}
                disabled={loadingConstraintRequest}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmConstraint}
                disabled={loadingConstraintRequest}
              >
                {loadingConstraintRequest ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

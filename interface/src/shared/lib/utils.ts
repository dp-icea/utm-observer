import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
  OperationalIntent,
  Constraint,
  IdentificationServiceAreaFull,
} from "@/shared/model"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isOperationalIntent = (
  region: OperationalIntent | Constraint | IdentificationServiceAreaFull,
): region is OperationalIntent => {
  return "flight_type" in region.reference;
};

export const isConstraint = (
  region: OperationalIntent | Constraint | IdentificationServiceAreaFull,
): region is Constraint => {
  return "geozone" in region.details;
};

export const isIdentificationServiceArea = (
  region: OperationalIntent | Constraint | IdentificationServiceAreaFull,
): region is IdentificationServiceAreaFull => {
  return "owner" in region.reference;
};

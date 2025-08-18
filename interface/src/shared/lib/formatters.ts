import { format } from "date-fns";
import type { Volume4D } from "../types";
import type { Constraint } from "@/entities/constraint";
import {
  OperationalIntentStateColor,
  type OperationalIntent,
} from "@/entities/operational-intent";
/**
 * Format a timestamp for display
 */
const formatTimestamp = (timestamp: string): string => {
  return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
};

/**
 * Create HTML for volume information
 */
const getVolumeDetailsHtml = (volumes: Volume4D[] | undefined): string => {
  if (!volumes || volumes.length === 0)
    return "<span class='no-data'>No volumes defined</span>";

  const volumeItems = volumes
    .map((vol, idx) => {
      const altitudeLower =
        vol.volume.altitude_lower !== undefined
          ? `${vol.volume.altitude_lower.value} ${vol.volume.altitude_lower.units}`
          : "ground";
      const altitudeUpper =
        vol.volume.altitude_upper !== undefined
          ? `${vol.volume.altitude_upper.value} ${vol.volume.altitude_upper.units}`
          : "unlimited";

      return `
      <div class="volume-item">
        <strong>Volume #${idx + 1}:</strong>
        <div class="volume-details">
          <div>Time Start: ${formatTimestamp(vol.time_start.value)}</div>
          <div>Time End: ${formatTimestamp(vol.time_end.value)}</div>
          <div>Altitude Min: ${parseFloat(altitudeLower).toFixed(2)} </div>
          <div>Altitude Max: ${parseFloat(altitudeUpper).toFixed(2)}</div>
          <div>Height: ${altitudeUpper !== "unlimited" && altitudeLower !== "ground" ? `${(parseFloat(altitudeUpper) - parseFloat(altitudeLower)).toFixed(2)} ${vol.volume.altitude_upper.units}` : "N/A"}</div>
          ${vol.volume["outline_polygon"] ? "<div>Base Polygon: " + vol.volume.outline_polygon?.vertices.length + " vertices</div>" : ""}
        </div>
      </div>
    `;
    })
    .join("");

  return `
    <div class="volumes-container">
      <div class="volume-count">${volumes.length} volume(s)</div>
      ${volumeItems}
    </div>
  `;
};

/**
 * Format detailed HTML information about a constraint
 */
export const formatConstraintDetails = (constraint: Constraint): string => {
  const { reference, details } = constraint;

  return `
    <div class="entity-details constraint">
      <h3 class="entity-header">Constraint Details</h3>
      <div class="entity-id"><strong>ID:</strong> ${reference.id}</div>
      
      <div class="entity-section">
        <h4>Reference Information</h4>
        <div class="entity-field"><strong>Manager:</strong> ${reference.manager}</div>
        <div class="entity-field"><strong>Availability:</strong> <span class="availability-${reference.uss_availability}">${reference.uss_availability}</span></div>
        <div class="entity-field"><strong>Version:</strong> ${reference.version}${reference.ovn ? ` <span class="ovn">(OVN: ${reference.ovn})</span>` : ""}</div>
        <div class="entity-field"><strong>Time Start:</strong> <span class="time-range">${formatTimestamp(reference.time_start.value)}</span></div>
        <div class="entity-field"><strong>Time End:</strong> <span class="time-range">${formatTimestamp(reference.time_end.value)}</span></div>
        <div class="entity-field"><strong>USS Base URL:</strong> <a href="${reference.uss_base_url}" target="_blank">${reference.uss_base_url}</a></div>
      </div>
      
      <div class="entity-section">
        <h4>Constraint Details</h4>
        <div class="entity-field"><strong>Type:</strong> ${details.type || '<span class="no-data">Unspecified</span>'}</div>
        ${
          details.geozone
            ? `<div class="entity-field"><strong>GeoZone:</strong> ID=${details.geozone}</div>`
            : '<div class="entity-field"><strong>GeoZone:</strong> <span class="no-data">None</span></div>'
        }
      </div>
      
      <div class="entity-section">
        <h4>Volumes</h4>
        ${getVolumeDetailsHtml(details.volumes)}
      </div>
    </div>
  `;
};

/**
 * Format detailed HTML information about an operational intent
 */
export const formatOperationalIntentDetails = (
  intent: OperationalIntent,
): string => {
  const { reference, details } = intent;
  const stateColor = OperationalIntentStateColor[reference.state] || "gray";

  return `
    <div class="entity-details operational-intent">
      <h3 class="entity-header">Operational Intent Details</h3>
      <div class="entity-id"><strong>ID:</strong> ${reference.id}</div>
      
      <div class="entity-section">
        <h4>Status Information</h4>
        <div class="entity-field"><strong>State:</strong> <span class="state-badge" style="background-color:${stateColor}">${reference.state}</span></div>
        <div class="entity-field"><strong>Flight Type:</strong> ${reference.flight_type}</div>
        <div class="entity-field"><strong>Priority:</strong> <span class="priority-level">${details.priority !== undefined ? details.priority : "Not specified"}</span></div>
      </div>
      
      <div class="entity-section">
        <h4>Reference Information</h4>
        <div class="entity-field"><strong>Manager:</strong> ${reference.manager}</div>
        <div class="entity-field"><strong>Availability:</strong> <span class="availability-${reference.uss_availability}">${reference.uss_availability}</span></div>
        <div class="entity-field"><strong>Version:</strong> ${reference.version}${reference.ovn ? ` <span class="ovn">(OVN: ${reference.ovn})</span>` : ""}</div>
        <div class="entity-field"><strong>Time Start:</strong> <span class="time-range">${formatTimestamp(reference.time_start.value)}</span></div>
        <div class="entity-field"><strong>Time End:</strong> <span class="time-range">${formatTimestamp(reference.time_end.value)}</span></div>
        <div class="entity-field"><strong>USS Base URL:</strong> <a href="${reference.uss_base_url}" target="_blank">${reference.uss_base_url}</a></div>
        <div class="entity-field"><strong>Subscription ID:</strong> ${reference.subscription_id}</div>
      </div>
      
      <div class="entity-section">
        <h4>Normal Volumes</h4>
        ${getVolumeDetailsHtml(details.volumes)}
      </div>
      
      <div class="entity-section">
        <h4>Off-Nominal Volumes</h4>
        ${getVolumeDetailsHtml(details.off_nominal_volumes)}
      </div>
    </div>
  `;
};

/**
 * Format entity details based on type (constraint or operational intent)
 */
export const formatEntityDetails = (
  entity: Constraint | OperationalIntent,
): string => {
  if ("flight_type" in entity.reference) {
    return formatOperationalIntentDetails(entity as OperationalIntent);
  } else {
    return formatConstraintDetails(entity as Constraint);
  }
};

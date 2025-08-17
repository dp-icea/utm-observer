import { api } from "../../../shared/api/client";
import type { QueryFlightsResponse } from "../../../shared/types/api";
import type { Rectangle } from "../../../shared/types/common";

export const flightTrackingApi = {
  /**
   * Fetch flights in a given area
   */
  async queryFlights(area: Rectangle): Promise<QueryFlightsResponse> {
    const response = await api.post("/fetch/flights", area);
    return response.data.data;
  },

  /**
   * Get real-time flight updates
   */
  async getFlightUpdates(flightIds: string[]) {
    const response = await api.post("/flights/updates", { flight_ids: flightIds });
    return response.data;
  },

  /**
   * Subscribe to flight notifications
   */
  async subscribeToFlights(area: Rectangle, callbackUrl: string) {
    const response = await api.post("/subscriptions/flights", {
      area,
      callback_url: callbackUrl,
      notify_for_flights: true,
    });
    return response.data;
  },

  /**
   * Get flight history for a specific flight
   */
  async getFlightHistory(flightId: string, startTime: string, endTime: string) {
    const response = await api.get(`/flights/${flightId}/history`, {
      params: { start_time: startTime, end_time: endTime }
    });
    return response.data;
  },

  /**
   * Get flight telemetry data
   */
  async getFlightTelemetry(flightId: string) {
    const response = await api.get(`/flights/${flightId}/telemetry`);
    return response.data;
  },
};
import type { Volume4D, Rectangle } from "@/schemas";
import { api } from "@/services/api";
import { addMilliseconds, addMinutes } from "date-fns";

const RESOURCE_PATH = "/constraint_management";

export const constraintManagementService = {
  enableConstraint: async (): Promise<any> => {
    function generateIdentifier(length = 7) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const payload = {
      identifier: generateIdentifier(),
      country: "BRA",
      name: "ENSAIO 001",
      type: "COMMON",
      restriction: "REQ_AUTHORISATION",
      reason: ["AIR_TRAFFIC", "OTHER"],
      otherReasonInfo: "Area de restrição durante o Ensaio 2 do BR-UTM",
      applicability: [
        {
          startDateTime: now.toISOString(),
          endDateTime: oneHourLater.toISOString(),
          permanent: "NO",
        },
      ],
      zoneAuthority: [
        {
          name: "ICEA",
          email: "albarellorha@decea.mil.br",
          purpose: "AUTHORIZATION",
        },
      ],
      geometry: [
        {
          upperLimit: 850,
          lowerLimit: 650,
          uomDimensions: "M",
          upperVerticalReference: "AMSL",
          lowerVerticalReference: "AMSL",
          horizontalProjection: {
            type: "Polygon",
            coordinates: [
              [
                [-45.85609682188266, -23.2525054891898],
                [-45.8566679917102, -23.252557533076185],
                [-45.85706922671247, -23.252180214439946],
                [-45.85812659895453, -23.252392727366413],
                [-45.85773952518764, -23.25306929687811],
                [-45.85713531247757, -23.253481308680108],
                [-45.85611098311804, -23.25357238480136],
                [-45.85542180299575, -23.253268797488545],
                [-45.85609682188266, -23.2525054891898],
              ],
            ],
          },
        },
      ],
      enable: true,
    };

    const res = await api.put(`${RESOURCE_PATH}/create_constraint`, payload);

    return res;
  },

  disableConstraint: async (): Promise<any> => {
    const payload = [
      { lng: -45.85609682188266, lat: -23.2525054891898 },
      { lng: -45.8566679917102, lat: -23.252557533076185 },
      { lng: -45.85706922671247, lat: -23.252180214439946 },
      { lng: -45.85812659895453, lat: -23.252392727366413 },
      { lng: -45.85773952518764, lat: -23.25306929687811 },
      { lng: -45.85713531247757, lat: -23.253481308680108 },
      { lng: -45.85611098311804, lat: -23.25357238480136 },
      { lng: -45.85542180299575, lat: -23.253268797488545 },
    ];

    const res = await api.delete(`${RESOURCE_PATH}/delete_constraint`, {
      data: payload,
    });

    return res;
  },
};

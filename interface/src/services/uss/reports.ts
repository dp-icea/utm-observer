import type { ErrorReport } from "@/schemas";
import { createUssApi } from "../api";
import { Scope } from "@/schemas";

const BASE_URL = "/uss/v1/reports";

export const ussReportsService = {
  makeUssReport: async (
    ussBaseUrl: string,
    report: ErrorReport,
  ): Promise<ErrorReport> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.post(BASE_URL, report, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },
};

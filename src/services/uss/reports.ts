import type { ErrorReport } from "@/schemas";
import api from "../api";

const BASE_URL = "/uss/v1/reports";

export const ussReportsService = {
  makeUssReport: async (report: ErrorReport): Promise<ErrorReport> => {
    const res = await api.post(BASE_URL, report);
    return res.data;
  },
};

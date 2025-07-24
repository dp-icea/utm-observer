import { useRef, useEffect } from "react";
import { useCesium } from "resium";
import { format } from "date-fns";
import { useMap } from "@/contexts/MapContext";
import { ViewerController } from "@/utils/viewer-controller";
import { parseISO, addMinutes, isBefore, isAfter } from "date-fns";
import { apiFetchService } from "@/services";
import { formatEntityDetails } from "@/utils/formatters";

import throttle from "lodash-es/throttle";
import {
  OperationalIntentStateColor,
  type Constraint,
  type OperationalIntent,
  type Volume3D,
  type Volume4D,
} from "@/schemas";

export const isOperationalIntent = (region: OperationalIntent | Constraint): region is OperationalIntent => {
  return "flight_type" in region.reference;
}

export const isConstraint = (region: OperationalIntent | Constraint): region is Constraint => {
  return !isOperationalIntent(region);
}

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}

export const InterfaceHook = () => {
  const controller = useRef<ViewerController | null>(null);

  const { viewer } = useCesium();

  const {
    startDate,
    startTime,
    endDate,
    endTime,
    selectedMinutes,
    volumes,
    setVolumes,
    setLoading,
    filters,
  } = useMap();

  const getTimeRange: () => TimeRange = () => {
    const startDateTime = new Date(
      `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
    );
    const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);
    return { startTime: startDateTime, endTime: endDateTime };
  };

  const fetchVolumes = async (
    rectangle: Cesium.Rectangle,
    timeRange: TimeRange,
  ) => {
    const { startTime, endTime } = timeRange;

    const boundingVolume: Volume4D = {
      volume: {
        outline_polygon: {
          vertices: [
            {
              lng: rectangle.west,
              lat: rectangle.north,
            },
            {
              lng: rectangle.east,
              lat: rectangle.north,
            },
            {
              lng: rectangle.east,
              lat: rectangle.south,
            },
            {
              lng: rectangle.west,
              lat: rectangle.south,
            },
          ],
        },
        altitude_lower: {
          value: 0,
          reference: "W84",
          units: "M",
        },
        altitude_upper: {
          value: 10000,
          reference: "W84",
          units: "M",
        },
      },
      time_start: { value: startTime.toISOString(), format: "RFC3339" },
      time_end: { value: endTime.toISOString(), format: "RFC3339" },
    };

    const res = await apiFetchService.queryVolumes(boundingVolume);

    const fetchedVolumes: Array<OperationalIntent | Constraint> = [
      ...res.constraints,
      ...res.operational_intents,
    ];

    setVolumes(fetchedVolumes);
  };

  const getFilteredRegions = (
    regions: Array<OperationalIntent | Constraint>,
  ): Array<OperationalIntent | Constraint> => {
    const minutesOffset = selectedMinutes[0] || 0;
    return regions.filter((region) => {
      const volumes = region.details.volumes;

      if (!volumes) {
        return false;
      }

      // Verify filters
      if (filters.length > 0) {
        const filterIds = filters.filter((f) => f.enabled).map((f) => f.id);
        if (
          (isOperationalIntent(region) && !filterIds.includes("operational-intents")) ||
          (isConstraint(region) && !filterIds.includes("constraints"))
        ) {
          return false;
        }
      }


      // Verify timeline intersection
      const { startTime } = getTimeRange();
      const selectedTime = addMinutes(startTime, minutesOffset);

      return volumes.some((vol) => {
        const volumeStartTime = parseISO(vol.time_start.value);
        const volumeEndTime = parseISO(vol.time_end.value);

        return (
          isAfter(selectedTime, volumeStartTime) &&
          isBefore(selectedTime, volumeEndTime)
        );
      });
    });
  };

  const triggerFetchVolumes = async () => {
    if (!controller.current) return;

    setLoading(true);
    const viewRectangle = controller.current.getViewRectangle();
    const timeRange = getTimeRange();
    if (viewRectangle) {
      await fetchVolumes(viewRectangle, timeRange);
    }
    setLoading(false);
  };

  const updateVolumes = () => {
    if (!controller.current) return;

    const filteredVolumes = getFilteredRegions(volumes);
    controller.current.displayRegions(filteredVolumes);
  };

  const onViewerStart: React.EffectCallback = () => {
    if (!viewer || controller.current) return;

    controller.current = new ViewerController(viewer);

    controller.current.addMoveEndCallback(() => {
      triggerFetchVolumes();
    });

    controller.current.addEntityClickCallback(
      (pickedEntity: Cesium.Entity, regionId: string) => {
        const volume = volumes.find((v) => v.reference.id === regionId);

        if (volume) {
          console.log("Trying to display inforamtion from", volume);
          pickedEntity.description = formatEntityDetails(volume);
        }
      },
    );

    triggerFetchVolumes();
  };

  const onTimeRangeChange: React.EffectCallback = () => {
    if (!controller.current) return;

    triggerFetchVolumes();
  };

  const onInterfaceUpdate: React.EffectCallback = () => {
    if (!controller.current) return;

    updateVolumes();
  };


  // Object state on the dynamic input
  useEffect(onViewerStart, [viewer]);
  useEffect(onTimeRangeChange, [startDate, startTime, endDate, endTime]);
  useEffect(onInterfaceUpdate, [selectedMinutes, volumes, filters]);

  // Destroy routine
  useEffect(() => {
    const interval = setInterval(() => {
      triggerFetchVolumes();
    }, 10000);

    return () => {
      clearInterval(interval);
      controller.current = null;
    };
  }, []);

  return null;
};

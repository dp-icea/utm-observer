import { useRef, useEffect } from "react";
import { useCesium } from "resium";
import { addSeconds, format } from "date-fns";
import { useMap } from "@/contexts/MapContext";
import { ViewerController } from "@/utils/viewer-controller";
import { parseISO, addMinutes, isBefore, isAfter } from "date-fns";
import { apiFetchService } from "@/services";
import { formatEntityDetails } from "@/utils/formatters";
import { MapState } from "@/schemas/context";

import {
  OperationalIntentStateColor,
  type Constraint,
  type Flight,
  type IdentificationServiceAreaFull,
  type OperationalIntent,
  type Rectangle,
  type RIDFlight,
  type Volume3D,
  type Volume4D,
} from "@/schemas";
import type { AxiosError } from "axios";

const VOLUME_FETCH_INTERVAL = 4000; // 10 seconds

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

export interface TimeRange {
  startTime: Date;
  endTime: Date;
}

export const InterfaceHook = () => {
  const controller = useRef<ViewerController | null>(null);

  // This was created because of caching problems in the map provider context
  const localVolumes = useRef<
    Array<OperationalIntent | Constraint | IdentificationServiceAreaFull>
  >([]);

  const liveInterval = useRef<NodeJS.Timeout | null>(null);

  const constantVolumeFetch = useRef<NodeJS.Timeout | null>(null);
  const timeRange = useRef<TimeRange | null>(null);

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
    managerFilter,
    setMapState,
    isLive,
    flights,
    setFlights,
    flightsFilter,
    flightProvidersFilter,
  } = useMap();

  const getTimeRange: () => TimeRange = () => {
    const startDateTime = new Date(
      `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
    );
    const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);
    return { startTime: startDateTime, endTime: endDateTime };
  };

  const fetchFlights = async (rectangle: Rectangle) => {
    const area: Rectangle = {
      north: rectangle.north,
      south: rectangle.south,
      east: rectangle.east,
      west: rectangle.west,
    };

    try {
      const res = await apiFetchService.queryFlights(area);
      setFlights(res.flights);
      setMapState(MapState.ONLINE);
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
        setMapState(MapState.OFFLINE);
      } else {
        setMapState(MapState.ERROR);
      }
    }
  };

  const fetchVolumes = async (rectangle: Rectangle) => {
    if (!controller.current) return;

    if (!timeRange.current) return;

    let { startTime, endTime } = timeRange.current;

    console.log("Using Start Time:", startTime);
    console.log("Using End Time:", endTime);

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

    try {
      const res = await apiFetchService.queryVolumes(boundingVolume);

      const fetchedVolumes: Array<
        OperationalIntent | Constraint | IdentificationServiceAreaFull
      > = [
        ...res.constraints,
        ...res.operational_intents,
        ...res.identification_service_areas,
      ];

      localVolumes.current = fetchedVolumes.slice();
      setVolumes(fetchedVolumes);
      setMapState(MapState.ONLINE);
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
        setMapState(MapState.OFFLINE);
      } else {
        setMapState(MapState.ERROR);
      }
    }
  };

  const getFilteredRegions = (
    regions: Array<
      OperationalIntent | Constraint | IdentificationServiceAreaFull
    >,
  ): Array<OperationalIntent | Constraint | IdentificationServiceAreaFull> => {
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
          (isOperationalIntent(region) &&
            !filterIds.includes("operational-intents")) ||
          (isConstraint(region) && !filterIds.includes("constraints")) ||
          (isIdentificationServiceArea(region) &&
            !filterIds.includes("identification-service-areas"))
        ) {
          return false;
        }
      }

      const manager = isIdentificationServiceArea(region)
        ? region.reference.owner
        : region.reference.manager;
      if (!managerFilter.includes(manager)) {
        return false;
      }

      // Verify timeline intersection
      if (!isLive) {
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
      }

      return true;
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

  const triggerFetchFlights = async () => {
    if (!controller.current) return;

    setLoading(true);
    const viewRectangle = controller.current.getViewRectangle();
    if (viewRectangle) {
      await fetchFlights(viewRectangle);
    }
    setLoading(false);
  };

  const updateVolumes = () => {
    if (!controller.current) return;

    console.log("=== Updating volumes:", volumes);

    const filteredVolumes = getFilteredRegions(volumes);
    controller.current.displayRegions(filteredVolumes);
  };

  const onViewerStart: React.EffectCallback = () => {
    console.log("Called onViewerStart");
    console.log("Viewer:", viewer);
    console.log("Controller:", controller.current);

    if (!viewer || controller.current) return;

    controller.current = new ViewerController(viewer);

    timeRange.current = getTimeRange();

    controller.current.addMoveEndCallback(() => {
      if (constantVolumeFetch.current) {
        console.log(
          "Clearing previous interval for volumes",
          constantVolumeFetch.current,
        );
        clearInterval(constantVolumeFetch.current);
      }
      constantVolumeFetch.current = setInterval(() => {
        console.log("Hou");
        triggerFetchVolumes();
      }, VOLUME_FETCH_INTERVAL);
      console.log(
        "Setting new interval for volumes",
        constantVolumeFetch.current,
      );
    });

    controller.current.addEntityClickCallback(
      (pickedEntity: Cesium.Entity, regionId: string) => {
        const volume = localVolumes.current.find(
          (v) => v.reference.id === regionId,
        );

        if (volume) {
          pickedEntity.description = formatEntityDetails(volume);
        }
      },
    );

    if (constantVolumeFetch.current) {
      console.log(
        "Clearing previous interval for volumes",
        constantVolumeFetch.current,
      );
      clearInterval(constantVolumeFetch.current);
    }
    constantVolumeFetch.current = setInterval(() => {
      console.log("Hey");
      triggerFetchVolumes();
    }, VOLUME_FETCH_INTERVAL);
    console.log(
      "Setting initial interval for volumes",
      constantVolumeFetch.current,
    );
  };

  const onTimeRangeChange: React.EffectCallback = () => {
    if (!controller.current) return;

    timeRange.current = getTimeRange();

    // Reset the live interval if the time range changes
    if (constantVolumeFetch.current) {
      console.log(
        "Clearing previous interval for volumes",
        constantVolumeFetch.current,
      );
      clearInterval(constantVolumeFetch.current);
      liveInterval.current = null;
    }

    // Update the controller with the new time range
    constantVolumeFetch.current = setInterval(() => {
      console.log("Hay");
      triggerFetchVolumes();
    }, VOLUME_FETCH_INTERVAL);
    console.log(
      "Setting new interval for volumes",
      constantVolumeFetch.current,
    );
  };

  const onInterfaceUpdate: React.EffectCallback = () => {
    if (!controller.current) return;

    console.log("=== Updating the interface");
    updateVolumes();
  };

  const getFilteredFlights = (flights: Array<Flight>): Array<Flight> => {
    return flights.filter((flight) => {
      // Filter by selected providers
      if (
        !flightProvidersFilter.includes(
          flight.identification_service_area.owner,
        )
      ) {
        return false;
      }

      // Filter by selected flights
      if (!flightsFilter.includes(flight.id)) {
        return false;
      }

      return true;
    });
  };

  const onFlightsUpdate: React.EffectCallback = () => {
    if (!controller.current) return;

    const filteredFlights = getFilteredFlights(flights);
    controller.current.displayFlights(filteredFlights);
  };

  const onLiveToggle: React.EffectCallback = () => {
    if (!controller.current) return;

    if (isLive) {
      if (liveInterval.current) return;

      liveInterval.current = setInterval(() => {
        const startTime = new Date();
        const endTime = addSeconds(startTime, 10);
        timeRange.current = { startTime, endTime };

        triggerFetchFlights();
      }, 5000);
    } else {
      if (liveInterval.current) {
        // Clear the interval if it exists
        controller.current.clearFlights();
        clearInterval(liveInterval.current);
        liveInterval.current = null;
        timeRange.current = getTimeRange();
      }
    }
  };

  // Object state on the dynamic input
  useEffect(onViewerStart, [viewer]);
  useEffect(onTimeRangeChange, [startDate, startTime, endDate, endTime]);
  useEffect(onInterfaceUpdate, [
    selectedMinutes,
    volumes,
    filters,
    managerFilter,
  ]);
  useEffect(onFlightsUpdate, [flights]);

  useEffect(onLiveToggle, [isLive]);

  useEffect(() => {
    return () => {
      console.log("Cleaning up InterfaceHook");
      if (constantVolumeFetch.current) {
        console.log(
          "Clearing constant volume fetch interval",
          constantVolumeFetch.current,
        );
        clearInterval(constantVolumeFetch.current);
      }
      if (liveInterval.current) {
        console.log("Clearing live interval", liveInterval.current);
        clearInterval(liveInterval.current);
      }
      controller.current = null;
    };
  }, []);

  return null;
};

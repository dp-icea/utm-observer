import { useRef, useEffect } from "react";
import { useCesium } from "resium";
import { format } from "date-fns";
import { useMap } from "@/contexts/MapContext";
import { MapController, TimeRange } from "@/utils/map";

export const MapHook = () => {
	const controller = useRef<MapController | null>(null);

	const { viewer } = useCesium();

	const {
		startDate,
		startTime,
		endDate,
		endTime,
		selectedMinutes
	} = useMap();


	const getTimeRange: () => TimeRange = () => {
		const startDateTime = new Date(`${format(startDate, "yyyy-MM-dd")}T${startTime}`);
		const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);
		return { startTime: startDateTime, endTime: endDateTime };
	};

	const updateViewer: React.EffectCallback = () => {
		if (viewer && !controller.current) {
			controller.current = new MapController(
				viewer,
				getTimeRange(),
				selectedMinutes[0],
			);
			controller.current.queryVolumes();
		}
	}

	const updateTimeRange: React.EffectCallback = () => {
		if (controller.current) {
			controller.current.setTimeRange(getTimeRange());
			controller.current.fetchDataForCurrentView();
		}
	}

	const updateTimePoint: React.EffectCallback = () => {
		if (controller.current) {
			controller.current.setTimePoint(selectedMinutes[0]);
			controller.current.fetchDataForCurrentView();
		}
	}


	// Object state on the dynamic input
	useEffect(updateViewer, [viewer]);
	useEffect(updateTimeRange, [startDate, startTime, endDate, endTime]);
	useEffect(updateTimePoint, [selectedMinutes]);

	// Destroy routine
	useEffect(() => {
		return () => {
			controller.current?.destroy();
			controller.current = null;
		};
	}, []);

	return null;
};

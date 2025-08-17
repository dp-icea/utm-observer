import { useState, useCallback } from "react";
import { addMinutes, differenceInMinutes, format } from "date-fns";

export interface TimelineState {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  selectedMinutes: number[];
  isLive: boolean;
}

export const useTimelineNavigation = () => {
  const [state, setState] = useState<TimelineState>({
    startDate: new Date(),
    endDate: new Date(),
    startTime: "00:00",
    endTime: "23:59",
    selectedMinutes: [0],
    isLive: true,
  });

  const setStartDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, startDate: date }));
  }, []);

  const setEndDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, endDate: date }));
  }, []);

  const setStartTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, startTime: time }));
  }, []);

  const setEndTime = useCallback((time: string) => {
    setState(prev => ({ ...prev, endTime: time }));
  }, []);

  const setSelectedMinutes = useCallback((minutes: number[]) => {
    setState(prev => ({ ...prev, selectedMinutes: minutes }));
  }, []);

  const setIsLive = useCallback((isLive: boolean) => {
    setState(prev => ({ ...prev, isLive }));
  }, []);

  // Calculate datetime objects
  const getStartDateTime = useCallback(() => {
    return new Date(`${format(state.startDate, "yyyy-MM-dd")}T${state.startTime}`);
  }, [state.startDate, state.startTime]);

  const getEndDateTime = useCallback(() => {
    return new Date(`${format(state.endDate, "yyyy-MM-dd")}T${state.endTime}`);
  }, [state.endDate, state.endTime]);

  const getSelectedDateTime = useCallback(() => {
    const startDateTime = getStartDateTime();
    return addMinutes(startDateTime, state.selectedMinutes[0]);
  }, [getStartDateTime, state.selectedMinutes]);

  const getTotalMinutes = useCallback(() => {
    return differenceInMinutes(getEndDateTime(), getStartDateTime());
  }, [getStartDateTime, getEndDateTime]);

  // Generate timeline markers for display
  const generateTimeMarkers = useCallback(() => {
    const startDateTime = getStartDateTime();
    const endDateTime = getEndDateTime();
    const totalMinutes = getTotalMinutes();
    
    const markers = [];
    const totalHours = Math.max(1, Math.floor(totalMinutes / 60));
    const markerCount = Math.min(12, Math.max(4, totalHours));

    for (let i = 0; i <= markerCount; i++) {
      const minutes = (totalMinutes / markerCount) * i;
      const markerTime = addMinutes(startDateTime, minutes);
      markers.push({
        position: (i / markerCount) * 100,
        time: markerTime,
        minutes: minutes,
      });
    }
    
    return markers;
  }, [getStartDateTime, getTotalMinutes]);

  // Format time for display
  const formatDisplayTime = useCallback((date: Date) => {
    return format(date, "MMM dd, HH:mm:ss");
  }, []);

  const formatTimelineTime = useCallback((date: Date) => {
    return format(date, "HH:mm");
  }, []);

  const formatTotalTime = useCallback(() => {
    const totalMinutes = getTotalMinutes();
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (totalHours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${totalHours}h`;
    } else {
      return `${totalHours}h ${remainingMinutes}m`;
    }
  }, [getTotalMinutes]);

  // Navigation helpers
  const jumpToTime = useCallback((targetTime: Date) => {
    const startDateTime = getStartDateTime();
    const minutes = differenceInMinutes(targetTime, startDateTime);
    const totalMinutes = getTotalMinutes();
    
    if (minutes >= 0 && minutes <= totalMinutes) {
      setSelectedMinutes([minutes]);
    }
  }, [getStartDateTime, getTotalMinutes, setSelectedMinutes]);

  const jumpToNow = useCallback(() => {
    jumpToTime(new Date());
  }, [jumpToTime]);

  const stepForward = useCallback((stepMinutes: number = 1) => {
    const currentMinutes = state.selectedMinutes[0];
    const totalMinutes = getTotalMinutes();
    const newMinutes = Math.min(currentMinutes + stepMinutes, totalMinutes);
    setSelectedMinutes([newMinutes]);
  }, [state.selectedMinutes, getTotalMinutes, setSelectedMinutes]);

  const stepBackward = useCallback((stepMinutes: number = 1) => {
    const currentMinutes = state.selectedMinutes[0];
    const newMinutes = Math.max(currentMinutes - stepMinutes, 0);
    setSelectedMinutes([newMinutes]);
  }, [state.selectedMinutes, setSelectedMinutes]);

  return {
    ...state,
    setStartDate,
    setEndDate,
    setStartTime,
    setEndTime,
    setSelectedMinutes,
    setIsLive,
    getStartDateTime,
    getEndDateTime,
    getSelectedDateTime,
    getTotalMinutes,
    generateTimeMarkers,
    formatDisplayTime,
    formatTimelineTime,
    formatTotalTime,
    jumpToTime,
    jumpToNow,
    stepForward,
    stepBackward,
  };
};
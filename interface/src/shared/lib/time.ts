import { format, parseISO, addMinutes, addHours, addDays, differenceInMinutes, differenceInHours } from "date-fns";
import type { Time } from "../types/common";

/**
 * Time manipulation utilities for UTM operations
 */

/**
 * Create a Time object from a Date
 */
export function createTime(date: Date): Time {
  return {
    value: date.toISOString(),
    format: "RFC3339"
  };
}

/**
 * Create a Time object from current time
 */
export function createCurrentTime(): Time {
  return createTime(new Date());
}

/**
 * Parse a Time object to Date
 */
export function parseTime(time: Time): Date {
  return parseISO(time.value);
}

/**
 * Add minutes to a Time object
 */
export function addMinutesToTime(time: Time, minutes: number): Time {
  const date = parseTime(time);
  return createTime(addMinutes(date, minutes));
}

/**
 * Add hours to a Time object
 */
export function addHoursToTime(time: Time, hours: number): Time {
  const date = parseTime(time);
  return createTime(addHours(date, hours));
}

/**
 * Add days to a Time object
 */
export function addDaysToTime(time: Time, days: number): Time {
  const date = parseTime(time);
  return createTime(addDays(date, days));
}

/**
 * Calculate difference in minutes between two Time objects
 */
export function getMinutesDifference(time1: Time, time2: Time): number {
  return differenceInMinutes(parseTime(time2), parseTime(time1));
}

/**
 * Calculate difference in hours between two Time objects
 */
export function getHoursDifference(time1: Time, time2: Time): number {
  return differenceInHours(parseTime(time2), parseTime(time1));
}

/**
 * Check if a time is between two other times
 */
export function isTimeBetween(time: Time, startTime: Time, endTime: Time): boolean {
  const checkDate = parseTime(time);
  const startDate = parseTime(startTime);
  const endDate = parseTime(endTime);
  
  return checkDate >= startDate && checkDate <= endDate;
}

/**
 * Format time for display in UTM interface
 */
export function formatTimeForDisplay(time: Time): string {
  return format(parseTime(time), "MMM dd, HH:mm:ss");
}

/**
 * Format time for timeline display
 */
export function formatTimeForTimeline(time: Time): string {
  return format(parseTime(time), "HH:mm");
}

/**
 * Format time duration in human readable format
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}

/**
 * Create time range for operational periods
 */
export function createTimeRange(startTime: Time, durationMinutes: number): { start: Time; end: Time } {
  return {
    start: startTime,
    end: addMinutesToTime(startTime, durationMinutes)
  };
}

/**
 * Check if two time ranges overlap
 */
export function doTimeRangesOverlap(
  range1: { start: Time; end: Time },
  range2: { start: Time; end: Time }
): boolean {
  const start1 = parseTime(range1.start);
  const end1 = parseTime(range1.end);
  const start2 = parseTime(range2.start);
  const end2 = parseTime(range2.end);

  return start1 < end2 && start2 < end1;
}
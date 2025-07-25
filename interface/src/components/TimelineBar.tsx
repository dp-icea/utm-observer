import {
  format,
  differenceInMinutes,
  addMinutes,
  differenceInHours,
} from "date-fns";
import { useRef } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useMap } from "@/contexts/MapContext";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export const TimelineBar = () => {
  const {
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    selectedMinutes,
    setSelectedMinutes,
    isLive,
    setIsLive,
  } = useMap();

  const liveInterval = useRef<NodeJS.Timeout | null>(null);

  const previousStartDate = useRef<Date | null>(null);
  const previousEndDate = useRef<Date | null>(null);
  const previousStartTime = useRef<string>("");
  const previousEndTime = useRef<string>("");
  const previousSelectedMinutes = useRef<number[]>([0]);

  // Calculate datetime objects
  const startDateTime = new Date(
    `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
  );
  const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);

  // Current selected time
  const totalMinutes = differenceInMinutes(endDateTime, startDateTime);
  const selectedDateTime = addMinutes(startDateTime, selectedMinutes[0]);

  const formatDisplayTime = (date: Date) => {
    return format(date, "MMM dd, HH:mm:ss");
  };

  const formatTimelineTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  // Calculate total time between start and end
  const formatTotalTime = () => {
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (totalHours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${totalHours}h`;
    } else {
      return `${totalHours}h ${remainingMinutes}m`;
    }
  };

  // Generate timeline markers
  const generateTimeMarkers = () => {
    const markers = [];
    const totalHours = Math.max(
      1,
      differenceInHours(endDateTime, startDateTime),
    );
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
  };

  const timeMarkers = generateTimeMarkers();

  const handleSliderChange = (value: number[]) => {
    setSelectedMinutes(value);
  };

  useEffect(() => {
    if (isLive) {
      console.log("Live mode enabled");

      if (liveInterval.current !== null) {
        console.log("Clearing existing live interval");
        clearInterval(liveInterval.current);
        liveInterval.current = null;
      }

      console.log("Setting new live interval");

      // Save the previous values
      previousStartDate.current = startDate;
      previousEndDate.current = endDate;
      previousStartTime.current = startTime;
      previousEndTime.current = endTime;

      liveInterval.current = setInterval(() => {
        // Change the time range for live updates
        const now = new Date();
        const newStartDateTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
        );
        const newEndDateTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
        );
        setStartDate(newStartDateTime);
        setEndDate(newEndDateTime);
        setStartTime(format(now, "HH:mm"));
        setEndTime(format(addMinutes(now, 1), "HH:mm")); // 1 minute later
        setSelectedMinutes([0]);
      }, 10000);

      console.log(liveInterval.current);
    } else {
      console.log("Live mode disabled");
      if (liveInterval.current !== null) {
        console.log("Clearing live interval");
        clearInterval(liveInterval.current);
        liveInterval.current = null;
      }
    }
  }, [isLive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        const now = new Date();
        const newSelectedMinutes = differenceInMinutes(now, startDateTime);
        if (newSelectedMinutes >= 0 && newSelectedMinutes <= totalMinutes) {
          setSelectedMinutes([newSelectedMinutes]);
        }
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [isLive, startDateTime, totalMinutes, setSelectedMinutes]);

  return (
    <div
      className={cn(
        "h-32 bg-gray-800 border-gray-700 border-t flex flex-col px-6 py-4 space-y-4 transition-opacity",
        isLive && "opacity-50 grayscale cursor-not-allowed",
      )}
    >
      {/* Top Row - Interactive Timeline (moved to top) */}
      <div className="flex items-center space-x-4">
        {/* Start Time Label */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-xs text-gray-400 font-mono">
            {formatTimelineTime(startDateTime)}
          </span>
          <div className="w-2 h-2 rounded-full bg-white mt-1" />
        </div>

        {/* Interactive Timeline */}
        <div className="flex-1 relative">
          {/* Timeline Track */}
          <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
            {/* Progress fill - black and white */}
            <div
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${(selectedMinutes[0] / totalMinutes) * 100}%` }}
            />

            {/* Time markers */}
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                style={{
                  left: `${marker.position}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-0.5 h-full bg-gray-500 opacity-50" />
                <span className="absolute -bottom-6 text-xs text-gray-400 font-mono whitespace-nowrap">
                  {formatTimelineTime(marker.time)}
                </span>
              </div>
            ))}
          </div>

          {/* Slider overlay */}
          <div className="absolute inset-0 -mt-1 -mb-1">
            <Slider
              value={selectedMinutes}
              onValueChange={handleSliderChange}
              max={totalMinutes}
              min={0}
              step={1}
              className="w-full h-8"
              disabled={isLive}
            />
          </div>
        </div>

        {/* End Time Label */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-xs text-gray-400 font-mono">
            {formatTimelineTime(endDateTime)}
          </span>
          <div className="w-2 h-2 rounded-full bg-white mt-1" />
        </div>
      </div>

      {/* Bottom Row - Date/Time Selectors and Current Selection */}
      <div className="flex items-center justify-between">
        {/* Start Date Selection */}
        <div className="flex items-center space-x-2">
          <Label className="text-xs text-gray-300">Start:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[110px] justify-start text-left font-normal text-xs h-8",
                  !startDate && "text-muted-foreground",
                )}
                disabled={isLive}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {startDate ? format(startDate, "MMM dd") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-18 text-xs h-8"
            disabled={isLive}
          />
        </div>

        {/* End Date Selection */}
        <div className="flex items-center space-x-2">
          <Label className="text-xs text-gray-300">End:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[110px] justify-start text-left font-normal text-xs h-8",
                  !endDate && "text-muted-foreground",
                )}
                disabled={isLive}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {endDate ? format(endDate, "MMM dd") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  if (date) setEndDate(date);
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
            className="w-18 text-xs h-8"
            disabled={isLive}
          />
        </div>

        {/* Current Selection Display and Total Time */}
        <div className="flex items-center space-x-4">
          {/* Total Time Display */}
          <div className="flex items-center space-x-2 text-gray-300">
            <span className="text-xs">Total:</span>
            <span className="text-xs font-mono font-semibold">
              {formatTotalTime()}
            </span>
          </div>

          {/* Current Selection */}
          <div className="flex items-center space-x-3 text-white bg-opacity-50 px-4 py-2 rounded-lg bg-gray-700">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-sm font-mono font-semibold">
                {formatDisplayTime(selectedDateTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

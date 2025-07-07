import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, differenceInHours, addHours } from "date-fns";
import { cn } from "@/lib/utils";

export const TimelineBar = () => {
  // Start date/time
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(format(new Date(), "HH:mm"));

  // End date/time (default to 24 hours later)
  const [endDate, setEndDate] = useState<Date>(addHours(new Date(), 24));
  const [endTime, setEndTime] = useState(
    format(addHours(new Date(), 24), "HH:mm"),
  );

  // Calculate datetime objects
  const startDateTime = new Date(
    `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
  );
  const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);

  const formatDisplayTime = (date: Date) => {
    return format(date, "MMM dd, HH:mm");
  };

  // Calculate timeline duration in hours
  const totalHours = Math.max(1, differenceInHours(endDateTime, startDateTime));

  return (
    <div className="h-20 bg-gray-800 border-gray-700 border-t flex items-center px-6 space-x-6">
      {/* Start Date Selection */}
      <div className="flex items-center space-x-2">
        <Label className="text-xs text-gray-300">Start:</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[120px] justify-start text-left font-normal text-xs",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
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
          className="w-20 text-xs"
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
                "w-[120px] justify-start text-left font-normal text-xs",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {endDate ? format(endDate, "MMM dd") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-20 text-xs"
        />
      </div>

      {/* Current Selection Display */}
      <div className="flex items-center space-x-4 text-white bg-opacity-50 px-4 py-2 rounded-lg bg-gray-700">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-mono">
            {formatDisplayTime(startDateTime)} →{" "}
            {formatDisplayTime(endDateTime)}
          </span>
        </div>
        <div className="text-xs text-gray-400">Duration: {totalHours}h</div>
      </div>

      {/* Visual Timeline */}
      <div className="flex-1 flex items-center justify-center space-x-4 max-w-2xl">
        <span className="text-xs text-gray-400 min-w-[80px]">
          {formatDisplayTime(startDateTime)}
        </span>

        <div className="flex-1 relative">
          <div className="h-3 bg-gray-700 rounded-full relative overflow-hidden">
            {/* Timeline gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full opacity-80" />

            {/* Start marker */}
            <div
              className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-y-0.5"
              style={{
                left: "0%",
                transform: "translateX(-50%) translateY(-12.5%)",
              }}
            />

            {/* End marker */}
            <div
              className="absolute w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-md transform -translate-y-0.5"
              style={{
                right: "0%",
                transform: "translateX(50%) translateY(-12.5%)",
              }}
            />

            {/* Progress indicators */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              {Array.from({
                length: Math.min(5, Math.ceil(totalHours / 6)),
              }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gray-300 rounded-full opacity-60"
                />
              ))}
            </div>
          </div>
        </div>

        <span className="text-xs text-gray-400 min-w-[80px] text-right">
          {formatDisplayTime(endDateTime)}
        </span>
      </div>
    </div>
  );
};

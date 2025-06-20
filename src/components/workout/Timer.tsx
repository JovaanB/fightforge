import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  startTime: Date | null;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, isPaused }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        const now = new Date();
        const elapsed =
          Math.floor((now.getTime() - startTime.getTime()) / 1000) -
          pausedDuration;
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isPaused, pausedDuration]);

  useEffect(() => {
    if (isPaused && !pauseStartTime) {
      setPauseStartTime(new Date());
    } else if (!isPaused && pauseStartTime) {
      const pauseDuration = Math.floor(
        (new Date().getTime() - pauseStartTime.getTime()) / 1000
      );
      setPausedDuration((prev) => prev + pauseDuration);
      setPauseStartTime(null);
    }
  }, [isPaused, pauseStartTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock
        className={`w-5 h-5 ${isPaused ? "text-yellow-500" : "text-green-500"}`}
      />
      <span
        className={`font-mono text-lg font-medium ${
          isPaused ? "text-yellow-600" : "text-gray-900"
        }`}
      >
        {formatTime(elapsedTime)}
      </span>
      {isPaused && (
        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          PAUSE
        </span>
      )}
    </div>
  );
};

export default Timer;

import { useRef } from 'react';
import type { ItineraryDay } from '@/types';

export interface DayTabsProps {
  days: ItineraryDay[];
  activeDayNumber: number;
  onSelect: (dayNumber: ItineraryDay['dayNumber']) => void;
}

/** Day 1-4 tab strip with roving-tabindex keyboard navigation (Left/Right/
 * Home/End), per the WAI-ARIA tabs pattern. */
export function DayTabs({ days, activeDayNumber, onSelect }: DayTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAndSelect = (index: number) => {
    const day = days[index];
    if (!day) return;
    refs.current[index]?.focus();
    onSelect(day.dayNumber);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusAndSelect((index + 1) % days.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusAndSelect((index - 1 + days.length) % days.length);
        break;
      case 'Home':
        event.preventDefault();
        focusAndSelect(0);
        break;
      case 'End':
        event.preventDefault();
        focusAndSelect(days.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="day-tabs" role="tablist" aria-label="Trip day">
      {days.map((day, index) => {
        const selected = day.dayNumber === activeDayNumber;
        return (
          <button
            key={day.dayNumber}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`day-tab-${day.dayNumber}`}
            aria-selected={selected}
            aria-controls={`day-panel-${day.dayNumber}`}
            tabIndex={selected ? 0 : -1}
            className="day-tab"
            onClick={() => onSelect(day.dayNumber)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <strong>Day {day.dayNumber}</strong>
            <span>{day.weekday.slice(0, 3)}</span>
          </button>
        );
      })}
    </div>
  );
}

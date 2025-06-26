import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DatePicker = ({ dateRange, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white font-semibold dark:bg-dark-mode dark:text-white  text-label-custom px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none"
      >
        {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-dark-mode rounded-xl shadow-xl p-2">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(ranges) =>
              onChange({
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate,
                key: "selection",
              })
            }
            rangeColors={["#ECD79B"]}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;

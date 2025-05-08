import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DatePicker = ({ dateRange, onChange }) => {
  return (
    <div className="flex justify-center bg-bg-card dark:bg-dark-mode rounded-xl">
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
  );
};

export default DatePicker;

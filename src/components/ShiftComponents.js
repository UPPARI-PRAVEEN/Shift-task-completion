import React, { useState } from "react";
import "../App.css";
import useData from "../hook/useData";
import Loading from "../Spinner/Loading";

const ShiftComponent = () => {
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("availableShifts");
  const [loadingShiftId, setLoadingShiftId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const { shifts } = useData();

  const getAvailableShifts = () => shifts.filter((shift) => !shift.booked);

  const getStartTimeAndEndTime = (shift) => ({
    startTime: new Date(shift.startTime).toLocaleTimeString(),
    endTime: new Date(shift.endTime).toLocaleTimeString(),
  });

  const [areaCounts, setAreaCounts] = useState(() => {
    const areaCounts = {};
    shifts.forEach((shift) => {
      const area = shift.area;
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
    return areaCounts;
  });

  const handleBookClick = async (shift) => {
    if (
      !shift.booked &&
      !selectedShifts.some((selectedShift) => selectedShift.id === shift.id)
    ) {
      setLoadingShiftId(shift.id);

      try {
        
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSelectedShifts((prevSelectedShifts) => [
          ...prevSelectedShifts,
          shift,
        ]);

        setAreaCounts((prevAreaCounts) => {
          const updatedAreaCounts = { ...prevAreaCounts };
          const area = shift.area;
          updatedAreaCounts[area] = (updatedAreaCounts[area] || 0) + 1;
          return updatedAreaCounts;
        });
      } catch (error) {
        console.error("Error booking shift:", error);
      } finally {
        setLoadingShiftId(null);
      }
    } else {
      console.warn("Shift is already booked or selected.");
    }
    setActiveButton("book");
  };

  const handleCancelClick = (shiftId) => {
    const canceledShift = selectedShifts.find((shift) => shift.id === shiftId);

    setSelectedShifts((prevSelectedShifts) =>
      prevSelectedShifts.filter((shift) => shift.id !== shiftId)
    );

    setAreaCounts((prevAreaCounts) => {
      const updatedAreaCounts = { ...prevAreaCounts };
      const area = canceledShift.area;
      updatedAreaCounts[area] = (updatedAreaCounts[area] || 0) - 1;
      return updatedAreaCounts;
    });
    setActiveButton("cancel");
  };

  return (
    <div className="main-container">
      <div>
        {["availableShifts", "selectedShifts"].map((option) => (
          <span
            key={option}
            className="shifts-text"
            style={{
              color: selectedOption === option ? "#16A64D" : "#CBD2E1",
            }}
            onClick={() => setSelectedOption(option)}
          >
            {option === "availableShifts"
              ? "Available Shifts"
              : "My-sifts"}
          </span>
        ))}
      </div>
      <div>
        <div className="area-counts">
          {Object.entries(areaCounts).map(([area, count]) => (
            <p className="count" key={area}>{`${area}: (${count})`}</p>
          ))}
        </div>
      </div>

      <div className="shift-container">
        {selectedOption === "availableShifts" && (
          
            
            <div className="shift-table">
              <div className="header-row">
                <p>Start Time-End Time</p>
              </div>
              {getAvailableShifts().map((shift) => (
                <div key={shift.id} className="data-row">
                  <div className="data-col">
                    {`${getStartTimeAndEndTime(shift).startTime}-${
                      getStartTimeAndEndTime(shift).endTime
                    }`}
                    {selectedShifts.some(
                      (bookedShift) => bookedShift.id === shift.id
                    ) && <p className="booked-text">Booked</p>}
                    <button
                      className={`btn-book ${
                        activeButton === "book" ? "active" : ""
                      }`}
                      onClick={() => handleBookClick(shift)}
                      disabled={loadingShiftId === shift.id || shift.booked}
                    >
                      {loadingShiftId === shift.id ? <Loading /> : "Book"}
                    </button>
                   
                  </div>
                </div>
              ))}
            </div>
          
        )}

        {selectedOption === "selectedShifts" && (
          <div className="selected-shifts-container">
            
            <ul className="selected-shifts-list">
              {selectedShifts.map((shift) => (
                <li key={shift.id} className="selected-shift-item">
                  {`${getStartTimeAndEndTime(shift).startTime}-${
                    getStartTimeAndEndTime(shift).endTime
                  }`}
                  <p className="area">{shift.area}</p>
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelClick(shift.id)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftComponent;

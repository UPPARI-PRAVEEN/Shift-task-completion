import React, { useState } from "react";
import "../App.css";
import useData from "../hook/useData";
import Loading from "../Spinner/Loading";

const ShiftComponent = () => {
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("availableShifts");
  const [loadingShiftId, setLoadingShiftId] = useState(null);

  const { shifts, error } = useData(); 

  const getAvailableShifts = () => {
    return shifts.filter((shift) => !shift.booked);
  };

  const getStartTimeAndEndTime = (shift) => {
    const startTime = new Date(shift.startTime).toLocaleTimeString();
    const endTime = new Date(shift.endTime).toLocaleTimeString();
    return { startTime, endTime };
  };

  const getAreaCounts = () => {
    const areaCounts = {};
    shifts.forEach((shift) => {
      const area = shift.area;
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
    return areaCounts;
  };

  const [areaCounts, setAreaCounts] = useState(getAreaCounts);

  const handleBookClick = (shift) => {
    // Check if the shift is not already booked
    if (!shift.booked) {
      // Check if the shift is not already in selectedShifts
      if (
        !selectedShifts.some((selectedShift) => selectedShift.id === shift.id)
      ) {
        // Set loading for the clicked shift
        setLoadingShiftId(shift.id);

        // Simulate an asynchronous operation (replace with actual API call)
        setTimeout(() => {
          // Add the selected shift to the selectedShifts array
          setSelectedShifts((prevSelectedShifts) => [
            ...prevSelectedShifts,
            shift,
          ]);

          // Update areaCounts
          setAreaCounts((prevAreaCounts) => {
            const updatedAreaCounts = { ...prevAreaCounts };
            const area = shift.area;
            updatedAreaCounts[area] = (updatedAreaCounts[area] || 0) + 1;
            return updatedAreaCounts;
          });

          // Remove loading state
          setLoadingShiftId(null);
        }, 1000); // Simulating a delay of 1 second, replace with actual API call duration
      } else {
        // Alert or handle the case where the shift is already selected
        console.warn("Shift is already selected.");
      }
    } else {
      // Alert or handle the case where the shift is already booked
      console.warn("Shift is already booked and cannot be added to the cart.");
    }
  };

  const handleCancelClick = (shiftId) => {
    // Find the canceled shift
    const canceledShift = selectedShifts.find((shift) => shift.id === shiftId);

    // Remove the canceled shift from the selectedShifts array
    setSelectedShifts((prevSelectedShifts) =>
      prevSelectedShifts.filter((shift) => shift.id !== shiftId)
    );

    // Update areaCounts for the canceled shift
    setAreaCounts((prevAreaCounts) => {
      const updatedAreaCounts = { ...prevAreaCounts };
      const area = canceledShift.area;
      updatedAreaCounts[area] = (updatedAreaCounts[area] || 0) - 1;
      return updatedAreaCounts;
    });
  };

  return (
    <div className="main-container">
      <div>
        <span
        className="shits-text"
          style={{
            
            color: selectedOption === "availableShifts" ? "#16A64D" : " #CBD2E1",
          }}
          onClick={() => setSelectedOption("availableShifts")}
        >
          Available Shifts
        </span>
        <span
        className="shits-text"
          style={{
            
            color: selectedOption === "selectedShifts" ? "#16A64D" : " #CBD2E1",
          }}
          onClick={() => setSelectedOption("selectedShifts")}
        >
          Selected Shifts
        </span>
      </div>
      <div>
        <div className="area-counts">
          {Object.entries(areaCounts).map(([area, count]) => (
            <p key={area}> {`${area}: (${count})`}</p>
          ))}
        </div>
      </div>

      <div className="shift-container">
        {selectedOption === "availableShifts" && (
          <div>
            <h3>Available Shifts:</h3>
            <div className="shift-table">
              <div className="header-row">
                <div>Start Time-End Time</div>
              </div>
              {getAvailableShifts().map((shift) => (
                <div key={shift.id} className="data-row">
                  <div>
                    <div>
                      {getStartTimeAndEndTime(shift).startTime}-
                      {getStartTimeAndEndTime(shift).endTime}
                    </div>
                      <button
                    className="btn-book"
                      onClick={() => handleBookClick(shift)}
                      disabled={loadingShiftId === shift.id || shift.booked}
                    >
                      {loadingShiftId === shift.id ? <Loading /> : "Book"}
                    </button>   
                    <button
                    className="cancel-button"
                    onClick={() => handleCancelClick(shift.id)}
                     // Check if the shift is canceled
                  >
                    cancle
                  </button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedOption === "selectedShifts" && (
          <div className="selected-shifts-container">
            <h3>Selected Shifts:</h3>
            <ul className="selected-shifts-list">
              {selectedShifts.map((shift) => (
                <li key={shift.id} className="selected-shift-item">
                  {`${getStartTimeAndEndTime(shift).startTime}-${
                    getStartTimeAndEndTime(shift).endTime
                  }`}
                <button
                    className="cancel-button"
                    onClick={() => handleCancelClick(shift.id)}
                     // Check if the shift is canceled
                  >
                    cancle
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

'use client'; 
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { findAllBookings } from "@/lib/utils/services/booking/booking-services";
import React, { useEffect, useState } from "react";

const CalendarPage = () => {
    const [month, setMonth] = useState(new Date());
    const [displayedDays, setDisplayedDays] = useState([]);
    const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getDisplayedDays = (month) => {
        console.log(month)
        const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
        // Find the first day of the grid (it may be from the previous month)
        const startDayOfGrid = new Date(firstDayOfMonth);
        const dayOfWeek = firstDayOfMonth.getDay(); // Day of week (0 = Sunday, 6 = Saturday)
    
        // If the first day of the month is not Sunday, adjust the start date to the previous Sunday
        startDayOfGrid.setDate(firstDayOfMonth.getDate() - dayOfWeek);
    
        // Calculate the last day of the displayed grid (it may go into the next month)
        const totalDaysToShow = 35; // 6 weeks * 7 days (most calendar grids show 6 rows)
        const displayedDaysArray = [];
    
        for (let i = 0; i < totalDaysToShow; i++) {
          const day = new Date(startDayOfGrid);
          day.setDate(startDayOfGrid.getDate() + i); // Increment each day
          displayedDaysArray.push(day);
        }
    
        setDisplayedDays(displayedDaysArray);
      };

      const getBookings = async () => {
        try {
            const response = await findAllBookings();
            if(!response) return;
            setBookings(response);

        } catch(error) {

        }
      }

    // When the month changes, recalculate the displayed days
    getDisplayedDays(month);
  }, [month]);

      const isNotCurrentMonth = (date: Date) => {
        if(!(date instanceof Date)) return; 
        return date.getMonth() !== month.getMonth();
      };

      
    
  return (
    <div>
      <Calendar mode="single" initialFocus onMonthChange={setMonth} />
      <div className="w-100">
      <div>
        <div className="grid grid-cols-7 grid-rows-5">
          {displayedDays.map((day, index) => (
            <div key={index} className={`px-2 py-8 min-h-[115px] min-w-[115px] relative border-collapse border border-slate-200 calendar-day ${isNotCurrentMonth(day) ? 'text-muted' : ''}`}>
                <span className="absolute top-1 right-2 mb-6">{day.getDate()}</span>
                {index === 5 &&
                <div className="bg-blue-200 gap-1 flex flex-col rounded-sm px-1 py-1">
                    <span className="block text-sm">Classing Lashes</span>
                    <span className="block text-sm">12:00 - 13:00</span>
                    <Badge className="block text-sm">Approved</Badge>
                </div>
                }
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CalendarPage;

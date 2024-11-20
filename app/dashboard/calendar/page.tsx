"use client";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { findAllBookings } from "@/lib/utils/services/booking/booking-services";
import { validateRequest } from "@/lib/validateRequest";
import React, { useEffect, useState } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { Booking } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

let clock: string[] = [];

for (let i = 0; i <= 24; i++) {
  let hr;

  if (i < 10) {
    hr = `0${i}`;
  } else {
    hr = i;
  }

  clock.push(`${hr}:00`);
  clock.push(`${hr}:30`);
}

const CalendarPage = () => {
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [displayedDays, setDisplayedDays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentView, setCurrentView] = useState<"month" | "week">("week");
  const [daysInWeek, setDaysInWeek] = useState<Date[]>([]);
  const [bookingsWeekView, setBookingsWeekView] = useState<Booking[]>();
  const [editAppointmentDialog, setEditAppointmentDialog] =
    useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    const getDisplayedDays = (month) => {
      const firstDayOfMonth = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
      );

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
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllBookings(user.name);
      if (!response) return;

      setBookings(response);
    };

    // When the month changes, recalculate the displayed days
    getDisplayedDays(month);
    getBookings();

    return () => {
      setBookings([]);
      setDisplayedDays([]);
    };
  }, [month]);

  const isNotCurrentMonth = (date: Date) => {
    if (!(date instanceof Date)) return;
    return date.getMonth() !== month.getMonth();
  };

  const isBooked = (date: Date) => {
    const result = bookings.filter((booking) => {
      if (
        booking.date.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
      )
        return booking;
    });

    return result;
  };

  const getBookingsInWeek = (weekStart: Date, weekEnd: Date) => {
    const bookingArr = bookings.filter((booking) => {
      if (booking.date >= weekStart && booking.date <= weekEnd) return booking;
    });
    setBookingsWeekView(bookingArr);
  };

  const handleSelected = (date?: Date) => {
    if (!date) return;

    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    let days: Date[] = [];

    weekDays.forEach((day, index) => {
      days.push(addDays(weekStart, index));
    });

    setDaysInWeek(days);

    getBookingsInWeek(days[0], days[days.length - 1]);
  };

  const createWeekViewBlock = (day: Date) => {
    let bookingtime: Date | null;
    const bookingObj = bookingsWeekView?.find((booking) => {
      bookingtime = booking.date;
      if (
        booking.date.toISOString().split("T")[0] ===
        day.toISOString().split("T")[0]
      )
        return booking;
    });

    const openingTime = new Date();
    openingTime.setHours(0, 0, 0);

    const bookingStart = new Date();
    bookingtime &&
      bookingStart.setHours(
        bookingtime.getHours(),
        bookingtime.getMinutes(),
        0
      );
    const minutes = bookingStart && bookingStart - openingTime;
    const calc = minutes && minutes / (1000 * 60);
    return (
      bookingObj && (
        <div
          className="bg-blue-200 gap-1 flex flex-col rounded-sm p-1 mb-1 cursor-pointer"
          style={{
            height: `${dynamicHeight("120")}px`,
            top: `${calc ? dynamicHeight(calc.toString()) : 0}px`,
          }}
          onClick={() => handleAppointmentClick(bookingObj.id)}
        >
          <span className="block text-sm capitalize">Classing Lashes</span>
          <span className="block text-sm capitalize">
            {weekDays[bookingObj.date.getDay()]}
          </span>
          <Badge className="block text-sm">Approved</Badge>
        </div>
      )
    );
  };

  const handleAppointmentClick = (booking: Booking) => {
    setEditAppointmentDialog(!editAppointmentDialog);
    setSelectedBooking(booking);
  };

  const dynamicHeight = (duration: string) => {
    const height = 48;
    const pxPerMin = height / 60;
    const currentHeight = pxPerMin * parseInt(duration);
    return currentHeight;
  };

  return (
    <div>
      <div>
        <label>
          Month
          <input
            type="checkbox"
            checked={currentView === "month" ? true : false}
            onChange={() => setCurrentView("month")}
          ></input>
        </label>
        <label>
          Week
          <input
            type="checkbox"
            checked={currentView === "week" ? true : false}
            onChange={() => setCurrentView("week")}
          ></input>
        </label>
      </div>
      <Calendar
        mode="single"
        initialFocus
        onSelect={handleSelected}
        selected={selectedDate}
      />
      {currentView === "month" && (
        <div className="w-100 relative">
          <div>
            <div className="grid grid-cols-7 grid-rows-5">
              {displayedDays.map((day, index) => (
                <div
                  key={index}
                  className={`px-2 py-8 min-h-[115px] min-w-[115px] relative border-collapse border border-slate-200 calendar-day ${
                    isNotCurrentMonth(day) ? "text-muted" : ""
                  }`}
                >
                  <span className="absolute top-1 right-2 mb-6">
                    {day.getDate()}
                  </span>
                  {isBooked(day).length
                    ? isBooked(day).map((booking, index) => (
                        <div
                          key={index}
                          className="bg-blue-200 gap-1 flex flex-col rounded-sm px-1 py-1 mb-1"
                        >
                          <span className="block text-sm">Classing Lashes</span>
                          <span className="block text-sm">
                            {booking.date
                              .toISOString()
                              .split("T")[1]
                              .slice(0, 5)}
                          </span>
                          <Badge className="block text-sm">Approved</Badge>
                        </div>
                      ))
                    : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === "week" && (
        <div className="relative w-full">
          <table className="table-fixed border-collapse w-full">
            <tr>
              <th className="h-[40px]  max-w-[150px] w-[150px] min-w-[150px] border"></th>
              {daysInWeek.length &&
                daysInWeek.map((day, index) => {
                  return (
                    <th
                      key={index}
                      className="min-h-[40px] h-[40px] w-[150px]  max-w-[150px] min-w-[150px] border"
                    >
                      <span className="block text-sm">
                        {weekDays[day.getDay()]} {day.getDate()}
                      </span>
                    </th>
                  );
                })}
            </tr>
            {clock.map((time, index) => {
              return (
                <tr key={index}>
                  <td
                    data-time={time}
                    className="h-[24px] max-w-[150px] w-[150px] min-w-[150px] border"
                  >
                    <span className="block text-sm">{time}</span>
                  </td>
                  <td className="w-full border" colSpan={7}></td>
                </tr>
              );
            })}
          </table>
          <table className="absolute left-0 top-[40px] h-full w-full table-fixed border-collapse">
            <tr>
              <td className="max-w-[150px] w-[150px]  min-w-[150px] border">
                &nbsp;
              </td>
              {daysInWeek.length &&
                daysInWeek.map((day, index) => {
                  return (
                    <td
                      // rowSpan={24}
                      key={index}
                      className="relative w-[150px] max-w-[150px]  min-w-[150px] border"
                    >
                      {createWeekViewBlock(day)}
                    </td>
                  );
                })}
            </tr>
          </table>
        </div>
      )}
      <Dialog
        open={editAppointmentDialog}
        onOpenChange={setEditAppointmentDialog}
      >
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit appointment</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex gap-3 flex-col"
            action={`/booking/edit/${selectedBooking?.id}`}
          >
            <Input
              name="service-name"
              type="text"
              placeholder="Service Name"
              className="w-full"
            />
            <Input
              name="description"
              type="text"
              placeholder="Description"
              className="w-full"
            />
            <Input
              name="price"
              type="text"
              placeholder="Price"
              className="w-full"
            />
            <Select></Select>
            <Button variant="outline">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;

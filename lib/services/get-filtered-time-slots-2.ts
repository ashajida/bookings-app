import { addMinutes, format, isBefore, parse } from "date-fns";
import { findOperationTimeByDay } from "../repository/aviability/aviability";
import { findBookingByDate } from "../repository/booking/booking";

export const getFilteredTimeSlotsByDate = async (
  date: Date,
  service,
  userId: string
) => {

  const bookings = await findBookingByDate(date, userId);
  if (!bookings.success) return;


  const bookingTimes = bookings.data.map((booking) =>
    format(booking.date, "HH:mm")
  ); // [09:00, 10:00, 11:00]

  console.log(bookings, 'times');


  const day = format(date, "EEEE").toLowerCase();

  const operationTime = await findOperationTimeByDay(day, userId); // Monday '09:00, 17:00'

  if (!operationTime.success) return;

  const openingClosingTimes = operationTime.data[day].split(","); // ['09:00', '17:00']

  const timeSlots = await genarateTimes(
    openingClosingTimes[0],
    openingClosingTimes[1],
    Number(service.duration)
  ); // list of  times from 09:00 to 17:00

  console.log(service, 'opening')


  const filteredTimeSlots = timeSlots.filter((time) => {
    if (!time) {
      console.log(time, "false...");
      return false;
    }

    const slotStart = parse(time, "HH:mm", new Date());
    const slotEnd = addMinutes(slotStart, Number(service.duration));

    return !bookingTimes.some((time) => {
      const bookingStart = parse(time, "HH:mm", new Date());
      const bookingEnd = addMinutes(bookingStart, Number(service.duration));

      // Check if the slot overlaps with the booking
      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) || // Slot starts during the booking
        (slotEnd > bookingStart && slotEnd <= bookingEnd) // Slot ends during the booking
      );
    });
  });

  return filteredTimeSlots;
};

const genarateTimes = (opening: string, closing: string, interval = 30) => {
  const times = [];
  let current = parse(opening, "HH:mm", new Date());
  const endTime = parse(closing, "HH:mm", new Date());

  while (isBefore(current, endTime)) {
    times.push(format(current, "HH:mm"));
    current = addMinutes(current, interval);
  }

  return times;
};

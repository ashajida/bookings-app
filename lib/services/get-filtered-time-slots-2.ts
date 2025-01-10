import { addMinutes, format, isBefore, parse } from "date-fns";
import { findOperationTimeByDay } from "../repository/aviability/aviability";
import { findBookingByDate } from "../repository/booking/booking";

export const getFilteredTimeSlotsByDate = async (
  date: Date,
  service,
  userId: string
) => {
  console.log(date, service, userId, "date, service, userId");
  // to book an appointment a user can select a date and a service and the app will return a list of available slots exluding slots already booked for that day

  // service
  // date

  // booking with the same service id and get the times and duration
  // timeslots

  const bookings = await findBookingByDate(date, userId);
  if (!bookings.success) return;

  const bookingTimes = bookings.data.map((booking) =>
    format(booking.date, "HH:mm")
  ); // [09:00, 10:00, 11:00]

  const day = format(date, 'EEEE').toLowerCase()

  const operationTime = await findOperationTimeByDay(day, userId); // Monday '09:00, 17:00'

  if (!operationTime.success) return;

  const openingClosingTimes = operationTime.data[day].split(","); // ['09:00', '17:00']


  const timeSlots = await genarateTimes(
    openingClosingTimes[0],
    openingClosingTimes[1],
    service.duration
  ); // list of  times from 09:00 to 17:00

  console.log(timeSlots, "timeSlots123");

  const filteredTimeSlots = timeSlots.filter((time) => {
    const slotStart = parse(time, "HH:mm", new Date());
    const slotEnd = addMinutes(slotStart, service.duration);

    return !bookingTimes.some(({ start, end }) => {
      const bookingStart = parse(start, "HH:mm", new Date());
      const bookingEnd = parse(end, "HH:mm", new Date());

      // Check if the slot overlaps with the booking
      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) || // Slot starts during the booking
        (slotEnd > bookingStart && slotEnd <= bookingEnd) // Slot ends during the booking
      );
    });
  });

  console.log(filteredTimeSlots, "filtered");
  return filteredTimeSlots;
};

const genarateTimes = (opening: string, closing: string, interval: number) => {
  const times = [];
  let current = parse(opening, "HH:mm", new Date());
  const endTime = parse(closing, "HH:mm", new Date());

  while (isBefore(current, endTime)) {
    times.push(format(current, "HH:mm"));
    current = addMinutes(current, interval);
  }

  return times;
};

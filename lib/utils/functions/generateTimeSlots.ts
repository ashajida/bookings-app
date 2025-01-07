import { Booking } from "@prisma/client";

type GenerateTimeSlotsOptions = {
  booked?: {[key: string]: any}[],
  blockedDates?: {[key: string]: any}[]
}

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  interval = 60,
  options: GenerateTimeSlotsOptions
) => {
  const [openingHr, openingMins] = startTime.split(':').map(Number)
  const [closingHr, closingMins] = endTime.split(':').map(Number);
  const {booked, blockedDates} = options;
  const times = [] as string[];

  const openingTime = new Date();
  openingTime.setHours(openingHr, openingMins, 0, 0)

  let current = new Date();

  current.setHours(
    openingTime.getHours(),
    openingTime.getMinutes(),
    0,
    0
  );

  // Set the start time (e.g., 9:00 AM)
  //current.setTime(startTime);

  const closingTime = new Date();
  closingTime.setHours(closingHr, closingMins)
  
  const end = new Date();
  end.setHours(
    closingTime.getHours(),
    closingTime.getMinutes(),
    0,
    0
  );

  // Generate times in the specified interval
  while (current <= end) {
    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");
    const timeSlot = `${hours}:${minutes}`;

    // Check if the current time slot falls within any booked range
    let isBooked = false;

    if (booked?.length) {
      for (const { date } of booked) {
        const _bookedDate = new Date(date);
        const bookedStart = new Date();
        bookedStart.setHours(
          _bookedDate.getHours(),
          _bookedDate.getMinutes(),
          0,
          0
        );

        // Calculate the end of the booked time slot based on its duration
        const bookedEnd = new Date(bookedStart);
        bookedEnd.setMinutes(bookedStart.getMinutes() + 50);
        // If the current time is within the booked range, mark it as booked
        if (current >= bookedStart && current < bookedEnd) {
          isBooked = true;
          break;
        }
      }
    }

    // If not booked, add the time slot to the list
    if (!isBooked) {
      times.push(timeSlot);
    }

    // Increment time by the interval (e.g., 60 minutes)
    current.setMinutes(current.getMinutes() + interval);
  }

  console.log(times, 'times....');

  return times;
};

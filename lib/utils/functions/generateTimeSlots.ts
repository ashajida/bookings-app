import { Booking } from "@prisma/client";

export const generateTimeSlots = (
  startTime: Date,
  endTime: Date,
  interval = 60,
  booked?: Booking[]
) => {
  const times = [] as string[];
  let current = startTime;

  console.log(booked, "here....");

  // Set the start time (e.g., 9:00 AM)
  //current.setTime(startTime);

  const end = endTime;
  // Set the end time (e.g., 6:00 PM / 18:00)
  //end.setHours(endTime);
  //end.setMinutes(0);

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
        console.log(_bookedDate.getHours(), "This hours");
        const bookedStart = new Date();
        bookedStart.setHours(
          _bookedDate.getHours(),
          _bookedDate.getMinutes(),
          0,
          0
        );

        // Calculate the end of the booked time slot based on its duration
        const bookedEnd = new Date(_bookedDate);
        bookedEnd.setMinutes(_bookedDate.getMinutes() + 50);

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

  return times;
};

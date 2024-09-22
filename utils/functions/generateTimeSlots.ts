export const generateTimeSlots = (
    startTime: number,
    endTime: number,
    interval = 60,
    booked?: { time: string; duration: number }[]
  ) => {
    const times = [] as string[];
    let current = new Date();
  
    // Set the start time (e.g., 9:00 AM)
    current.setHours(startTime);
    current.setMinutes(0);
  
    const end = new Date();
    // Set the end time (e.g., 6:00 PM / 18:00)
    end.setHours(endTime);
    end.setMinutes(0);
  
    // Generate times in the specified interval
    while (current <= end) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      const timeSlot = `${hours}:${minutes}`;
  
      // Check if the current time slot falls within any booked range
      let isBooked = false;
  
      if (booked) {
        for (const { time, duration } of booked) {
          const [bookedHours, bookedMinutes] = time.split(':').map(Number);
          const bookedStart = new Date();
          bookedStart.setHours(bookedHours, bookedMinutes, 0, 0);
  
          // Calculate the end of the booked time slot based on its duration
          const bookedEnd = new Date(bookedStart);
          bookedEnd.setMinutes(bookedEnd.getMinutes() + duration);
  
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
  }
  
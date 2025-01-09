import { format } from "date-fns";
import { getAviability } from "../http/avialability";
import { findBookingByDate } from "../repository/booking/booking";

export const getfilteredTimeSlots = async (date: Date, userId: string) => {
          const timeSlots = await getAviability({
            id: userId,
            chosenDate: date,
          });
    
          if (!timeSlots.success) return;
    
          const bookings = await findBookingByDate(date);
          if(!bookings.success) return;
          
          const timeSlotsArr = bookings.data.map((booking) => format(booking.date, "HH:mm"));
    
          const filteredTimeSlots = timeSlots.data.filter((time) => {
            return !timeSlotsArr.includes(time);
          });
    
          return filteredTimeSlots;
}
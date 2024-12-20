type CreateBookingData = {
    date: Date;
    serviceId: number;
    status: string;
    userId: string;
    customer: {
      firstName?: string;
      lastName?: string;
      email: string;
      phone?: number;
    };
  };
  

export const createBooking = async (data: CreateBookingData) => {
    const url = '/api/bookings'

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        return await response.json();
    } catch(error) {
        return {
            success: false,
            message: 'An error has occured.',
            error: error
        }
    }
}

export const deleteBooking = async (bookingId: string) => {
    const url = `/api/bookings?id=${bookingId}`

    try {
        const response = await fetch(url, {
            method: 'DELETE',
        })

        return await response.json();
    } catch(error) {
        return {
            success: false,
            message: 'An error has occured.',
            error: error
        }
    }
}


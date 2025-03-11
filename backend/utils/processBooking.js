const processBooking = (bookings, newBooking) => {
    const isOverlapping = (existingCheckIn, existingCheckOut, newCheckIn, newCheckOut) => {
        return (
            (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) || // New check-in during existing booking
            (newCheckOut > existingCheckIn && newCheckOut <= existingCheckOut) || // New check-out during existing booking
            (newCheckIn <= existingCheckIn && newCheckOut >= existingCheckOut) // New booking fully contains existing booking
        );
    };

    const newCheckIn = new Date(newBooking.checkIn);
    const newCheckOut = new Date(newBooking.checkOut);

    let bookingOverlaps = false;
    for (const booking of bookings) {
        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);

        if (isOverlapping(existingCheckIn, existingCheckOut, newCheckIn, newCheckOut)) {
            bookingOverlaps = true;
            break;
        }
    }

    const availableDates = [];
    const now = new Date();
    
    // Sort bookings by check-in date
    const sortedBookings = [...bookings].sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

    // Check if there's an available period before the first booking
    if (sortedBookings.length > 0) {
        const firstCheckIn = new Date(sortedBookings[0].checkIn);
        if (now < firstCheckIn) {
            availableDates.push({
                checkIn: now.toISOString(),
                checkOut: firstCheckIn.toISOString()
            });
        }
    }

    let previousCheckOut = null;
    
    for (const booking of sortedBookings) {
        const currentCheckIn = new Date(booking.checkIn);
        const currentCheckOut = new Date(booking.checkOut);

        if (previousCheckOut && currentCheckIn > previousCheckOut) {
            availableDates.push({
                checkIn: previousCheckOut.toISOString(),
                checkOut: currentCheckIn.toISOString()
            });
        }

        previousCheckOut = previousCheckOut && previousCheckOut > currentCheckOut ? previousCheckOut : currentCheckOut;
    }

    // Add availability after the last booking
    if (previousCheckOut) {
        availableDates.push({
            checkIn: previousCheckOut.toISOString(),
            checkOut: "undefined"
        });
    }

    return {
        roomAvailable: !bookingOverlaps,
        bookingOverlaps,
        availableDates
    };
};

export default processBooking;

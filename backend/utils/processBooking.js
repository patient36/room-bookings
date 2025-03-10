const processBooking = (bookings, newBooking) => {
    const isOverlapping = (existingCheckIn, existingCheckOut, newCheckIn, newCheckOut) => {
        return (
            (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) || // New check-in is during an existing booking
            (newCheckOut > existingCheckIn && newCheckOut <= existingCheckOut) || // New check-out is during an existing booking
            (newCheckIn <= existingCheckIn && newCheckOut >= existingCheckOut) // New booking fully contains an existing booking
        );
    };

    // Validate the new booking
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

    // Calculate available dates
    const availableDates = [];
    let previousCheckOut = null;

    // Sort bookings by check-in date
    const sortedBookings = [...bookings].sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

    for (const booking of sortedBookings) {
        const currentCheckIn = new Date(booking.checkIn);
        const currentCheckOut = new Date(booking.checkOut);

        // If there's a gap between the previous checkout and the current check-in
        if (previousCheckOut && currentCheckIn > previousCheckOut) {
            availableDates.push({
                checkIn: previousCheckOut.toISOString(),
                checkOut: currentCheckIn.toISOString()
            });
        }

        // Update previousCheckOut to the latest checkout date
        if (!previousCheckOut || currentCheckOut > previousCheckOut) {
            previousCheckOut = currentCheckOut;
        }
    }

    // Add availability after the last booking (if any)
    if (previousCheckOut) {
        availableDates.push({
            checkIn: previousCheckOut.toISOString(),
            checkOut: "undefined" // The room is available indefinitely
        });
    }

    // Return the result object
    return {
        roomAvailable: !bookingOverlaps,
        bookingOverlaps: bookingOverlaps,
        availableDates: availableDates
    };
}

export default processBooking
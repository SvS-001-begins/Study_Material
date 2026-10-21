package model;

import exceptions.SeatAlreadyBookedException;
import java.util.Vector;

public class Flight implements Bookable {
    private int flightId;
    private String flightNumber;
    private String source;
    private String destination;
    private String date;
    private String time;
    private String aircraft;
    private int totalSeats;
    private int distance;
    private Vector<Seat> seats;

    public Flight(int flightId, String flightNumber, String source, String destination,
                  String date, String time, String aircraft, int totalSeats, int distance) {
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.source = source;
        this.destination = destination;
        this.date = date;
        this.time = time;
        this.aircraft = aircraft;
        this.totalSeats = totalSeats;
        this.distance = distance;
        this.seats = new Vector<>();
        initializeSeats();
    }

    public Flight(int flightId, String flightNumber, String source, String destination,
                  String date, String time, String aircraft, int totalSeats) {
        this(flightId, flightNumber, source, destination, date, time, aircraft, totalSeats, 1000);
    }

    public void initializeSeats() {
        int economySeats = (int) (totalSeats * 0.6);
        int businessSeats = (int) (totalSeats * 0.25);
        int firstClassSeats = totalSeats - economySeats - businessSeats;

        double calculatedBasePrice = distance * 5.0;
        double basePrice = Math.max(calculatedBasePrice, 2000.0);

        double economyBasePrice = basePrice;
        double businessBasePrice = basePrice;
        double firstClassBasePrice = basePrice;

        for (int i = 1; i <= economySeats; i++) {
            seats.add(new EconomySeat(i, economyBasePrice));
        }

        for (int i = economySeats + 1; i <= economySeats + businessSeats; i++) {
            seats.add(new BusinessSeat(i, businessBasePrice));
        }

        for (int i = economySeats + businessSeats + 1; i <= totalSeats; i++) {
            seats.add(new FirstClassSeat(i, firstClassBasePrice));
        }
    }

    public Seat getSeat(int seatNumber) {
        for (Seat seat : seats) {
            if (seat.getSeatNumber() == seatNumber) {
                return seat;
            }
        }
        return null;
    }

    public Vector<Seat> getAvailableSeats() {
        Vector<Seat> availableSeats = new Vector<>();
        for (Seat seat : seats) {
            if (!seat.isBooked()) {
                availableSeats.add(seat);
            }
        }
        return availableSeats;
    }

    @Override
    public synchronized Seat bookSeat(int seatNumber) throws SeatAlreadyBookedException {
        Seat seat = getSeat(seatNumber);

        if (seat == null) {
            return null;
        }

        if (seat.bookSeat()) {
            return seat;
        } else {
            throw new SeatAlreadyBookedException(seatNumber);
        }
    }

    public boolean isSeatAvailable(int seatNumber) {
        Seat seat = getSeat(seatNumber);
        return seat != null && !seat.isBooked();
    }

    public double calculateTotalFare(double baseFare, int bookedCount, int totalSeats) {
        if (bookedCount == 0) {
            return baseFare;
        }

        double bookingPercentage = (double) bookedCount / totalSeats;

        if (bookingPercentage > 0.8) {
            return calculateTotalFare(baseFare * 1.2, bookedCount - 1, totalSeats);
        } else if (bookingPercentage > 0.5) {
            return calculateTotalFare(baseFare * 1.1, bookedCount - 1, totalSeats);
        } else {
            return baseFare;
        }
    }

    public double calculateTotalFare(Seat seat) {
        int bookedCount = totalSeats - getAvailableSeats().size();
        return calculateTotalFare(seat.getPrice(), bookedCount, totalSeats);
    }

    @Override
    public boolean cancelBooking(int bookingId) {
        return true;
    }

    public int getFlightId() {
        return flightId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getAircraft() {
        return aircraft;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public Vector<Seat> getSeats() {
        return seats;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public int getBookedSeatCount() {
        int count = 0;
        for (Seat seat : seats) {
            if (seat.isBooked()) {
                count++;
            }
        }
        return count;
    }

    public String getSeatClass(int seatNumber) {
        int economySeats = (int) (totalSeats * 0.6);
        int businessSeats = (int) (totalSeats * 0.25);

        if (seatNumber <= economySeats) {
            return "Economy";
        } else if (seatNumber <= economySeats + businessSeats) {
            return "Business";
        } else {
            return "First Class";
        }
    }

    @Override
    public String toString() {
        String[] dateParts = date.split("-");
        String formattedDate = dateParts[2] + " " + getMonthName(dateParts[1]) + " " + dateParts[0];

        return flightNumber + " | " + source + " \u2192 " + destination + " | " + formattedDate + " | " + time;
    }

    private String getMonthName(String monthNumber) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        int monthIndex = Integer.parseInt(monthNumber) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return months[monthIndex];
        }
        return monthNumber;
    }
}

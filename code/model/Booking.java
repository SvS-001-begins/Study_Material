package model;

import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Booking {
    private int bookingId;
    private int flightId;
    private Passenger passenger;
    private Seat seat;
    private String seatClass;
    private double fare;
    private String bookingDate;

    public Booking(int bookingId, int flightId, Passenger passenger, Seat seat,
                   String seatClass, double fare, String bookingDate) {
        this.bookingId = bookingId;
        this.flightId = flightId;
        this.passenger = passenger;
        this.seat = seat;
        this.seatClass = seatClass;
        this.fare = fare;
        this.bookingDate = bookingDate;
    }

    public void exportTicket(String filename) throws IOException {
        FileWriter writer = new FileWriter(filename);
        try {
            writer.write(generateTicketText());
        } finally {
            writer.close();
        }
    }

    public String generateTicketText() {
        StringBuilder ticket = new StringBuilder();

        ticket.append("=================================================\n");
        ticket.append("           AIRLINE TICKET / BOARDING PASS         \n");
        ticket.append("=================================================\n\n");

        ticket.append("BOOKING ID: ").append(bookingId).append("\n");
        ticket.append("BOOKING DATE: ").append(bookingDate).append("\n\n");

        ticket.append("PASSENGER DETAILS:\n");
        ticket.append("  Name: ").append(passenger.getName()).append("\n");
        ticket.append("  Age: ").append(passenger.getAge()).append("\n");
        ticket.append("  Gender: ").append(passenger.getGender()).append("\n");
        ticket.append("  ID Proof: ").append(passenger.getIdProofType()).append("\n");
        ticket.append("  ID Number: ").append(passenger.getIdProofNumber()).append("\n");
        ticket.append("  Contact: ").append(passenger.getContactNumber()).append("\n\n");

        ticket.append("FLIGHT DETAILS:\n");
        ticket.append("  Flight ID: ").append(flightId).append("\n");
        ticket.append("  Seat Number: ").append(seat.getSeatNumber()).append("\n");
        ticket.append("  Seat Class: ").append(seatClass).append("\n");
        ticket.append("  Baggage Allowance: ").append(seat.getBaggageAllowance()).append(" kg\n\n");

        ticket.append("FARE DETAILS:\n");
        ticket.append("  Total Fare: Rs. ").append(String.format("%.2f", fare)).append("\n\n");

        ticket.append("=================================================\n");
        ticket.append("  Thank you for choosing our airline!            \n");
        ticket.append("  Please arrive at the airport 2 hours before    \n");
        ticket.append("  departure time.                                 \n");
        ticket.append("=================================================\n");

        return ticket.toString();
    }

    public String getSummary() {
        return bookingId + " | " + passenger.getName() + " | Seat " + seat.getSeatNumber() +
               " (" + seatClass + ") | Rs. " + String.format("%.2f", fare);
    }

    public int getBookingId() {
        return bookingId;
    }

    public int getFlightId() {
        return flightId;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public Seat getSeat() {
        return seat;
    }

    public String getSeatClass() {
        return seatClass;
    }

    public double getFare() {
        return fare;
    }

    public String getBookingDate() {
        return bookingDate;
    }
}

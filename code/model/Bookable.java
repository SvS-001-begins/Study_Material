package model;

public interface Bookable {
    model.Seat bookSeat(int seatNumber) throws exceptions.SeatAlreadyBookedException;
    boolean cancelBooking(int bookingId);
}

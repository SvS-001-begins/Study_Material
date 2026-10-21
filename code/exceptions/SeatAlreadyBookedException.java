package exceptions;

public class SeatAlreadyBookedException extends Exception {
    private int seatNumber;

    public SeatAlreadyBookedException(int seatNumber) {
        super("Seat " + seatNumber + " is already booked.");
        this.seatNumber = seatNumber;
    }

    public int getSeatNumber() {
        return seatNumber;
    }
}

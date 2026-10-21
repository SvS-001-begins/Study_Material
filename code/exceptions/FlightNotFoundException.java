package exceptions;

public class FlightNotFoundException extends Exception {
    private int flightId;

    public FlightNotFoundException(int flightId) {
        super("Flight with ID " + flightId + " not found.");
        this.flightId = flightId;
    }

    public int getFlightId() {
        return flightId;
    }
}

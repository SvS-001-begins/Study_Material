package model;

public abstract class Seat {
    private int seatNumber;
    private boolean isBooked;
    private double basePrice;

    public Seat(int seatNumber, double basePrice) {
        this.seatNumber = seatNumber;
        this.isBooked = false;
        this.basePrice = basePrice;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        this.isBooked = booked;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public abstract double getPrice();

    public abstract int getBaggageAllowance();

    public synchronized boolean bookSeat() {
        if (this.isBooked) {
            return false;
        }
        this.isBooked = true;
        return true;
    }

    public void cancelBooking() {
        this.isBooked = false;
    }
}

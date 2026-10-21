package model;

public class FirstClassSeat extends Seat {
    public FirstClassSeat(int seatNumber, double basePrice) {
        super(seatNumber, basePrice);
    }

    @Override
    public double getPrice() {
        return getBasePrice() * 2.0;
    }

    @Override
    public int getBaggageAllowance() {
        return 50;
    }
}

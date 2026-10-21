package model;

public class BusinessSeat extends Seat {
    public BusinessSeat(int seatNumber, double basePrice) {
        super(seatNumber, basePrice);
    }

    @Override
    public double getPrice() {
        return getBasePrice() * 1.5;
    }

    @Override
    public int getBaggageAllowance() {
        return 35;
    }
}

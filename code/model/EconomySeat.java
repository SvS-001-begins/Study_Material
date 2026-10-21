package model;

public class EconomySeat extends Seat {
    public EconomySeat(int seatNumber, double basePrice) {
        super(seatNumber, basePrice);
    }

    @Override
    public double getPrice() {
        return getBasePrice();
    }

    @Override
    public int getBaggageAllowance() {
        return 20;
    }
}

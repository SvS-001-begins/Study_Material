package db;

import model.Booking;
import model.Flight;
import model.Passenger;
import model.Seat;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Vector;

public class BookingDAO {
    private Connection connection;
    private FlightDAO flightDAO;

    public BookingDAO() {
        try {
            connection = DatabaseConnection.getConnection();
            flightDAO = new FlightDAO();
        } catch (SQLException e) {
            System.err.println("Error connecting to database: " + e.getMessage());
        }
    }

    public boolean addBooking(Booking booking) {
        String sql = "INSERT INTO bookings (flight_id, passenger_name, passenger_age, passenger_gender, " +
                     "id_proof_type, id_proof_number, contact_number, seat_number, seat_class, fare, booking_date) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setInt(1, booking.getFlightId());
            statement.setString(2, booking.getPassenger().getName());
            statement.setInt(3, booking.getPassenger().getAge());
            statement.setString(4, booking.getPassenger().getGender());
            statement.setString(5, booking.getPassenger().getIdProofType());
            statement.setString(6, booking.getPassenger().getIdProofNumber());
            statement.setString(7, booking.getPassenger().getContactNumber());
            statement.setInt(8, booking.getSeat().getSeatNumber());
            statement.setString(9, booking.getSeatClass());
            statement.setDouble(10, booking.getFare());
            statement.setString(11, booking.getBookingDate());

            int rowsAffected = statement.executeUpdate();

            if (rowsAffected > 0) {
                ResultSet generatedKeys = statement.getGeneratedKeys();
                if (generatedKeys.next()) {
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error adding booking: " + e.getMessage());
        }
        return false;
    }

    public Booking getBooking(int bookingId) {
        String sql = "SELECT * FROM bookings WHERE booking_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, bookingId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return extractBookingFromResultSet(resultSet);
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving booking: " + e.getMessage());
        }

        return null;
    }

    public Vector<Booking> getAllBookings() {
        Vector<Booking> bookings = new Vector<>();
        String sql = "SELECT * FROM bookings ORDER BY booking_date DESC";

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {

            while (resultSet.next()) {
                bookings.add(extractBookingFromResultSet(resultSet));
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving bookings: " + e.getMessage());
        }

        return bookings;
    }

    public Vector<Booking> getBookingsByFlight(int flightId) {
        Vector<Booking> bookings = new Vector<>();
        String sql = "SELECT * FROM bookings WHERE flight_id = ? ORDER BY booking_date DESC";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);

            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                bookings.add(extractBookingFromResultSet(resultSet));
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving bookings for flight: " + e.getMessage());
        }

        return bookings;
    }

    public Vector<Booking> getBookingsByPassengerId(String idProofNumber) {
        Vector<Booking> bookings = new Vector<>();
        String sql = "SELECT * FROM bookings WHERE id_proof_number = ? ORDER BY booking_date DESC";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, idProofNumber);

            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                bookings.add(extractBookingFromResultSet(resultSet));
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving bookings for passenger: " + e.getMessage());
        }

        return bookings;
    }

    public boolean hasPassengerBookedOnFlight(int flightId, String idProofNumber) {
        String sql = "SELECT COUNT(*) FROM bookings WHERE flight_id = ? AND id_proof_number = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);
            statement.setString(2, idProofNumber);

            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1) > 0;
            }
        } catch (SQLException e) {
            System.err.println("Error checking passenger booking: " + e.getMessage());
        }

        return false;
    }

    public boolean cancelBooking(int bookingId) {
        String sql = "DELETE FROM bookings WHERE booking_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, bookingId);

            int rowsAffected = statement.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Error cancelling booking: " + e.getMessage());
            return false;
        }
    }

    private Booking extractBookingFromResultSet(ResultSet resultSet) throws SQLException {
        int bookingId = resultSet.getInt("booking_id");
        int flightId = resultSet.getInt("flight_id");

        Passenger passenger = new Passenger(
            resultSet.getString("passenger_name"),
            resultSet.getInt("passenger_age"),
            resultSet.getString("passenger_gender"),
            resultSet.getString("id_proof_type"),
            resultSet.getString("id_proof_number"),
            resultSet.getString("contact_number")
        );

        int seatNumber = resultSet.getInt("seat_number");
        String seatClass = resultSet.getString("seat_class");
        double fare = resultSet.getDouble("fare");
        String bookingDate = resultSet.getString("booking_date");

        Seat seat = new Seat(seatNumber, fare) {
            @Override
            public double getPrice() {
                return fare;
            }

            @Override
            public int getBaggageAllowance() {
                return seatClass.equals("Business") ? 35 : 20;
            }
        };

        seat.setBooked(true);

        return new Booking(bookingId, flightId, passenger, seat, seatClass, fare, bookingDate);
    }
}

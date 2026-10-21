package db;

import model.Flight;
import exceptions.FlightNotFoundException;
import java.sql.*;
import java.util.Vector;

public class FlightDAO {
    private Connection connection;

    public FlightDAO() {
        try {
            connection = DatabaseConnection.getConnection();
        } catch (SQLException e) {
            System.err.println("Error connecting to database: " + e.getMessage());
        }
    }

    public boolean addFlight(Flight flight) {
        String sql = "INSERT INTO flights (flight_number, source, destination, date, time, aircraft, total_seats, distance) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, flight.getFlightNumber());
            statement.setString(2, flight.getSource());
            statement.setString(3, flight.getDestination());
            statement.setString(4, flight.getDate());
            statement.setString(5, flight.getTime());
            statement.setString(6, flight.getAircraft());
            statement.setInt(7, flight.getTotalSeats());
            statement.setInt(8, flight.getDistance());

            int rowsAffected = statement.executeUpdate();

            if (rowsAffected > 0) {
                ResultSet generatedKeys = statement.getGeneratedKeys();
                if (generatedKeys.next()) {
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error adding flight: " + e.getMessage());
        }
        return false;
    }

    public Flight getFlight(int flightId) throws FlightNotFoundException {
        String sql = "SELECT * FROM flights WHERE flight_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return extractFlightFromResultSet(resultSet);
            } else {
                throw new FlightNotFoundException(flightId);
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving flight: " + e.getMessage());
            throw new FlightNotFoundException(flightId);
        }
    }

    public Vector<Flight> getAllFlights() {
        Vector<Flight> flights = new Vector<>();
        String sql = "SELECT * FROM flights ORDER BY date, time";

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {

            while (resultSet.next()) {
                flights.add(extractFlightFromResultSet(resultSet));
            }
        } catch (SQLException e) {
            System.err.println("Error retrieving flights: " + e.getMessage());
        }

        return flights;
    }

    public boolean updateFlight(Flight flight) {
        String sql = "UPDATE flights SET flight_number = ?, source = ?, destination = ?, " +
                     "date = ?, time = ?, aircraft = ?, total_seats = ?, distance = ? WHERE flight_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, flight.getFlightNumber());
            statement.setString(2, flight.getSource());
            statement.setString(3, flight.getDestination());
            statement.setString(4, flight.getDate());
            statement.setString(5, flight.getTime());
            statement.setString(6, flight.getAircraft());
            statement.setInt(7, flight.getTotalSeats());
            statement.setInt(8, flight.getDistance());
            statement.setInt(9, flight.getFlightId());

            int rowsAffected = statement.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.err.println("Error updating flight: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteBookingsForFlight(int flightId) {
        String sql = "DELETE FROM bookings WHERE flight_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);

            int rowsAffected = statement.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.err.println("Error deleting bookings for flight: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteFlight(int flightId) {
        try {
            if (!deleteBookingsForFlight(flightId)) {
                System.err.println("Failed to delete bookings for flight " + flightId);
                return false;
            }

            String sql = "DELETE FROM flights WHERE flight_id = ?";

            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setInt(1, flightId);

                int rowsAffected = statement.executeUpdate();
                return rowsAffected > 0;
            }
        } catch (Exception e) {
            System.err.println("Error deleting flight: " + e.getMessage());
            return false;
        }
    }

    private Flight extractFlightFromResultSet(ResultSet resultSet) throws SQLException {
        int flightId = resultSet.getInt("flight_id");
        String flightNumber = resultSet.getString("flight_number");
        String source = resultSet.getString("source");
        String destination = resultSet.getString("destination");
        String date = resultSet.getString("date");
        String time = resultSet.getString("time");
        String aircraft = resultSet.getString("aircraft");
        int totalSeats = resultSet.getInt("total_seats");

        int distance;
        try {
            distance = resultSet.getInt("distance");
            if (resultSet.wasNull()) {
                distance = 1000;
            }
        } catch (SQLException e) {
            distance = 1000;
        }

        Flight flight = new Flight(flightId, flightNumber, source, destination,
                                   date, time, aircraft, totalSeats, distance);

        return flight;
    }

    public int getBookedSeatCount(int flightId) {
        String sql = "SELECT COUNT(*) FROM bookings WHERE flight_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);

            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("Error getting booked seat count: " + e.getMessage());
        }

        return 0;
    }

    public Vector<Integer> getBookedSeatNumbers(int flightId) {
        Vector<Integer> bookedSeats = new Vector<>();
        String sql = "SELECT seat_number FROM bookings WHERE flight_id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, flightId);

            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                bookedSeats.add(resultSet.getInt("seat_number"));
            }
        } catch (SQLException e) {
            System.err.println("Error getting booked seat numbers: " + e.getMessage());
        }

        return bookedSeats;
    }
}

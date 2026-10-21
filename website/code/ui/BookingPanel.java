package ui;

import db.BookingDAO;
import db.FlightDAO;
import exceptions.InvalidPassengerException;
import exceptions.SeatAlreadyBookedException;
import model.Booking;
import model.Flight;
import model.Passenger;
import model.Seat;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Vector;

public class BookingPanel {
    private JPanel panel;
    private JComboBox<Flight> flightComboBox;
    private JTextField nameField;
    private JTextField ageField;
    private JComboBox<String> genderComboBox;
    private JComboBox<String> idTypeComboBox;
    private JTextField idNumberField;
    private JTextField contactField;
    private JComboBox<String> seatClassComboBox;
    private SeatMapPanel seatMapPanel;
    private JButton bookButton;

    private FlightDAO flightDAO;
    private BookingDAO bookingDAO;
    private Flight selectedFlight;
    private int selectedSeatNumber = -1;

    public BookingPanel() {
        flightDAO = new FlightDAO();
        bookingDAO = new BookingDAO();
        initializeUI();
        loadFlights();
    }

    private void initializeUI() {
        panel = new JPanel(new BorderLayout());

        JPanel formPanel = createFormPanel();

        seatMapPanel = new SeatMapPanel();
        seatMapPanel.setSeatSelectionListener(new SeatMapPanel.SeatSelectionListener() {
            @Override
            public void seatSelected(int seatNumber) {
                selectedSeatNumber = seatNumber;
                if (selectedFlight != null) {
                    String seatClass = selectedFlight.getSeatClass(seatNumber);
                    seatClassComboBox.setSelectedItem(seatClass);
                    seatClassComboBox.setEnabled(false);
                }
            }
        });

        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, formPanel, seatMapPanel.getPanel());
        splitPane.setDividerLocation(400);
        splitPane.setResizeWeight(0.5);

        panel.add(splitPane, BorderLayout.CENTER);
    }

    private JPanel createFormPanel() {
        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createTitledBorder("Passenger Details"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Select Flight:"), gbc);
        gbc.gridx = 1;
        flightComboBox = new JComboBox<>();
        flightComboBox.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                selectedFlight = (Flight) flightComboBox.getSelectedItem();
                if (selectedFlight != null) {
                    updateSeatMap();
                    seatClassComboBox.setEnabled(true);
                    selectedSeatNumber = -1;
                }
            }
        });
        formPanel.add(flightComboBox, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        formPanel.add(new JLabel("Full Name:"), gbc);
        gbc.gridx = 1;
        nameField = new JTextField(20);
        formPanel.add(nameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        formPanel.add(new JLabel("Age:"), gbc);
        gbc.gridx = 1;
        ageField = new JTextField(20);
        formPanel.add(ageField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        formPanel.add(new JLabel("Gender:"), gbc);
        gbc.gridx = 1;
        genderComboBox = new JComboBox<>(new String[]{"Male", "Female", "Other"});
        formPanel.add(genderComboBox, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        formPanel.add(new JLabel("ID Proof Type:"), gbc);
        gbc.gridx = 1;
        idTypeComboBox = new JComboBox<>(new String[]{"Aadhaar", "Passport", "Driving License"});
        formPanel.add(idTypeComboBox, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        formPanel.add(new JLabel("ID Proof Number:"), gbc);
        gbc.gridx = 1;
        idNumberField = new JTextField(20);
        formPanel.add(idNumberField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 6;
        formPanel.add(new JLabel("Contact Number:"), gbc);
        gbc.gridx = 1;
        contactField = new JTextField(20);
        formPanel.add(contactField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 7;
        formPanel.add(new JLabel("Seat Class:"), gbc);
        gbc.gridx = 1;
        seatClassComboBox = new JComboBox<>(new String[]{"Economy", "Business", "First Class"});
        formPanel.add(seatClassComboBox, gbc);

        gbc.gridx = 1;
        gbc.gridy = 8;
        bookButton = new JButton("Book Seat");
        bookButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                bookSeat();
            }
        });
        formPanel.add(bookButton, gbc);

        return formPanel;
    }

    private void loadFlights() {
        flightComboBox.removeAllItems();
        Vector<Flight> flights = flightDAO.getAllFlights();

        for (Flight flight : flights) {
            flightComboBox.addItem(flight);
        }

        if (flights.size() > 0) {
            selectedFlight = flights.get(0);
            updateSeatMap();
        }
    }

    private void updateSeatMap() {
        if (selectedFlight != null) {
            Vector<Integer> bookedSeats = flightDAO.getBookedSeatNumbers(selectedFlight.getFlightId());

            for (Integer seatNum : bookedSeats) {
                Seat seat = selectedFlight.getSeat(seatNum);
                if (seat != null) {
                    seat.setBooked(true);
                }
            }

            seatMapPanel.setFlight(selectedFlight);
        }
    }

    private void bookSeat() {
        try {
            if (selectedFlight == null) {
                JOptionPane.showMessageDialog(panel,
                    "Please select a flight.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (selectedSeatNumber == -1) {
                JOptionPane.showMessageDialog(panel,
                    "Please select a seat from the seat map.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            String name = nameField.getText().trim();
            String ageStr = ageField.getText().trim();
            String gender = (String) genderComboBox.getSelectedItem();
            String idType = (String) idTypeComboBox.getSelectedItem();
            String idNumber = idNumberField.getText().trim();
            String contact = contactField.getText().trim();
            String seatClass = (String) seatClassComboBox.getSelectedItem();

            if (name.isEmpty() || ageStr.isEmpty() || idNumber.isEmpty() || contact.isEmpty()) {
                JOptionPane.showMessageDialog(panel,
                    "Please fill in all required fields.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            int age;
            try {
                age = Integer.parseInt(ageStr);
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(panel,
                    "Age must be a valid number.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            Passenger passenger = new Passenger(name, age, gender, idType, idNumber, contact);

            try {
                passenger.validate();
            } catch (InvalidPassengerException e) {
                JOptionPane.showMessageDialog(panel,
                    e.getErrorMessage(),
                    "Validation Error: " + e.getFieldName(),
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (bookingDAO.hasPassengerBookedOnFlight(selectedFlight.getFlightId(), idNumber)) {
                JOptionPane.showMessageDialog(panel,
                    "This passenger already has a booking on this flight.",
                    "Duplicate Booking",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            Seat seat = selectedFlight.getSeat(selectedSeatNumber);
            if (seat == null) {
                JOptionPane.showMessageDialog(panel,
                    "Invalid seat number.",
                    "Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (!selectedFlight.isSeatAvailable(selectedSeatNumber)) {
                JOptionPane.showMessageDialog(panel,
                    "This seat is already booked.",
                    "Seat Not Available",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            String actualSeatClass = selectedFlight.getSeatClass(selectedSeatNumber);
            String selectedSeatClass = (String) seatClassComboBox.getSelectedItem();
            if (!actualSeatClass.equals(selectedSeatClass)) {
                JOptionPane.showMessageDialog(panel,
                    "Seat class mismatch. Seat " + selectedSeatNumber + " is " + actualSeatClass + " class, but you selected " + selectedSeatClass + ".",
                    "Seat Class Mismatch",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            double fare = selectedFlight.calculateTotalFare(seat);

            try {
                Seat bookedSeat = selectedFlight.bookSeat(selectedSeatNumber);

                if (bookedSeat == null) {
                    JOptionPane.showMessageDialog(panel,
                        "Failed to book seat.",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
                    return;
                }

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String bookingDate = sdf.format(new Date());

                Booking booking = new Booking(0, selectedFlight.getFlightId(), passenger,
                                               bookedSeat, seatClass, fare, bookingDate);

                if (bookingDAO.addBooking(booking)) {
                    JOptionPane.showMessageDialog(panel,
                        "Booking successful!\n\n" +
                        "Booking Details:\n" +
                        "Flight: " + selectedFlight.getFlightNumber() + "\n" +
                        "Passenger: " + passenger.getName() + "\n" +
                        "Seat: " + bookedSeat.getSeatNumber() + " (" + seatClass + ")\n" +
                        "Fare: Rs. " + String.format("%.2f", fare),
                        "Booking Confirmed",
                        JOptionPane.INFORMATION_MESSAGE);

                    clearForm();
                    updateSeatMap();
                } else {
                    bookedSeat.cancelBooking();
                    JOptionPane.showMessageDialog(panel,
                        "Failed to save booking to database.",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
                }

            } catch (SeatAlreadyBookedException e) {
                JOptionPane.showMessageDialog(panel,
                    "This seat was just booked by another user.",
                    "Seat Already Booked",
                    JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(panel,
                "Error during booking: " + e.getMessage(),
                "Error",
                JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    private void clearForm() {
        nameField.setText("");
        ageField.setText("");
        idNumberField.setText("");
        contactField.setText("");
        selectedSeatNumber = -1;
        seatClassComboBox.setEnabled(true);
    }

    public void refreshData() {
        loadFlights();
    }

    public JPanel getPanel() {
        return panel;
    }
}

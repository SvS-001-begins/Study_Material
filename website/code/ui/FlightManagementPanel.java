package ui;

import db.FlightDAO;
import model.Flight;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Vector;

public class FlightManagementPanel {
    private JPanel panel;
    private JTextField flightNumberField;
    private JTextField sourceField;
    private JTextField destinationField;
    private JTextField dateField;
    private JTextField timeField;
    private JTextField aircraftField;
    private JTextField seatsField;
    private JTextField distanceField;
    private JTable flightsTable;
    private DefaultTableModel tableModel;
    private FlightDAO flightDAO;

    public FlightManagementPanel() {
        flightDAO = new FlightDAO();
        initializeUI();
        loadFlights();
    }

    private void initializeUI() {
        panel = new JPanel(new BorderLayout());

        JPanel formPanel = createFormPanel();
        JPanel tablePanel = createTablePanel();

        panel.add(formPanel, BorderLayout.NORTH);
        panel.add(tablePanel, BorderLayout.CENTER);
    }

    private JPanel createFormPanel() {
        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createTitledBorder("Add New Flight"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Flight Number:"), gbc);
        gbc.gridx = 1;
        flightNumberField = new JTextField(15);
        formPanel.add(flightNumberField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        formPanel.add(new JLabel("Source:"), gbc);
        gbc.gridx = 1;
        sourceField = new JTextField(15);
        formPanel.add(sourceField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        formPanel.add(new JLabel("Destination:"), gbc);
        gbc.gridx = 1;
        destinationField = new JTextField(15);
        formPanel.add(destinationField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        formPanel.add(new JLabel("Date (YYYY-MM-DD):"), gbc);
        gbc.gridx = 1;
        dateField = new JTextField(15);
        formPanel.add(dateField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        formPanel.add(new JLabel("Time (HH:MM):"), gbc);
        gbc.gridx = 1;
        timeField = new JTextField(15);
        formPanel.add(timeField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        formPanel.add(new JLabel("Aircraft:"), gbc);
        gbc.gridx = 1;
        aircraftField = new JTextField(15);
        formPanel.add(aircraftField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 6;
        formPanel.add(new JLabel("Total Seats:"), gbc);
        gbc.gridx = 1;
        seatsField = new JTextField(15);
        formPanel.add(seatsField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 7;
        formPanel.add(new JLabel("Distance (km):"), gbc);
        gbc.gridx = 1;
        distanceField = new JTextField(15);
        formPanel.add(distanceField, gbc);

        gbc.gridx = 1;
        gbc.gridy = 8;
        JButton addButton = new JButton("Add Flight");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                addFlight();
            }
        });
        formPanel.add(addButton, gbc);

        gbc.gridx = 1;
        gbc.gridy = 9;
        JButton refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                loadFlights();
            }
        });
        formPanel.add(refreshButton, gbc);

        gbc.gridx = 1;
        gbc.gridy = 10;
        JButton deleteButton = new JButton("Delete Flight");
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                deleteFlight();
            }
        });
        formPanel.add(deleteButton, gbc);

        return formPanel;
    }

    private JPanel createTablePanel() {
        JPanel tablePanel = new JPanel(new BorderLayout());
        tablePanel.setBorder(BorderFactory.createTitledBorder("All Flights"));

        String[] columnNames = {"Flight ID", "Flight Number", "Source", "Destination",
                               "Date", "Time", "Aircraft", "Total Seats", "Distance (km)"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        flightsTable = new JTable(tableModel);

        JScrollPane scrollPane = new JScrollPane(flightsTable);
        tablePanel.add(scrollPane, BorderLayout.CENTER);

        return tablePanel;
    }

    private void addFlight() {
        try {
            String flightNumber = flightNumberField.getText().trim();
            String source = sourceField.getText().trim();
            String destination = destinationField.getText().trim();
            String date = dateField.getText().trim();
            String time = timeField.getText().trim();
            String aircraft = aircraftField.getText().trim();
            String seatsStr = seatsField.getText().trim();
            String distanceStr = distanceField.getText().trim();

            if (flightNumber.isEmpty() || source.isEmpty() || destination.isEmpty() ||
                date.isEmpty() || time.isEmpty() || aircraft.isEmpty() || seatsStr.isEmpty() || distanceStr.isEmpty()) {
                JOptionPane.showMessageDialog(panel,
                    "Please fill in all fields.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            int totalSeats;
            try {
                totalSeats = Integer.parseInt(seatsStr);
                if (totalSeats <= 0) {
                    JOptionPane.showMessageDialog(panel,
                        "Total seats must be a positive number.",
                        "Validation Error",
                        JOptionPane.ERROR_MESSAGE);
                    return;
                }
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(panel,
                    "Total seats must be a valid number.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            int distance;
            try {
                distance = Integer.parseInt(distanceStr);
                if (distance <= 0) {
                    JOptionPane.showMessageDialog(panel,
                        "Distance must be a positive number.",
                        "Validation Error",
                        JOptionPane.ERROR_MESSAGE);
                    return;
                }
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(panel,
                    "Distance must be a valid number.",
                    "Validation Error",
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            Flight flight = new Flight(0, flightNumber, source, destination,
                                       date, time, aircraft, totalSeats, distance);

            if (flightDAO.addFlight(flight)) {
                JOptionPane.showMessageDialog(panel,
                    "Flight added successfully!",
                    "Success",
                    JOptionPane.INFORMATION_MESSAGE);

                clearForm();
                loadFlights();
            } else {
                JOptionPane.showMessageDialog(panel,
                    "Failed to add flight.",
                    "Error",
                    JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(panel,
                "Error adding flight: " + e.getMessage(),
                "Error",
                JOptionPane.ERROR_MESSAGE);
        }
    }

    public void loadFlights() {
        tableModel.setRowCount(0);

        Vector<Flight> flights = flightDAO.getAllFlights();

        for (Flight flight : flights) {
            Object[] row = {
                flight.getFlightId(),
                flight.getFlightNumber(),
                flight.getSource(),
                flight.getDestination(),
                flight.getDate(),
                flight.getTime(),
                flight.getAircraft(),
                flight.getTotalSeats(),
                flight.getDistance()
            };
            tableModel.addRow(row);
        }
    }

    private void deleteFlight() {
        try {
            int selectedRow = flightsTable.getSelectedRow();
            if (selectedRow == -1) {
                JOptionPane.showMessageDialog(panel,
                    "Please select a flight from the table to delete.",
                    "No Flight Selected",
                    JOptionPane.WARNING_MESSAGE);
                return;
            }

            int flightId = (int) tableModel.getValueAt(selectedRow, 0);
            String flightNumber = (String) tableModel.getValueAt(selectedRow, 1);
            String source = (String) tableModel.getValueAt(selectedRow, 2);
            String destination = (String) tableModel.getValueAt(selectedRow, 3);
            String date = (String) tableModel.getValueAt(selectedRow, 4);

            int confirm = JOptionPane.showConfirmDialog(panel,
                "Are you sure you want to delete this flight?\n\n" +
                "Flight: " + flightNumber + "\n" +
                "Route: " + source + " \u2192 " + destination + "\n" +
                "Date: " + date + "\n\n" +
                "WARNING: This will also delete ALL bookings for this flight!",
                "Confirm Delete",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.WARNING_MESSAGE);

            if (confirm == JOptionPane.YES_OPTION) {
                if (flightDAO.deleteFlight(flightId)) {
                    JOptionPane.showMessageDialog(panel,
                        "Flight and all associated bookings deleted successfully!",
                        "Success",
                        JOptionPane.INFORMATION_MESSAGE);

                    loadFlights();
                } else {
                    JOptionPane.showMessageDialog(panel,
                        "Failed to delete flight.",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
                }
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(panel,
                "Error deleting flight: " + e.getMessage(),
                "Error",
                JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearForm() {
        flightNumberField.setText("");
        sourceField.setText("");
        destinationField.setText("");
        dateField.setText("");
        timeField.setText("");
        aircraftField.setText("");
        seatsField.setText("");
        distanceField.setText("");
    }

    public void refreshData() {
        loadFlights();
    }

    public JPanel getPanel() {
        return panel;
    }
}

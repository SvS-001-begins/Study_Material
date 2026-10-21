package ui;

import db.BookingDAO;
import model.Booking;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Vector;

public class ViewBookingsPanel {
    private JPanel panel;
    private JTable bookingsTable;
    private DefaultTableModel tableModel;
    private JButton cancelButton;
    private JButton exportButton;
    private JButton refreshButton;
    private BookingDAO bookingDAO;

    public ViewBookingsPanel() {
        bookingDAO = new BookingDAO();
        initializeUI();
        loadBookings();
    }

    private void initializeUI() {
        panel = new JPanel(new BorderLayout());

        JPanel buttonPanel = createButtonPanel();
        JPanel tablePanel = createTablePanel();

        panel.add(buttonPanel, BorderLayout.NORTH);
        panel.add(tablePanel, BorderLayout.CENTER);
    }

    private JPanel createButtonPanel() {
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));

        cancelButton = new JButton("Cancel Booking");
        cancelButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cancelBooking();
            }
        });
        buttonPanel.add(cancelButton);

        exportButton = new JButton("Export Ticket");
        exportButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                exportTicket();
            }
        });
        buttonPanel.add(exportButton);

        refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                loadBookings();
            }
        });
        buttonPanel.add(refreshButton);

        return buttonPanel;
    }

    private JPanel createTablePanel() {
        JPanel tablePanel = new JPanel(new BorderLayout());
        tablePanel.setBorder(BorderFactory.createTitledBorder("All Bookings"));

        String[] columnNames = {"Booking ID", "Flight ID", "Passenger Name", "Seat Number",
                               "Seat Class", "Fare", "Booking Date"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        bookingsTable = new JTable(tableModel);

        JScrollPane scrollPane = new JScrollPane(bookingsTable);
        tablePanel.add(scrollPane, BorderLayout.CENTER);

        return tablePanel;
    }

    public void loadBookings() {
        tableModel.setRowCount(0);

        Vector<Booking> bookings = bookingDAO.getAllBookings();

        for (Booking booking : bookings) {
            Object[] row = {
                booking.getBookingId(),
                booking.getFlightId(),
                booking.getPassenger().getName(),
                booking.getSeat().getSeatNumber(),
                booking.getSeatClass(),
                String.format("%.2f", booking.getFare()),
                booking.getBookingDate()
            };
            tableModel.addRow(row);
        }
    }

    private void cancelBooking() {
        int selectedRow = bookingsTable.getSelectedRow();

        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(panel,
                "Please select a booking to cancel.",
                "No Selection",
                JOptionPane.WARNING_MESSAGE);
            return;
        }

        int bookingId = (int) tableModel.getValueAt(selectedRow, 0);

        int confirm = JOptionPane.showConfirmDialog(panel,
            "Are you sure you want to cancel booking ID " + bookingId + "?",
            "Confirm Cancellation",
            JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            if (bookingDAO.cancelBooking(bookingId)) {
                JOptionPane.showMessageDialog(panel,
                    "Booking cancelled successfully.",
                    "Success",
                    JOptionPane.INFORMATION_MESSAGE);

                loadBookings();
            } else {
                JOptionPane.showMessageDialog(panel,
                    "Failed to cancel booking.",
                    "Error",
                    JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void exportTicket() {
        int selectedRow = bookingsTable.getSelectedRow();

        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(panel,
                "Please select a booking to export.",
                "No Selection",
                JOptionPane.WARNING_MESSAGE);
            return;
        }

        int bookingId = (int) tableModel.getValueAt(selectedRow, 0);

        Booking booking = bookingDAO.getBooking(bookingId);

        if (booking == null) {
            JOptionPane.showMessageDialog(panel,
                "Failed to retrieve booking details.",
                "Error",
                JOptionPane.ERROR_MESSAGE);
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save Ticket");
        fileChooser.setSelectedFile(new java.io.File("ticket_" + bookingId + ".txt"));

        int userSelection = fileChooser.showSaveDialog(panel);

        if (userSelection == JFileChooser.APPROVE_OPTION) {
            java.io.File fileToSave = fileChooser.getSelectedFile();

            try {
                booking.exportTicket(fileToSave.getAbsolutePath());

                JOptionPane.showMessageDialog(panel,
                    "Ticket exported successfully to:\n" + fileToSave.getAbsolutePath(),
                    "Export Successful",
                    JOptionPane.INFORMATION_MESSAGE);

            } catch (Exception e) {
                JOptionPane.showMessageDialog(panel,
                    "Failed to export ticket: " + e.getMessage(),
                    "Export Error",
                    JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public void refreshData() {
        loadBookings();
    }

    public JPanel getPanel() {
        return panel;
    }
}

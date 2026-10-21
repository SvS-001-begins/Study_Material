package ui;

import javax.swing.*;
import java.awt.*;

public class MainWindow {
    private JFrame frame;
    private BookingPanel bookingPanel;
    private FlightManagementPanel flightManagementPanel;
    private ViewBookingsPanel viewBookingsPanel;

    public MainWindow() {
        initializeUI();
    }

    private void initializeUI() {
        frame = new JFrame("Airline Ticket Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1000, 700);
        frame.setLocationRelativeTo(null);

        bookingPanel = new BookingPanel();
        flightManagementPanel = new FlightManagementPanel();
        viewBookingsPanel = new ViewBookingsPanel();

        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.addTab("Book Flight", bookingPanel.getPanel());
        tabbedPane.addTab("Manage Flights", flightManagementPanel.getPanel());
        tabbedPane.addTab("View Bookings", viewBookingsPanel.getPanel());

        tabbedPane.addChangeListener(new javax.swing.event.ChangeListener() {
            @Override
            public void stateChanged(javax.swing.event.ChangeEvent e) {
                int selectedIndex = tabbedPane.getSelectedIndex();
                if (selectedIndex == 0) {
                    bookingPanel.refreshData();
                } else if (selectedIndex == 1) {
                    flightManagementPanel.refreshData();
                } else if (selectedIndex == 2) {
                    viewBookingsPanel.refreshData();
                }
            }
        });

        frame.add(tabbedPane, BorderLayout.CENTER);

        JMenuBar menuBar = createMenuBar();
        frame.setJMenuBar(menuBar);

        frame.setVisible(true);
    }

    private JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();

        JMenu fileMenu = new JMenu("File");
        JMenuItem exitItem = new JMenuItem("Exit");
        exitItem.addActionListener(new java.awt.event.ActionListener() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                System.exit(0);
            }
        });
        fileMenu.add(exitItem);
        menuBar.add(fileMenu);

        JMenu helpMenu = new JMenu("Help");
        JMenuItem aboutItem = new JMenuItem("About");
        aboutItem.addActionListener(new java.awt.event.ActionListener() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                JOptionPane.showMessageDialog(frame,
                    "Airline Ticket Management System\n\n" +
                    "Features:\n" +
                    "- Book seats with visual seat map\n" +
                    "- Manage flights\n" +
                    "- View and cancel bookings\n" +
                    "- Export tickets\n\n" +
                    "Version 1.0",
                    "About",
                    JOptionPane.INFORMATION_MESSAGE);
            }
        });
        helpMenu.add(aboutItem);
        menuBar.add(helpMenu);

        return menuBar;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                try {
                    UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                new MainWindow();
            }
        });
    }
}

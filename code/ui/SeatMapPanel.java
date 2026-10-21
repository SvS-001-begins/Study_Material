package ui;

import model.Flight;
import model.Seat;
import javax.swing.*;
import java.awt.*;
import java.util.HashMap;
import java.util.Vector;

public class SeatMapPanel {
    private JPanel panel;
    private Vector<JButton> seatButtons;
    private HashMap<Integer, Integer> seatNumberToButtonIndex;
    private Flight selectedFlight;
    private int selectedSeatNumber = -1;
    private SeatSelectionListener seatSelectionListener;

    private static final int[] SEAT_LAYOUT = {3, 4, 2};
    private static final String[] SEAT_LABELS = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};

    public interface SeatSelectionListener {
        void seatSelected(int seatNumber);
    }

    public SeatMapPanel() {
        panel = new JPanel(new BorderLayout());
        seatButtons = new Vector<>();
        seatNumberToButtonIndex = new HashMap<>();
        initializeSeatMap();
    }

    private void initializeSeatMap() {
        JScrollPane scrollPane = new JScrollPane();
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);

        JPanel seatsPanel = new JPanel();
        seatsPanel.setLayout(new BoxLayout(seatsPanel, BoxLayout.Y_AXIS));
        seatsPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel placeholderLabel = new JLabel("Select a flight to view seat map");
        placeholderLabel.setHorizontalAlignment(SwingConstants.CENTER);
        seatsPanel.add(placeholderLabel);

        scrollPane.setViewportView(seatsPanel);
        panel.add(scrollPane, BorderLayout.CENTER);

        JPanel legendPanel = createLegendPanel();
        panel.add(legendPanel, BorderLayout.SOUTH);
    }

    private JPanel createLegendPanel() {
        JPanel legendPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        legendPanel.setBorder(BorderFactory.createTitledBorder("Legend"));

        JButton availableLegend = new JButton("Available");
        availableLegend.setBackground(Color.GREEN);
        availableLegend.setEnabled(false);
        availableLegend.setOpaque(true);
        legendPanel.add(availableLegend);

        JButton bookedLegend = new JButton("Booked");
        bookedLegend.setBackground(Color.RED);
        bookedLegend.setEnabled(false);
        bookedLegend.setOpaque(true);
        legendPanel.add(bookedLegend);

        JButton selectedLegend = new JButton("Selected");
        selectedLegend.setBackground(Color.BLUE);
        selectedLegend.setForeground(Color.WHITE);
        selectedLegend.setEnabled(false);
        selectedLegend.setOpaque(true);
        legendPanel.add(selectedLegend);

        JButton firstClassLegend = new JButton("First Class");
        firstClassLegend.setBackground(new Color(255, 215, 0));
        firstClassLegend.setEnabled(false);
        firstClassLegend.setOpaque(true);
        legendPanel.add(firstClassLegend);

        JButton businessLegend = new JButton("Business");
        businessLegend.setBackground(new Color(135, 206, 250));
        businessLegend.setEnabled(false);
        businessLegend.setOpaque(true);
        legendPanel.add(businessLegend);

        JButton economyLegend = new JButton("Economy");
        economyLegend.setBackground(new Color(144, 238, 144));
        economyLegend.setEnabled(false);
        economyLegend.setOpaque(true);
        legendPanel.add(economyLegend);

        return legendPanel;
    }

    public void setFlight(Flight flight) {
        this.selectedFlight = flight;
        this.selectedSeatNumber = -1;
        updateSeatButtons();
    }

    private void updateSeatButtons() {
        if (selectedFlight == null) {
            for (JButton button : seatButtons) {
                button.setEnabled(false);
                button.setBackground(null);
                button.setForeground(Color.BLACK);
            }
            return;
        }

        Vector<Seat> seats = selectedFlight.getSeats();
        int totalSeats = selectedFlight.getTotalSeats();

        int economySeats = (int) (totalSeats * 0.6);
        int businessSeats = (int) (totalSeats * 0.25);
        int firstClassStart = economySeats + businessSeats + 1;

        JPanel seatsPanel = new JPanel();
        seatsPanel.setLayout(new BoxLayout(seatsPanel, BoxLayout.Y_AXIS));
        seatsPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        seatButtons.clear();
        seatNumberToButtonIndex.clear();

        int seatsPerRow = 9;

        if (firstClassStart <= totalSeats) {
            addSection(seatsPanel, seats, firstClassStart - 1, totalSeats - 1, "First Class", seatsPerRow);

            JLabel divider1 = new JLabel("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
            divider1.setForeground(Color.GRAY);
            divider1.setAlignmentX(Component.CENTER_ALIGNMENT);
            seatsPanel.add(divider1);
            seatsPanel.add(Box.createVerticalStrut(5));
        }

        int businessStart = economySeats + 1;
        if (businessStart <= firstClassStart - 1) {
            addSection(seatsPanel, seats, businessStart - 1, firstClassStart - 2, "Business", seatsPerRow);

            JLabel divider2 = new JLabel("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
            divider2.setForeground(Color.GRAY);
            divider2.setAlignmentX(Component.CENTER_ALIGNMENT);
            seatsPanel.add(divider2);
            seatsPanel.add(Box.createVerticalStrut(5));
        }

        if (economySeats > 0) {
            addSection(seatsPanel, seats, 0, economySeats - 1, "Economy", seatsPerRow);
        }

        JScrollPane scrollPane = (JScrollPane) panel.getComponent(0);
        scrollPane.setViewportView(seatsPanel);
    }

    private Color getClassColor(String seatClass) {
        switch (seatClass) {
            case "First Class":
                return new Color(255, 215, 0);
            case "Business":
                return new Color(135, 206, 250);
            case "Economy":
                return new Color(144, 238, 144);
            default:
                return Color.GREEN;
        }
    }

    private void addSection(JPanel seatsPanel, Vector<Seat> seats, int startIndex, int endIndex, String sectionName, int seatsPerRow) {
        JLabel sectionLabel = new JLabel(sectionName.toUpperCase());
        sectionLabel.setFont(new Font("Arial", Font.BOLD, 14));
        sectionLabel.setForeground(getClassColor(sectionName));
        sectionLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        seatsPanel.add(sectionLabel);
        seatsPanel.add(Box.createVerticalStrut(5));

        int currentSeatIndex = startIndex;

        while (currentSeatIndex <= endIndex) {
            JPanel rowPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 5));
            int labelIndex = 0;

            for (int group = 0; group < SEAT_LAYOUT.length; group++) {
                for (int i = 0; i < SEAT_LAYOUT[group]; i++) {
                    if (currentSeatIndex + labelIndex <= endIndex && currentSeatIndex + labelIndex < seats.size()) {
                        Seat seat = seats.get(currentSeatIndex + labelIndex);
                        final int seatNum = seat.getSeatNumber();

                        int rowNumber = (seatNum - 1) / seatsPerRow + 1;
                        int seatPositionInRow = (seatNum - 1) % seatsPerRow;
                        String seatLabel = rowNumber + SEAT_LABELS[seatPositionInRow];

                        JButton seatButton = new JButton(seatLabel);
                        seatButton.setPreferredSize(new Dimension(45, 35));

                        if (seat.isBooked()) {
                            seatButton.setBackground(Color.RED);
                            seatButton.setEnabled(false);
                            seatButton.setToolTipText("Seat " + seatLabel + " - Booked");
                        } else {
                            seatButton.setBackground(getClassColor(sectionName));
                            seatButton.setEnabled(true);
                            seatButton.setToolTipText("Seat " + seatLabel + " - Available (" + sectionName + ")");

                            seatButton.addActionListener(new java.awt.event.ActionListener() {
                                @Override
                                public void actionPerformed(java.awt.event.ActionEvent e) {
                                    handleSeatClick(seatNum);
                                }
                            });
                        }

                        seatButton.setOpaque(true);
                        seatButton.setBorderPainted(true);
                        seatButton.setForeground(Color.BLACK);
                        rowPanel.add(seatButton);
                        seatButtons.add(seatButton);
                        seatNumberToButtonIndex.put(seatNum, seatButtons.size() - 1);

                        labelIndex++;
                    }
                }

                if (group < SEAT_LAYOUT.length - 1) {
                    JLabel aisleLabel = new JLabel("   ");
                    rowPanel.add(aisleLabel);
                }
            }

            seatsPanel.add(rowPanel);
            seatsPanel.add(Box.createVerticalStrut(3));

            currentSeatIndex += seatsPerRow;
        }
    }

    private void handleSeatClick(int seatNumber) {
        if (selectedSeatNumber != -1) {
            Integer prevIndex = seatNumberToButtonIndex.get(selectedSeatNumber);
            if (prevIndex != null && prevIndex >= 0 && prevIndex < seatButtons.size()) {
                JButton prevButton = seatButtons.get(prevIndex);
                if (prevButton.isEnabled()) {
                    String seatClass = selectedFlight.getSeatClass(selectedSeatNumber);
                    prevButton.setBackground(getClassColor(seatClass));
                    prevButton.setForeground(Color.BLACK);
                }
            }
        }

        selectedSeatNumber = seatNumber;
        Integer buttonIndex = seatNumberToButtonIndex.get(seatNumber);
        if (buttonIndex != null && buttonIndex >= 0 && buttonIndex < seatButtons.size()) {
            JButton selectedButton = seatButtons.get(buttonIndex);
            selectedButton.setBackground(Color.BLUE);
            selectedButton.setForeground(Color.WHITE);
        }

        if (seatSelectionListener != null) {
            seatSelectionListener.seatSelected(seatNumber);
        }
    }

    public void setSeatSelectionListener(SeatSelectionListener listener) {
        this.seatSelectionListener = listener;
    }

    public int getSelectedSeatNumber() {
        return selectedSeatNumber;
    }

    public JPanel getPanel() {
        return panel;
    }
}

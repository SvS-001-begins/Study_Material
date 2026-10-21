window.STUDY_DATA = {
    projectMeta: {
        title: "Airline Ticket Management System",
        subtitle: "Beginner-Friendly Study Guide · Java Swing + MySQL",
        totalFiles: 20,
        javaFiles: 19,
        sqlFiles: 1,
        packages: ["model", "db", "exceptions", "ui"],
        compileCmd: 'javac -cp ".;mysql-connector-j.jar" -d . model/*.java db/*.java exceptions/*.java ui/*.java',
        runCmd: 'java -cp ".;mysql-connector-j.jar" ui.MainWindow'
    },
    oopConcepts: [
        {
            id: "encapsulation",
            title: "1. Encapsulation (Data Hiding)",
            badge: "private + Getters/Setters",
            summary: "Think of encapsulation like putting data inside a protective capsule. We mark variables as 'private' so outside code cannot accidentally mess them up.",
            files: ["model/Seat.java", "model/Passenger.java", "model/Booking.java", "model/Flight.java"],
            details: "Instead of letting any file change a seat's price or passenger's age directly, we make variables 'private' and provide 'public' methods (like getName() or bookSeat()) to read or update them safely."
        },
        {
            id: "abstraction",
            title: "2. Abstraction (Hiding Complexity)",
            badge: "abstract class",
            summary: "Abstraction gives us a general blueprint of a 'Seat' without worrying about whether it is Economy, Business, or First Class yet.",
            files: ["model/Seat.java", "model/Bookable.java"],
            details: "In Seat.java, we write 'public abstract double getPrice();' with no body. This says: 'Every seat MUST have a price, but each specific seat class will decide how to calculate it.'"
        },
        {
            id: "inheritance",
            title: "3. Inheritance (Parent & Child Classes)",
            badge: "extends",
            summary: "Child classes inherit variables and methods from a parent class so we don't have to copy-paste the same code three times.",
            files: ["model/EconomySeat.java", "model/BusinessSeat.java", "model/FirstClassSeat.java"],
            details: "EconomySeat, BusinessSeat, and FirstClassSeat all use 'extends Seat'. They automatically get seatNumber, isBooked, and basePrice from Seat, and use 'super(seatNumber, basePrice)' to pass values to the parent constructor."
        },
        {
            id: "polymorphism",
            title: "4. Polymorphism (Same Method, Different Behavior)",
            badge: "@Override & Overloading",
            summary: "Polymorphism means 'many forms'. Calling seat.getPrice() automatically runs the right formula depending on what kind of seat it is.",
            files: ["model/EconomySeat.java", "model/BusinessSeat.java", "model/FirstClassSeat.java", "model/Flight.java"],
            details: "1) Method Overriding (@Override): EconomySeat returns 1x base price, BusinessSeat returns 1.5x, FirstClassSeat returns 2x. 2) Method Overloading: Flight has two constructors and two calculateTotalFare() methods with different parameter lists."
        },
        {
            id: "interfaces",
            title: "5. Interfaces (Rulebook / Contract)",
            badge: "interface & implements",
            summary: "An interface is a 100% empty checklist of methods. Any class that 'implements' it promises to write the code for all those methods.",
            files: ["model/Bookable.java", "model/Flight.java", "ui/SeatMapPanel.java"],
            details: "Bookable.java requires bookSeat() and cancelBooking(). Flight implements Bookable, so Java forces Flight to provide both methods. SeatMapPanel also uses a small interface (SeatSelectionListener) to notify BookingPanel when a seat button is clicked."
        },
        {
            id: "composition",
            title: "6. Composition ('Has-A' Relationship)",
            badge: "Objects Inside Objects",
            summary: "Instead of inheriting, one class can hold objects of other classes inside it as variables—just like a real ticket contains a Passenger and a Seat.",
            files: ["model/Booking.java", "model/Flight.java", "ui/MainWindow.java"],
            details: "A Booking object 'has a' Passenger object and 'has a' Seat object inside it. When printing a ticket, Booking simply asks passenger.getName() and seat.getBaggageAllowance()."
        },
        {
            id: "singleton",
            title: "7. Singleton & DAO Patterns",
            badge: "Database Organization",
            summary: "Singleton ensures we only open ONE database connection for the whole app. DAO (Data Access Object) keeps all SQL queries neatly in the db/ folder.",
            files: ["db/DatabaseConnection.java", "db/FlightDAO.java", "db/BookingDAO.java"],
            details: "DatabaseConnection makes its constructor 'private' so nobody can create extra connections with 'new'. FlightDAO and BookingDAO act as translators between Java objects and MySQL tables."
        },
        {
            id: "multithreading",
            title: "8. Thread Safety (Preventing Double-Booking)",
            badge: "synchronized & Vector",
            summary: "Think of 'synchronized' like a lock on a room door: only one thread can enter bookSeat() at a time, so two people can never book the same seat at once.",
            files: ["model/Seat.java", "model/Flight.java", "ui/MainWindow.java"],
            details: "We also use Vector instead of ArrayList because Vector is thread-safe, and SwingUtilities.invokeLater() in MainWindow so the UI starts safely on Java's GUI thread."
        },
        {
            id: "recursion",
            title: "9. Recursion (A Method Calling Itself)",
            badge: "Dynamic Pricing",
            summary: "Recursion is when a method calls itself with a smaller number until it hits a stopping point (the base case).",
            files: ["model/Flight.java"],
            details: "In Flight.calculateTotalFare(), as more seats on the plane get booked (>50% full or >80% full), the method calls itself with (bookedCount - 1) to increase the ticket price step by step, stopping when bookedCount reaches 0 or occupancy drops to 50%."
        },
        {
            id: "exceptions_io",
            title: "10. Custom Exceptions & Saving Files",
            badge: "try-catch & FileWriter",
            summary: "Custom exceptions let us create our own clear error messages (like 'InvalidPassengerException'), and FileWriter lets us save a boarding pass as a .txt file.",
            files: ["exceptions/InvalidPassengerException.java", "exceptions/SeatAlreadyBookedException.java", "exceptions/FlightNotFoundException.java", "model/Booking.java"],
            details: "In Booking.exportTicket(), we use FileWriter inside a try-finally block so the text file is always saved and closed properly even if an error happens."
        }
    ],
    architectureFlow: [
        {
            step: "Step 1: Starting the App",
            title: "MainWindow Opens the 3 Tabs",
            desc: "When you run the program, MainWindow.java creates a 1000x700 window with 3 tabs at the top: 'Book Flight', 'Manage Flights', and 'View Bookings'."
        },
        {
            step: "Step 2: Connecting to MySQL",
            title: "DatabaseConnection Opens a Single Link",
            desc: "FlightDAO and BookingDAO ask DatabaseConnection.java for a connection to the 'airline_management' database in MySQL on port 3306."
        },
        {
            step: "Step 3: Creating Flights & Seats",
            title: "Splitting Seats into 3 Cabin Classes",
            desc: "For every flight loaded from MySQL, Flight.java automatically creates seats in memory: first 60% are Economy (1x price), next 25% are Business (1.5x price), and last 15% are First Class (2x price)."
        },
        {
            step: "Step 4: Drawing the Visual Seat Map",
            title: "Color-Coding Available vs. Booked Seats",
            desc: "BookingPanel asks MySQL which seat numbers are already booked, marks them as booked, and SeatMapPanel draws rows of 9 seats (3-4-2 layout) with red buttons for booked seats."
        },
        {
            step: "Step 5: Booking & Saving a Ticket",
            title: "Check Form -> Lock Seat -> Save to MySQL",
            desc: "When you click 'Book Seat', BookingPanel checks your name/age/ID/phone, checks you haven't already booked this flight, calculates the fare, locks the seat, and saves the booking to MySQL."
        }
    ],
    files: [
        {
            id: "database_setup.sql",
            name: "database_setup.sql",
            pkg: "sql",
            path: "code/database_setup.sql",
            page: "pages/database_setup.html",
            role: "This SQL script sets up our MySQL database from scratch. It creates the database, creates the 'flights' and 'bookings' tables, adds safety rules, and inserts 5 sample flights so we can test the app right away.",
            concepts: ["MySQL Database", "Primary & Foreign Keys", "Unique Seat Rule", "Sample Data"],
            code: `CREATE DATABASE IF NOT EXISTS airline_management;
USE airline_management;

CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    aircraft VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    distance INT DEFAULT 1000,
    CONSTRAINT chk_total_seats CHECK (total_seats > 0),
    CONSTRAINT chk_distance CHECK (distance > 0)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_age INT NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL,
    id_proof_type VARCHAR(50) NOT NULL,
    id_proof_number VARCHAR(50) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    seat_number INT NOT NULL,
    seat_class VARCHAR(20) NOT NULL,
    fare DOUBLE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_passenger_age CHECK (passenger_age >= 0 AND passenger_age <= 120),
    CONSTRAINT chk_fare CHECK (fare >= 0),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT uk_flight_seat UNIQUE (flight_id, seat_number)
);

CREATE INDEX idx_id_proof ON bookings(id_proof_number);
CREATE INDEX idx_flight_id ON bookings(flight_id);

INSERT INTO flights (flight_number, source, destination, date, time, aircraft, total_seats, distance) VALUES
('AI-101', 'Delhi', 'Mumbai', '2024-08-15', '09:00:00', 'Boeing 737', 100, 1400),
('AI-102', 'Mumbai', 'Bangalore', '2024-08-15', '14:30:00', 'Airbus A320', 120, 1100),
('AI-103', 'Delhi', 'Chennai', '2024-08-16', '10:00:00', 'Boeing 737', 100, 2200),
('AI-104', 'Bangalore', 'Delhi', '2024-08-16', '16:00:00', 'Airbus A320', 120, 2200),
('AI-105', 'Mumbai', 'Kolkata', '2024-08-17', '08:00:00', 'Boeing 737', 100, 1750);

SELECT 'Database setup completed successfully!' AS Message;
SELECT COUNT(*) AS TotalFlights FROM flights;`,
            fields: [
                { name: "flights.flight_id", type: "INT AUTO_INCREMENT PRIMARY KEY", desc: "A unique ID number (1, 2, 3...) that MySQL automatically gives to every new flight." },
                { name: "flights.flight_number", type: "VARCHAR(20) UNIQUE", desc: "The flight code like 'AI-101'. Marked UNIQUE so two flights can't have the same code." },
                { name: "flights.distance", type: "INT DEFAULT 1000", desc: "Distance of the flight in km. Used by Java to calculate the base ticket price (distance * 5)." },
                { name: "bookings.booking_id", type: "INT AUTO_INCREMENT PRIMARY KEY", desc: "A unique ticket number automatically generated for every booking." },
                { name: "bookings.uk_flight_seat", type: "UNIQUE (flight_id, seat_number)", desc: "Prevents the database from ever saving two bookings for the exact same seat on the same flight." }
            ],
            walkthrough: [
                {
                    sig: "1. Create and Select the Database",
                    lines: [1, 2],
                    desc: "Creates a new database folder in MySQL named 'airline_management' and tells MySQL to put our tables inside it.",
                    points: [
                        "Line 1: 'IF NOT EXISTS' prevents an error if you run this script a second time.",
                        "Line 2: 'USE airline_management;' selects this database so the next commands run inside it."
                    ]
                },
                {
                    sig: "2. Create the 'flights' Table",
                    lines: [4, 16],
                    desc: "Creates the table that stores all flight schedules (where the plane flies from/to, date, time, total seats, and distance).",
                    points: [
                        "Line 5: 'AUTO_INCREMENT PRIMARY KEY' means MySQL automatically numbers each flight 1, 2, 3...",
                        "Lines 14-15: 'CHECK (total_seats > 0)' and 'CHECK (distance > 0)' make sure nobody enters 0 or negative numbers."
                    ]
                },
                {
                    sig: "3. Create the 'bookings' Table",
                    lines: [18, 35],
                    desc: "Creates the table that stores passenger tickets and links each ticket to a specific flight.",
                    points: [
                        "Line 30: 'DEFAULT CURRENT_TIMESTAMP' automatically records the date and time the ticket was booked.",
                        "Line 33: 'FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE' links each booking to a valid flight. 'ON DELETE CASCADE' means if a flight is deleted, all its bookings are automatically deleted too.",
                        "Line 34: 'UNIQUE (flight_id, seat_number)' is a safety rule: seat 12 on flight 1 can only be booked once!"
                    ]
                },
                {
                    sig: "4. Add Indexes & Insert 5 Sample Flights",
                    lines: [37, 48],
                    desc: "Creates fast lookup indexes (like a book's index) and adds 5 ready-to-use flights (AI-101 to AI-105).",
                    points: [
                        "Lines 37-38: Indexes make searching bookings by ID proof number or flight ID much faster.",
                        "Lines 40-45: Inserts 5 sample flights between Indian cities so the dropdown in the app has flights immediately."
                    ]
                }
            ],
            viva: [
                "Q: What does ON DELETE CASCADE on line 33 do? A: If an admin deletes a flight from the 'flights' table, MySQL automatically deletes all passenger bookings for that flight so no orphan bookings are left behind.",
                "Q: How does the database prevent double-booking the same seat? A: Line 34 adds CONSTRAINT uk_flight_seat UNIQUE (flight_id, seat_number), which blocks duplicate (flight_id, seat_number) pairs."
            ]
        },
        {
            id: "model/Bookable.java",
            name: "Bookable.java",
            pkg: "model",
            path: "code/model/Bookable.java",
            page: "pages/model-Bookable.html",
            role: "A tiny rulebook (Interface) that says: 'Any class that can be booked must have a bookSeat() method and a cancelBooking() method.'",
            concepts: ["Interface", "Abstraction", "Method Contract"],
            code: `package model;

public interface Bookable {
    model.Seat bookSeat(int seatNumber) throws exceptions.SeatAlreadyBookedException;
    boolean cancelBooking(int bookingId);
}`,
            fields: [],
            walkthrough: [
                {
                    sig: "public interface Bookable",
                    lines: [1, 6],
                    desc: "Defines an interface (a contract with method names but no code body) that Flight.java implements.",
                    points: [
                        "Line 1: 'package model;' puts this file in the 'model' folder.",
                        "Line 3: 'public interface Bookable' declares an interface instead of a class. An interface only lists WHAT methods must exist, not HOW they work.",
                        "Line 4: Requires a 'bookSeat(int seatNumber)' method that returns a Seat object (or throws SeatAlreadyBookedException if the seat is already taken).",
                        "Line 5: Requires a 'cancelBooking(int bookingId)' method that returns true or false."
                    ]
                }
            ],
            viva: [
                "Q: What is an interface in simple words? A: It is a contract or checklist of methods with no code inside. Since Flight 'implements Bookable', Java forces Flight to write the code for both bookSeat() and cancelBooking()."
            ]
        },
        {
            id: "model/Seat.java",
            name: "Seat.java",
            pkg: "model",
            path: "code/model/Seat.java",
            page: "pages/model-Seat.html",
            role: "The parent blueprint (abstract class) for all seats on a plane. It stores the seat number, base price, and whether the seat is booked, while letting child classes decide the final price and baggage limit.",
            concepts: ["Abstract Class", "Encapsulation (private fields)", "Thread Safety (synchronized)"],
            code: `package model;

public abstract class Seat {
    private int seatNumber;
    private boolean isBooked;
    private double basePrice;

    public Seat(int seatNumber, double basePrice) {
        this.seatNumber = seatNumber;
        this.isBooked = false;
        this.basePrice = basePrice;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        this.isBooked = booked;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public abstract double getPrice();

    public abstract int getBaggageAllowance();

    public synchronized boolean bookSeat() {
        if (this.isBooked) {
            return false;
        }
        this.isBooked = true;
        return true;
    }

    public void cancelBooking() {
        this.isBooked = false;
    }
}`,
            fields: [
                { name: "seatNumber", type: "private int", desc: "The number of the seat on the plane (for example, seat 1, 2, 3...)." },
                { name: "isBooked", type: "private boolean", desc: "true if someone has booked this seat; false if it is empty/available." },
                { name: "basePrice", type: "private double", desc: "The starting price of the seat before adding Business or First Class extra charges." }
            ],
            walkthrough: [
                {
                    sig: "1. Private Variables & Constructor",
                    lines: [3, 12],
                    desc: "Sets up the 3 variables every seat needs and initializes a new seat as unbooked (isBooked = false).",
                    points: [
                        "Lines 4-6: Variables are marked 'private' (Encapsulation) so outside code cannot change them directly.",
                        "Lines 8-12: The constructor sets the seatNumber and basePrice, and starts 'this.isBooked = false' because a brand-new seat is empty."
                    ]
                },
                {
                    sig: "2. Getters, Setters & Abstract Methods",
                    lines: [14, 32],
                    desc: "Simple methods to read private variables, plus two 'abstract' methods that child classes must fill in.",
                    points: [
                        "Lines 14-28: Getter and setter methods let other classes safely read seatNumber, isBooked, and basePrice.",
                        "Lines 30-32: 'getPrice()' and 'getBaggageAllowance()' are marked 'abstract' (they end with a semicolon and have no curly braces). Why? Because Economy, Business, and First Class each have different prices and luggage rules!"
                    ]
                },
                {
                    sig: "3. Thread-Safe bookSeat() & cancelBooking()",
                    lines: [34, 44],
                    desc: "Marks the seat as booked safely so two people can't book it at the same time.",
                    points: [
                        "Line 34: The word 'synchronized' puts a lock on this seat while booking is happening—only one thread can run this method at a time.",
                        "Lines 35-39: If 'this.isBooked' is already true, it returns false (booking failed). Otherwise, it sets 'this.isBooked = true' and returns true.",
                        "Lines 42-44: 'cancelBooking()' simply sets 'this.isBooked = false' to make the seat available again."
                    ]
                }
            ],
            viva: [
                "Q: Why is Seat an abstract class? A: Because you never buy a generic 'Seat'—every seat on the plane is specifically an EconomySeat, BusinessSeat, or FirstClassSeat.",
                "Q: What does the word 'synchronized' on line 34 do? A: It prevents a race condition (double-booking) by allowing only one thread at a time to check and change isBooked."
            ]
        },
        {
            id: "model/EconomySeat.java",
            name: "EconomySeat.java",
            pkg: "model",
            path: "code/model/EconomySeat.java",
            page: "pages/model-EconomySeat.html",
            role: "Represents an Economy Class seat (the first 60% of seats on a flight). It charges the normal base price (no extra markup) and gives 20 kg of baggage.",
            concepts: ["Inheritance (extends Seat)", "Polymorphism (@Override)", "super Keyword"],
            code: `package model;

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
}`,
            fields: [],
            walkthrough: [
                {
                    sig: "Constructor: EconomySeat(int seatNumber, double basePrice)",
                    lines: [3, 6],
                    desc: "Creates an Economy seat by passing the seat number and base price up to the parent Seat class.",
                    points: [
                        "Line 3: 'extends Seat' means EconomySeat is a child class of Seat.",
                        "Line 5: 'super(seatNumber, basePrice)' calls the constructor in Seat.java to store the seat number and base price."
                    ]
                },
                {
                    sig: "@Override getPrice() and getBaggageAllowance()",
                    lines: [8, 16],
                    desc: "Fills in the two abstract methods promised by Seat.java.",
                    points: [
                        "Line 10: Economy has no extra markup, so getPrice() simply returns getBasePrice() (1x price).",
                        "Line 15: Economy passengers are allowed 20 kg of luggage, so getBaggageAllowance() returns 20."
                    ]
                }
            ],
            viva: [
                "Q: What does 'super(seatNumber, basePrice)' do on line 5? A: It calls the parent class (Seat) constructor so Seat can save seatNumber and basePrice in its private variables."
            ]
        },
        {
            id: "model/BusinessSeat.java",
            name: "BusinessSeat.java",
            pkg: "model",
            path: "code/model/BusinessSeat.java",
            page: "pages/model-BusinessSeat.html",
            role: "Represents a Business Class seat (the middle 25% of seats). It costs 1.5 times the base price (50% extra) and gives 35 kg of baggage.",
            concepts: ["Inheritance (extends Seat)", "Polymorphism (@Override)"],
            code: `package model;

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
}`,
            fields: [],
            walkthrough: [
                {
                    sig: "Constructor & Overridden Methods",
                    lines: [3, 16],
                    desc: "Inherits from Seat and defines Business Class price (1.5x) and baggage limit (35 kg).",
                    points: [
                        "Line 5: Passes seatNumber and basePrice to the parent Seat constructor using super(...).",
                        "Line 10: Multiplies getBasePrice() by 1.5 (a 50% markup over Economy).",
                        "Line 15: Returns 35 kg of baggage allowance."
                    ]
                }
            ],
            viva: [
                "Q: How is Polymorphism shown between EconomySeat and BusinessSeat? A: Both have a getPrice() method, but calling getPrice() on an EconomySeat gives 1x basePrice while calling it on a BusinessSeat gives 1.5x basePrice."
            ]
        },
        {
            id: "model/FirstClassSeat.java",
            name: "FirstClassSeat.java",
            pkg: "model",
            path: "code/model/FirstClassSeat.java",
            page: "pages/model-FirstClassSeat.html",
            role: "Represents a First Class luxury seat (the last 15% of seat numbers, shown in Gold at the front of the plane). It costs 2 times the base price and gives 50 kg of baggage.",
            concepts: ["Inheritance (extends Seat)", "Polymorphism (@Override)"],
            code: `package model;

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
}`,
            fields: [],
            walkthrough: [
                {
                    sig: "Constructor & Overridden Methods",
                    lines: [3, 16],
                    desc: "Inherits from Seat and sets First Class price to 2.0x basePrice and baggage to 50 kg.",
                    points: [
                        "Line 5: Calls super(seatNumber, basePrice) to initialize parent Seat variables.",
                        "Line 10: Doubles the base price (getBasePrice() * 2.0).",
                        "Line 15: Returns 50 kg of baggage allowance—the highest of all three classes."
                    ]
                }
            ],
            viva: [
                "Q: What are the price multipliers and baggage limits for all 3 seat classes? A: Economy = 1.0x price & 20kg; Business = 1.5x price & 35kg; First Class = 2.0x price & 50kg."
            ]
        },
        {
            id: "model/Passenger.java",
            name: "Passenger.java",
            pkg: "model",
            path: "code/model/Passenger.java",
            page: "pages/model-Passenger.html",
            role: "Stores a passenger's personal details (name, age, gender, ID proof, phone number) and checks if they are valid before allowing a booking.",
            concepts: ["Encapsulation", "Input Validation (Regex)", "Throwing Custom Exceptions"],
            code: `package model;

import exceptions.InvalidPassengerException;

public class Passenger {
    private String name;
    private int age;
    private String gender;
    private String idProofType;
    private String idProofNumber;
    private String contactNumber;

    public Passenger(String name, int age, String gender, String idProofType,
                     String idProofNumber, String contactNumber) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.idProofType = idProofType;
        this.idProofNumber = idProofNumber;
        this.contactNumber = contactNumber;
    }

    public void validate() throws InvalidPassengerException {
        if (!validateName()) {
            throw new InvalidPassengerException("Name",
                "Name must not be empty and should contain only letters and spaces.");
        }
        if (!validateAge()) {
            throw new InvalidPassengerException("Age",
                "Age must be a positive integer between 0 and 120.");
        }
        if (!validateIdProof()) {
            throw new InvalidPassengerException("ID Proof Number",
                "ID proof number format is invalid for the selected ID type.");
        }
        if (!validateContactNumber()) {
            throw new InvalidPassengerException("Contact Number",
                "Contact number must be exactly 10 digits.");
        }
    }

    private boolean validateName() {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return name.matches("[a-zA-Z ]+");
    }

    private boolean validateAge() {
        return age >= 0 && age <= 120;
    }

    private boolean validateIdProof() {
        if (idProofNumber == null || idProofNumber.trim().isEmpty()) {
            return false;
        }

        switch (idProofType) {
            case "Aadhaar":
                return idProofNumber.matches("\\\\d{12}");
            case "Passport":
                return idProofNumber.matches("[A-Z]\\\\d{7}");
            case "Driving License":
                return idProofNumber.matches("[a-zA-Z0-9]{10,16}");
            default:
                return false;
        }
    }

    private boolean validateContactNumber() {
        if (contactNumber == null || contactNumber.trim().isEmpty()) {
            return false;
        }
        return contactNumber.matches("\\\\d{10}");
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getIdProofType() {
        return idProofType;
    }

    public String getIdProofNumber() {
        return idProofNumber;
    }

    public String getContactNumber() {
        return contactNumber;
    }
}`,
            fields: [
                { name: "name", type: "private String", desc: "Passenger's full name (only letters and spaces allowed)." },
                { name: "age", type: "private int", desc: "Passenger's age in years (must be between 0 and 120)." },
                { name: "gender", type: "private String", desc: "Male, Female, or Other." },
                { name: "idProofType", type: "private String", desc: "Which ID card they chose: 'Aadhaar', 'Passport', or 'Driving License'." },
                { name: "idProofNumber", type: "private String", desc: "The ID card number typed by the user." },
                { name: "contactNumber", type: "private String", desc: "10-digit phone number." }
            ],
            walkthrough: [
                {
                    sig: "1. Private Variables & Constructor",
                    lines: [5, 21],
                    desc: "Saves all 6 passenger details into private variables when a new Passenger object is created.",
                    points: [
                        "Uses 'this.name = name' so Java knows we are saving the constructor parameter into the class variable."
                    ]
                },
                {
                    sig: "2. Main Check Method: validate()",
                    lines: [23, 40],
                    desc: "Runs 4 helper checks one by one. If any check fails, it immediately stops and throws an InvalidPassengerException.",
                    points: [
                        "Checks Name first, then Age, then ID Proof Number, and finally Contact Number.",
                        "When it throws InvalidPassengerException, it passes the field name (like 'Age') and a clear message explaining how to fix it."
                    ]
                },
                {
                    sig: "3. Helper Validation Methods (Regex Patterns)",
                    lines: [42, 76],
                    desc: "Uses simple pattern matching (Regular Expressions) to verify each field's format.",
                    points: [
                        "Lines 42-47 (validateName): '[a-zA-Z ]+' means 1 or more uppercase/lowercase letters or spaces (no numbers or symbols).",
                        "Lines 49-51 (validateAge): Checks that age is between 0 and 120.",
                        "Lines 53-69 (validateIdProof): Uses a switch statement based on ID type: Aadhaar must be 12 digits ('\\\\d{12}'), Passport must be 1 capital letter + 7 digits ('[A-Z]\\\\d{7}'), and Driving License must be 10 to 16 letters/numbers ('[a-zA-Z0-9]{10,16}').",
                        "Lines 71-76 (validateContactNumber): '\\\\d{10}' checks that the phone number is exactly 10 digits."
                    ]
                },
                {
                    sig: "4. Getter Methods",
                    lines: [78, 97],
                    desc: "Lets other classes (like Booking and BookingDAO) read the passenger's details safely.",
                    points: [
                        "Notice there are no setter methods—once a Passenger is created and validated, their details stay locked."
                    ]
                }
            ],
            viva: [
                "Q: What ID formats does Passenger.java accept? A: Aadhaar = 12 digits; Passport = 1 uppercase letter followed by 7 digits (e.g., A1234567); Driving License = 10 to 16 letters/numbers.",
                "Q: Why are validateName() and validateIdProof() marked 'private' while validate() is 'public'? A: Outside classes only need to call one method—passenger.validate()—which internally calls the private helper methods."
            ]
        },
        {
            id: "model/Booking.java",
            name: "Booking.java",
            pkg: "model",
            path: "code/model/Booking.java",
            page: "pages/model-Booking.html",
            role: "Represents a completed ticket booking. It holds a Passenger object and a Seat object together, and can export a formatted boarding pass to a .txt file.",
            concepts: ["Composition (Has-A)", "File I/O (FileWriter)", "try-finally Block"],
            code: `package model;

import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Booking {
    private int bookingId;
    private int flightId;
    private Passenger passenger;
    private Seat seat;
    private String seatClass;
    private double fare;
    private String bookingDate;

    public Booking(int bookingId, int flightId, Passenger passenger, Seat seat,
                   String seatClass, double fare, String bookingDate) {
        this.bookingId = bookingId;
        this.flightId = flightId;
        this.passenger = passenger;
        this.seat = seat;
        this.seatClass = seatClass;
        this.fare = fare;
        this.bookingDate = bookingDate;
    }

    public void exportTicket(String filename) throws IOException {
        FileWriter writer = new FileWriter(filename);
        try {
            writer.write(generateTicketText());
        } finally {
            writer.close();
        }
    }

    public String generateTicketText() {
        StringBuilder ticket = new StringBuilder();

        ticket.append("=================================================\\n");
        ticket.append("           AIRLINE TICKET / BOARDING PASS         \\n");
        ticket.append("=================================================\\n\\n");

        ticket.append("BOOKING ID: ").append(bookingId).append("\\n");
        ticket.append("BOOKING DATE: ").append(bookingDate).append("\\n\\n");

        ticket.append("PASSENGER DETAILS:\\n");
        ticket.append("  Name: ").append(passenger.getName()).append("\\n");
        ticket.append("  Age: ").append(passenger.getAge()).append("\\n");
        ticket.append("  Gender: ").append(passenger.getGender()).append("\\n");
        ticket.append("  ID Proof: ").append(passenger.getIdProofType()).append("\\n");
        ticket.append("  ID Number: ").append(passenger.getIdProofNumber()).append("\\n");
        ticket.append("  Contact: ").append(passenger.getContactNumber()).append("\\n\\n");

        ticket.append("FLIGHT DETAILS:\\n");
        ticket.append("  Flight ID: ").append(flightId).append("\\n");
        ticket.append("  Seat Number: ").append(seat.getSeatNumber()).append("\\n");
        ticket.append("  Seat Class: ").append(seatClass).append("\\n");
        ticket.append("  Baggage Allowance: ").append(seat.getBaggageAllowance()).append(" kg\\n\\n");

        ticket.append("FARE DETAILS:\\n");
        ticket.append("  Total Fare: Rs. ").append(String.format("%.2f", fare)).append("\\n\\n");

        ticket.append("=================================================\\n");
        ticket.append("  Thank you for choosing our airline!            \\n");
        ticket.append("  Please arrive at the airport 2 hours before    \\n");
        ticket.append("  departure time.                                 \\n");
        ticket.append("=================================================\\n");

        return ticket.toString();
    }

    public String getSummary() {
        return bookingId + " | " + passenger.getName() + " | Seat " + seat.getSeatNumber() +
               " (" + seatClass + ") | Rs. " + String.format("%.2f", fare);
    }

    public int getBookingId() {
        return bookingId;
    }

    public int getFlightId() {
        return flightId;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public Seat getSeat() {
        return seat;
    }

    public String getSeatClass() {
        return seatClass;
    }

    public double getFare() {
        return fare;
    }

    public String getBookingDate() {
        return bookingDate;
    }
}`,
            fields: [
                { name: "bookingId & flightId", type: "private int", desc: "The unique ticket ID and the ID of the flight being booked." },
                { name: "passenger", type: "private Passenger", desc: "A complete Passenger object stored inside Booking (Composition)." },
                { name: "seat", type: "private Seat", desc: "The booked Seat object stored inside Booking (Composition)." },
                { name: "seatClass & fare & bookingDate", type: "String / double", desc: "Cabin name ('Economy'/'Business'/'First Class'), total fare paid, and date/time of booking." }
            ],
            walkthrough: [
                {
                    sig: "1. Variables & Constructor (Composition)",
                    lines: [8, 26],
                    desc: "Stores the booking ID, flight ID, Passenger object, Seat object, class, fare, and timestamp.",
                    points: [
                        "Having 'Passenger passenger' and 'Seat seat' as variables inside Booking is called Composition (a Booking 'has a' Passenger and 'has a' Seat)."
                    ]
                },
                {
                    sig: "2. Saving a Ticket to a File: exportTicket(String filename)",
                    lines: [28, 35],
                    desc: "Creates a text file on your computer and writes the boarding pass text into it.",
                    points: [
                        "Line 29: 'new FileWriter(filename)' opens or creates the .txt file.",
                        "Line 31: Writes the text returned by generateTicketText() into the file.",
                        "Lines 32-34: The 'finally' block guarantees 'writer.close()' always runs to save and unlock the file, even if an error occurs."
                    ]
                },
                {
                    sig: "3. Formatting the Boarding Pass: generateTicketText()",
                    lines: [37, 69],
                    desc: "Builds a neat, printable boarding pass receipt using StringBuilder.",
                    points: [
                        "Uses StringBuilder.append(...) to piece together the passenger details, seat number, baggage allowance (seat.getBaggageAllowance()), and fare formatted to 2 decimal places."
                    ]
                },
                {
                    sig: "4. Summary & Getters",
                    lines: [71, 97],
                    desc: "Provides a one-line summary and getter methods for all private fields.",
                    points: [
                        "Used by ViewBookingsPanel and BookingDAO to read booking details."
                    ]
                }
            ],
            viva: [
                "Q: Where is Composition used in Booking.java? A: Lines 11-12: Booking contains a Passenger object and a Seat object as member variables.",
                "Q: Why do we put writer.close() inside a 'finally' block on line 33? A: Because code inside 'finally' is guaranteed to run whether an exception happens or not, ensuring the file is properly closed."
            ]
        },
        {
            id: "model/Flight.java",
            name: "Flight.java",
            pkg: "model",
            path: "code/model/Flight.java",
            page: "pages/model-Flight.html",
            role: "The brain of the model package. A Flight object creates all the seats for a plane (60% Economy, 25% Business, 15% First Class), locks seats when booking, and calculates dynamic ticket prices using recursion.",
            concepts: ["Implements Bookable", "Overloading", "Synchronized Booking", "Recursion (Dynamic Pricing)", "Vector"],
            code: `package model;

import exceptions.SeatAlreadyBookedException;
import java.util.Vector;

public class Flight implements Bookable {
    private int flightId;
    private String flightNumber;
    private String source;
    private String destination;
    private String date;
    private String time;
    private String aircraft;
    private int totalSeats;
    private int distance;
    private Vector<Seat> seats;

    public Flight(int flightId, String flightNumber, String source, String destination,
                  String date, String time, String aircraft, int totalSeats, int distance) {
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.source = source;
        this.destination = destination;
        this.date = date;
        this.time = time;
        this.aircraft = aircraft;
        this.totalSeats = totalSeats;
        this.distance = distance;
        this.seats = new Vector<>();
        initializeSeats();
    }

    public Flight(int flightId, String flightNumber, String source, String destination,
                  String date, String time, String aircraft, int totalSeats) {
        this(flightId, flightNumber, source, destination, date, time, aircraft, totalSeats, 1000);
    }

    public void initializeSeats() {
        int economySeats = (int) (totalSeats * 0.6);
        int businessSeats = (int) (totalSeats * 0.25);
        int firstClassSeats = totalSeats - economySeats - businessSeats;

        double calculatedBasePrice = distance * 5.0;
        double basePrice = Math.max(calculatedBasePrice, 2000.0);

        double economyBasePrice = basePrice;
        double businessBasePrice = basePrice;
        double firstClassBasePrice = basePrice;

        for (int i = 1; i <= economySeats; i++) {
            seats.add(new EconomySeat(i, economyBasePrice));
        }

        for (int i = economySeats + 1; i <= economySeats + businessSeats; i++) {
            seats.add(new BusinessSeat(i, businessBasePrice));
        }

        for (int i = economySeats + businessSeats + 1; i <= totalSeats; i++) {
            seats.add(new FirstClassSeat(i, firstClassBasePrice));
        }
    }

    public Seat getSeat(int seatNumber) {
        for (Seat seat : seats) {
            if (seat.getSeatNumber() == seatNumber) {
                return seat;
            }
        }
        return null;
    }

    public Vector<Seat> getAvailableSeats() {
        Vector<Seat> availableSeats = new Vector<>();
        for (Seat seat : seats) {
            if (!seat.isBooked()) {
                availableSeats.add(seat);
            }
        }
        return availableSeats;
    }

    @Override
    public synchronized Seat bookSeat(int seatNumber) throws SeatAlreadyBookedException {
        Seat seat = getSeat(seatNumber);

        if (seat == null) {
            return null;
        }

        if (seat.bookSeat()) {
            return seat;
        } else {
            throw new SeatAlreadyBookedException(seatNumber);
        }
    }

    public boolean isSeatAvailable(int seatNumber) {
        Seat seat = getSeat(seatNumber);
        return seat != null && !seat.isBooked();
    }

    public double calculateTotalFare(double baseFare, int bookedCount, int totalSeats) {
        if (bookedCount == 0) {
            return baseFare;
        }

        double bookingPercentage = (double) bookedCount / totalSeats;

        if (bookingPercentage > 0.8) {
            return calculateTotalFare(baseFare * 1.2, bookedCount - 1, totalSeats);
        } else if (bookingPercentage > 0.5) {
            return calculateTotalFare(baseFare * 1.1, bookedCount - 1, totalSeats);
        } else {
            return baseFare;
        }
    }

    public double calculateTotalFare(Seat seat) {
        int bookedCount = totalSeats - getAvailableSeats().size();
        return calculateTotalFare(seat.getPrice(), bookedCount, totalSeats);
    }

    @Override
    public boolean cancelBooking(int bookingId) {
        return true;
    }

    public int getFlightId() {
        return flightId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getAircraft() {
        return aircraft;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public Vector<Seat> getSeats() {
        return seats;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public int getBookedSeatCount() {
        int count = 0;
        for (Seat seat : seats) {
            if (seat.isBooked()) {
                count++;
            }
        }
        return count;
    }

    public String getSeatClass(int seatNumber) {
        int economySeats = (int) (totalSeats * 0.6);
        int businessSeats = (int) (totalSeats * 0.25);

        if (seatNumber <= economySeats) {
            return "Economy";
        } else if (seatNumber <= economySeats + businessSeats) {
            return "Business";
        } else {
            return "First Class";
        }
    }

    @Override
    public String toString() {
        String[] dateParts = date.split("-");
        String formattedDate = dateParts[2] + " " + getMonthName(dateParts[1]) + " " + dateParts[0];

        return flightNumber + " | " + source + " \\u2192 " + destination + " | " + formattedDate + " | " + time;
    }

    private String getMonthName(String monthNumber) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        int monthIndex = Integer.parseInt(monthNumber) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return months[monthIndex];
        }
        return monthNumber;
    }
}`,
            fields: [
                { name: "flightId .. totalSeats", type: "private int / String", desc: "Basic flight info: ID, code (AI-101), source, destination, date, time, plane model, and total seat count." },
                { name: "distance", type: "private int", desc: "Route distance in kilometers (used to calculate the base ticket price)." },
                { name: "seats", type: "private Vector<Seat>", desc: "A thread-safe list holding all the EconomySeat, BusinessSeat, and FirstClassSeat objects for this flight." }
            ],
            walkthrough: [
                {
                    sig: "1. Two Overloaded Constructors",
                    lines: [18, 35],
                    desc: "Creates a Flight object and immediately calls initializeSeats() to generate all its seats.",
                    points: [
                        "Lines 18-30: Main constructor taking all 9 values (including distance).",
                        "Lines 32-35: A second constructor without distance—it simply calls the first constructor with a default distance of 1000 km. Having two constructors with different parameters is called Constructor Overloading."
                    ]
                },
                {
                    sig: "2. Creating All Seats: initializeSeats()",
                    lines: [37, 61],
                    desc: "Splits the plane into 3 cabin classes and calculates the starting base price from the flight's distance.",
                    points: [
                        "Lines 38-40: Calculates seat counts: first 60% are Economy, next 25% are Business, and the remaining 15% are First Class.",
                        "Lines 42-43: Base price is 'distance * 5.0' (Rs. 5 per km), with a minimum price of Rs. 2000 ('Math.max(calculatedBasePrice, 2000.0)').",
                        "Lines 49-60: Uses three 'for' loops to create EconomySeat, BusinessSeat, and FirstClassSeat objects and add them to the 'seats' Vector."
                    ]
                },
                {
                    sig: "3. Finding & Booking a Seat: getSeat(), getAvailableSeats(), bookSeat()",
                    lines: [63, 100],
                    desc: "Searches for seats in the list and locks a seat when a passenger books it.",
                    points: [
                        "Lines 82-95 (bookSeat): Marked 'synchronized' so two threads cannot book on the same flight at the exact same instant. If seat.bookSeat() returns false, it throws SeatAlreadyBookedException."
                    ]
                },
                {
                    sig: "4. Recursive Dynamic Pricing: calculateTotalFare()",
                    lines: [102, 121],
                    desc: "Increases the ticket fare automatically when the plane is more than 50% or 80% full.",
                    points: [
                        "Lines 102-116: A recursive method (calls itself). If 50% or fewer seats are booked (or bookedCount == 0), it stops and returns baseFare.",
                        "If more than 80% of seats are booked, it increases baseFare by 20% (baseFare * 1.2) and calls itself with (bookedCount - 1). If more than 50% are booked, it increases baseFare by 10% (baseFare * 1.1) and calls itself with (bookedCount - 1).",
                        "Lines 118-121: A helper overloaded method where you just pass a 'Seat' object, and it figures out bookedCount for you."
                    ]
                },
                {
                    sig: "5. Class Lookup & Dropdown Formatting: getSeatClass() & toString()",
                    lines: [179, 203],
                    desc: "Tells which cabin class a seat number belongs to, and formats the flight nicely for dropdown menus.",
                    points: [
                        "Lines 179-190 (getSeatClass): For a 100-seat flight, seats 1–60 return 'Economy', 61–85 return 'Business', and 86–100 return 'First Class'.",
                        "Lines 192-203 (toString): Turns '2024-08-15' into '15 Aug 2024' so the flight dropdown shows 'AI-101 | Delhi → Mumbai | 15 Aug 2024 | 09:00'."
                    ]
                }
            ],
            viva: [
                "Q: How is the base price of a flight calculated? A: In initializeSeats() (line 42), it multiplies distance * 5.0 (Rs. 5 per km), with a minimum floor of Rs. 2000.",
                "Q: Why did we use Vector<Seat> instead of ArrayList<Seat>? A: Vector is thread-safe (its methods are synchronized), which matches our multithreading requirement."
            ]
        }
    ]
};

window.STUDY_DATA.files.push(
    {
        id: "exceptions/FlightNotFoundException.java",
        name: "FlightNotFoundException.java",
        pkg: "exceptions",
        path: "code/exceptions/FlightNotFoundException.java",
        page: "pages/exceptions-FlightNotFoundException.html",
        role: "A custom error (exception) thrown when the database searches for a flight ID that does not exist.",
        concepts: ["Custom Exception", "Inheritance (extends Exception)"],
        code: `package exceptions;

public class FlightNotFoundException extends Exception {
    private int flightId;

    public FlightNotFoundException(int flightId) {
        super("Flight with ID " + flightId + " not found.");
        this.flightId = flightId;
    }

    public int getFlightId() {
        return flightId;
    }
}`,
        fields: [
            { name: "flightId", type: "private int", desc: "Remembers which flight ID number was missing when the error happened." }
        ],
        walkthrough: [
            {
                sig: "FlightNotFoundException Class & Constructor",
                lines: [3, 14],
                desc: "Creates a friendly 'Flight not found' error message and saves the missing flight ID.",
                points: [
                    "Line 3: 'extends Exception' makes this a custom Java exception that we can throw and catch.",
                    "Line 7: 'super(...)' sends the error message ('Flight with ID X not found.') up to Java's built-in Exception class.",
                    "Line 11: 'getFlightId()' lets us check which flight ID caused the error."
                ]
            }
        ],
        viva: [
            "Q: Why create our own FlightNotFoundException instead of using a generic Exception? A: It makes the code much easier to read and debug because we immediately know the exact reason the error happened (a missing flight ID)."
        ]
    },
    {
        id: "exceptions/InvalidPassengerException.java",
        name: "InvalidPassengerException.java",
        pkg: "exceptions",
        path: "code/exceptions/InvalidPassengerException.java",
        page: "pages/exceptions-InvalidPassengerException.html",
        role: "A custom error thrown when a passenger enters invalid details in the booking form (like letters in the age box or a wrong Aadhaar/Passport format).",
        concepts: ["Custom Exception", "Form Validation Error"],
        code: `package exceptions;

public class InvalidPassengerException extends Exception {
    private String fieldName;
    private String errorMessage;

    public InvalidPassengerException(String fieldName, String errorMessage) {
        super(fieldName + ": " + errorMessage);
        this.fieldName = fieldName;
        this.errorMessage = errorMessage;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}`,
        fields: [
            { name: "fieldName", type: "private String", desc: "Which input box had the mistake (e.g., 'Name', 'Age', 'ID Proof Number', or 'Contact Number')." },
            { name: "errorMessage", type: "private String", desc: "A clear explanation of what the user needs to fix." }
        ],
        walkthrough: [
            {
                sig: "Constructor & Getter Methods",
                lines: [3, 19],
                desc: "Stores both the name of the input field that failed and the helpful error message.",
                points: [
                    "Lines 7-11: When Passenger.validate() spots a mistake, it creates this exception with the fieldName and errorMessage.",
                    "Lines 13-19: BookingPanel uses getFieldName() for the popup window title (e.g., 'Validation Error: Age') and getErrorMessage() for the popup text."
                ]
            }
        ],
        viva: [
            "Q: Where is InvalidPassengerException thrown and where is it caught? A: It is thrown inside Passenger.validate() and caught inside BookingPanel.bookSeat() to show a popup error dialog."
        ]
    },
    {
        id: "exceptions/SeatAlreadyBookedException.java",
        name: "SeatAlreadyBookedException.java",
        pkg: "exceptions",
        path: "code/exceptions/SeatAlreadyBookedException.java",
        page: "pages/exceptions-SeatAlreadyBookedException.html",
        role: "A custom error thrown if someone tries to book a seat that has already been taken.",
        concepts: ["Custom Exception", "Double-Booking Protection"],
        code: `package exceptions;

public class SeatAlreadyBookedException extends Exception {
    private int seatNumber;

    public SeatAlreadyBookedException(int seatNumber) {
        super("Seat " + seatNumber + " is already booked.");
        this.seatNumber = seatNumber;
    }

    public int getSeatNumber() {
        return seatNumber;
    }
}`,
        fields: [
            { name: "seatNumber", type: "private int", desc: "The seat number that was already booked." }
        ],
        walkthrough: [
            {
                sig: "SeatAlreadyBookedException Class",
                lines: [3, 14],
                desc: "Thrown by Flight.bookSeat() if seat.bookSeat() returns false.",
                points: [
                    "Line 7: Builds the message 'Seat X is already booked.' and passes it to Exception via super(...).",
                    "Caught in BookingPanel.bookSeat() to alert the user that the seat was just taken."
                ]
            }
        ],
        viva: [
            "Q: Which interface method requires declaring 'throws SeatAlreadyBookedException'? A: Bookable.bookSeat(int seatNumber) in Bookable.java."
        ]
    },
    {
        id: "db/DatabaseConnection.java",
        name: "DatabaseConnection.java",
        pkg: "db",
        path: "code/db/DatabaseConnection.java",
        page: "pages/db-DatabaseConnection.html",
        role: "Opens and manages the single connection between our Java app and the MySQL database using the Singleton pattern.",
        concepts: ["Singleton Pattern", "JDBC Connection", "Lazy Initialization"],
        code: `package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static Connection connection;

    private static final String URL = "jdbc:mysql://localhost:3306/airline_management";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("Database connection established successfully.");
            } catch (ClassNotFoundException e) {
                throw new SQLException("MySQL JDBC Driver not found. Make sure mysql-connector-java is in your classpath.", e);
            }
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                if (!connection.isClosed()) {
                    connection.close();
                    System.out.println("Database connection closed.");
                }
            } catch (SQLException e) {
                System.err.println("Error closing database connection: " + e.getMessage());
            }
        }
    }
}`,
        fields: [
            { name: "connection", type: "private static Connection", desc: "Holds the one shared database connection for the whole program." },
            { name: "URL", type: "private static final String", desc: "The address of our MySQL database on localhost port 3306." },
            { name: "USER & PASSWORD", type: "private static final String", desc: "MySQL login username ('root') and password (empty string '' by default for XAMPP)." }
        ],
        walkthrough: [
            {
                sig: "1. Database Settings & Private Constructor (Singleton)",
                lines: [7, 15],
                desc: "Stores the database URL/login and hides the constructor so nobody can create extra copies of this class.",
                points: [
                    "Line 8: 'static Connection connection' means there is only ONE copy of this variable shared across the entire program.",
                    "Lines 14-15: Making the constructor 'private' is the key trick of the Singleton pattern—outside classes must call DatabaseConnection.getConnection() instead of 'new DatabaseConnection()'."
                ]
            },
            {
                sig: "2. Opening/Getting the Connection: getConnection()",
                lines: [17, 27],
                desc: "Checks if a connection is already open; if not, it loads the MySQL driver and connects.",
                points: [
                    "Line 18: Only connects if 'connection == null' (first time) or 'connection.isClosed()'.",
                    "Line 20: 'Class.forName(\"com.mysql.cj.jdbc.Driver\")' loads the MySQL Connector JAR file.",
                    "Line 21: 'DriverManager.getConnection(URL, USER, PASSWORD)' logs into MySQL and saves the connection.",
                    "Line 26: Returns the ready-to-use Connection object to FlightDAO or BookingDAO."
                ]
            },
            {
                sig: "3. Closing the Connection: closeConnection()",
                lines: [29, 40],
                desc: "Cleanly disconnects from MySQL when needed.",
                points: [
                    "Checks that connection is not null and not already closed before calling connection.close()."
                ]
            }
        ],
        viva: [
            "Q: What is the Singleton Pattern and why do we use it here? A: Singleton means a class only creates ONE instance. Opening a new database connection every time we run a query is slow and wastes memory, so we reuse one shared connection.",
            "Q: What happens if you forget to include mysql-connector-j.jar when running the program? A: Line 20 throws ClassNotFoundException, which line 24 turns into a helpful message: 'MySQL JDBC Driver not found'."
        ]
    },
    {
        id: "db/FlightDAO.java",
        name: "FlightDAO.java",
        pkg: "db",
        path: "code/db/FlightDAO.java",
        page: "pages/db-FlightDAO.html",
        role: "The translator between Flight objects in Java and the 'flights' table in MySQL. It handles adding, listing, updating, and deleting flights, plus checking which seat numbers are booked.",
        concepts: ["DAO Pattern", "PreparedStatement (SQL Injection Safety)", "ResultSet Mapping"],
        code: `package db;

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
}`,
        fields: [
            { name: "connection", type: "private Connection", desc: "The active MySQL connection obtained from DatabaseConnection.getConnection()." }
        ],
        walkthrough: [
            {
                sig: "1. Adding a Flight: addFlight(Flight flight)",
                lines: [19, 45],
                desc: "Saves a new flight into the MySQL 'flights' table using '?' placeholders.",
                points: [
                    "Lines 20-21: The 8 '?' question marks are placeholders for the 8 flight values.",
                    "Lines 24-31: 'statement.setString(1, ...)' and 'statement.setInt(7, ...)' safely fill in each '?' placeholder. This prevents SQL Injection (where a user types SQL symbols into a text box).",
                    "Line 33: 'executeUpdate()' runs the INSERT command and returns how many rows were added (1 if successful)."
                ]
            },
            {
                sig: "2. Reading Flights: getFlight() & getAllFlights()",
                lines: [47, 80],
                desc: "Fetches one flight by its ID or fetches a list of all flights sorted by date and time.",
                points: [
                    "Lines 72-74: Loops through every row returned by MySQL ('while (resultSet.next())') and turns each row into a Java Flight object using extractFlightFromResultSet()."
                ]
            },
            {
                sig: "3. Deleting a Flight & Its Bookings: deleteFlight(int flightId)",
                lines: [104, 137],
                desc: "Deletes all bookings for a flight first, and then deletes the flight itself.",
                points: [
                    "Line 120: Calls deleteBookingsForFlight(flightId) first so no bookings are left pointing to a deleted flight."
                ]
            },
            {
                sig: "4. Converting SQL Rows & Getting Booked Seats",
                lines: [139, 185],
                desc: "Reads column values from a ResultSet row to build a Flight object, and looks up which seat numbers are already booked.",
                points: [
                    "Lines 165-185 (getBookedSeatNumbers): Runs 'SELECT seat_number FROM bookings WHERE flight_id = ?' so BookingPanel knows which seats to color RED on the seat map!"
                ]
            }
        ],
        viva: [
            "Q: What does DAO stand for and why do we use it? A: DAO stands for Data Access Object. It keeps all SQL database code in one place (the db/ folder) so our UI screens don't get cluttered with SQL queries.",
            "Q: Why do we use '?' placeholders with PreparedStatement instead of joining strings with '+'? A: It prevents SQL Injection attacks and handles quotes and special characters safely."
        ]
    },
    {
        id: "db/BookingDAO.java",
        name: "BookingDAO.java",
        pkg: "db",
        path: "code/db/BookingDAO.java",
        page: "pages/db-BookingDAO.html",
        role: "The translator between Booking objects in Java and the 'bookings' table in MySQL. It saves new tickets, checks for duplicate bookings by the same person, lists all bookings, and cancels bookings.",
        concepts: ["DAO Pattern", "PreparedStatement", "Duplicate Passenger Check", "Anonymous Inner Class"],
        code: `package db;

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
}`,
        fields: [
            { name: "connection", type: "private Connection", desc: "Shared MySQL database connection." },
            { name: "flightDAO", type: "private FlightDAO", desc: "Helper reference to FlightDAO." }
        ],
        walkthrough: [
            {
                sig: "1. Saving a Ticket: addBooking(Booking booking)",
                lines: [23, 51],
                desc: "Takes a Java Booking object, unpacks its Passenger and Seat details, and inserts a new row into the 'bookings' table.",
                points: [
                    "Lines 29-39: Fills in all 11 '?' placeholders (flight_id, passenger name, age, gender, ID type, ID number, phone, seat number, seat class, fare, and booking date)."
                ]
            },
            {
                sig: "2. Finding Bookings: getBooking() & getAllBookings()",
                lines: [53, 123],
                desc: "Fetches a single booking (used when exporting a ticket) or all bookings sorted newest-first ('ORDER BY booking_date DESC').",
                points: [
                    "Also includes helper queries to find bookings for a specific flight or a specific passenger ID."
                ]
            },
            {
                sig: "3. Stopping Duplicate Bookings: hasPassengerBookedOnFlight()",
                lines: [125, 140],
                desc: "Checks if the same person (same ID Proof Number) already has a ticket on the selected flight.",
                points: [
                    "Runs 'SELECT COUNT(*) FROM bookings WHERE flight_id = ? AND id_proof_number = ?'.",
                    "If the count is greater than 0, it returns true so BookingPanel can block the duplicate booking."
                ]
            },
            {
                sig: "4. Cancelling & Rebuilding Booking Objects",
                lines: [142, 174],
                desc: "cancelBooking() deletes a ticket row from MySQL; extractBookingFromResultSet() turns a MySQL row back into a Java Booking object.",
                points: [
                    "Lines 160-170: Since Seat is an abstract class, we create a quick 'anonymous inner class' ('new Seat(seatNumber, fare) { ... }') to hold the seat number and fare for the table and ticket export."
                ]
            }
        ],
        viva: [
            "Q: How does the app stop one person from booking two seats on the same flight? A: Before booking, BookingPanel calls bookingDAO.hasPassengerBookedOnFlight(flightId, idNumber) (line 125), which checks if that ID number already exists on that flight."
        ]
    },
    {
        id: "ui/MainWindow.java",
        name: "MainWindow.java",
        pkg: "ui",
        path: "code/ui/MainWindow.java",
        page: "pages/ui-MainWindow.html",
        role: "The starting file of the application (contains the 'main' method). It creates the main desktop window, the top menu bar (File / Help), and the 3 tabs ('Book Flight', 'Manage Flights', 'View Bookings').",
        concepts: ["main() Entry Point", "Swing JFrame & JTabbedPane", "Auto-Refresh on Tab Switch"],
        code: `package ui;

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
                    "Airline Ticket Management System\\n\\n" +
                    "Features:\\n" +
                    "- Book seats with visual seat map\\n" +
                    "- Manage flights\\n" +
                    "- View and cancel bookings\\n" +
                    "- Export tickets\\n\\n" +
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
}`,
        fields: [
            { name: "frame", type: "private JFrame", desc: "The main 1000x700 desktop window." },
            { name: "bookingPanel / flightManagementPanel / viewBookingsPanel", type: "Panel Objects", desc: "The 3 screens shown inside the 3 tabs." }
        ],
        walkthrough: [
            {
                sig: "1. Building the Window & Tabs: initializeUI()",
                lines: [16, 46],
                desc: "Creates the window, adds the 3 screens as tabs, and refreshes data whenever you click a different tab.",
                points: [
                    "Lines 17-20: Creates a 1000x700 window, makes the 'X' button close the program (EXIT_ON_CLOSE), and centers it on your screen (setLocationRelativeTo(null)).",
                    "Lines 26-29: Uses a JTabbedPane to create the 3 tabs: 'Book Flight' (index 0), 'Manage Flights' (index 1), and 'View Bookings' (index 2).",
                    "Lines 31-43: Adds a ChangeListener so whenever you switch tabs, it automatically calls refreshData() on that tab to show the latest flights and bookings."
                ]
            },
            {
                sig: "2. Top Menu Bar: createMenuBar()",
                lines: [48, 80],
                desc: "Creates the 'File -> Exit' and 'Help -> About' menus at the very top of the window.",
                points: [
                    "Clicking 'Exit' runs System.exit(0); clicking 'About' pops up a JOptionPane message box."
                ]
            },
            {
                sig: "3. Program Starting Point: main(String[] args)",
                lines: [82, 93],
                desc: "Starts the application safely on Java's GUI thread and makes buttons look like modern Windows controls.",
                points: [
                    "Line 86: 'UIManager.setLookAndFeel(...)' makes the app match your operating system's native look.",
                    "Line 83: 'SwingUtilities.invokeLater(...)' starts the window on the Event Dispatch Thread (the standard safe way to launch any Java Swing app)."
                ]
            }
        ],
        viva: [
            "Q: How does the 'Book Flight' tab automatically know when you add a new flight in the 'Manage Flights' tab? A: In MainWindow.java (lines 31-43), a ChangeListener detects when you switch tabs and calls refreshData() to reload the latest data from MySQL."
        ]
    },
    {
        id: "ui/BookingPanel.java",
        name: "BookingPanel.java",
        pkg: "ui",
        path: "code/ui/BookingPanel.java",
        page: "pages/ui-BookingPanel.html",
        role: "The main 'Book Flight' screen. It puts the passenger form on the left and the clickable airplane seat map on the right, and handles the entire step-by-step booking process.",
        concepts: ["JSplitPane (Left/Right Split)", "GridBagLayout Form", "Step-by-Step Booking Pipeline"],
        code: `package ui;

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
                        "Booking successful!\\n\\n" +
                        "Booking Details:\\n" +
                        "Flight: " + selectedFlight.getFlightNumber() + "\\n" +
                        "Passenger: " + passenger.getName() + "\\n" +
                        "Seat: " + bookedSeat.getSeatNumber() + " (" + seatClass + ")\\n" +
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
}`,
        fields: [
            { name: "flightComboBox .. seatClassComboBox", type: "Swing Input Boxes", desc: "Dropdowns and text boxes where the user types passenger details." },
            { name: "seatMapPanel", type: "private SeatMapPanel", desc: "The visual airplane seat map on the right side of the screen." },
            { name: "selectedFlight & selectedSeatNumber", type: "Flight / int", desc: "Keeps track of which flight and which seat button the user clicked (-1 means no seat clicked yet)." }
        ],
        walkthrough: [
            {
                sig: "1. Splitting the Screen & Auto-Selecting Seat Class: initializeUI()",
                lines: [44, 67],
                desc: "Puts the form on the left and the seat map on the right using a JSplitPane.",
                points: [
                    "Lines 49-59: Listens for when you click a seat on the map. As soon as you click a seat, it automatically changes the 'Seat Class' dropdown to match that seat (Economy, Business, or First Class) and locks the dropdown so you can't pick the wrong class!"
                ]
            },
            {
                sig: "2. Creating the Input Form: createFormPanel()",
                lines: [69, 155],
                desc: "Uses a GridBagLayout (a neat 2-column grid of labels on the left, inputs on the right) for all 8 fields.",
                points: [
                    "Lines 81-91: When you pick a different flight from the dropdown, it refreshes the seat map for that flight."
                ]
            },
            {
                sig: "3. Loading Flights & Syncing Booked Seats: loadFlights() & updateSeatMap()",
                lines: [157, 184],
                desc: "Loads flights into the dropdown and marks already-booked seats from MySQL.",
                points: [
                    "Lines 170-184 (updateSeatMap): Asks flightDAO for all booked seat numbers on this flight, marks each of those Seat objects as booked, and tells seatMapPanel to redraw."
                ]
            },
            {
                sig: "4. The Complete Booking Process: bookSeat()",
                lines: [186, 306],
                desc: "Runs when you click 'Book Seat'. It checks everything step-by-step before saving the ticket.",
                points: [
                    "Step 1 (Lines 188-225): Checks that a flight and seat are selected, no text boxes are empty, and Age is a valid number.",
                    "Step 2 (Lines 227-237): Creates a Passenger object and runs 'passenger.validate()' to check Name, Age, ID Proof, and 10-digit Phone.",
                    "Step 3 (Lines 239-245): Calls 'bookingDAO.hasPassengerBookedOnFlight(...)' to make sure this person hasn't already booked a seat on this flight.",
                    "Step 4 (Lines 268-291): Calculates the dynamic fare, locks the seat with 'selectedFlight.bookSeat()', saves to MySQL with 'bookingDAO.addBooking()', shows a confirmation popup, and refreshes the seat map.",
                    "Step 5 (Line 293 Rollback): If saving to MySQL fails for any reason, it calls 'bookedSeat.cancelBooking()' to un-book the seat in memory!"
                ]
            }
        ],
        viva: [
            "Q: Why does BookingPanel disable the Seat Class dropdown when you click a seat? A: Because each seat number physically belongs to a fixed cabin section on the plane—auto-selecting and locking the dropdown prevents the user from selecting a First Class seat while paying Economy price."
        ]
    },
    {
        id: "ui/FlightManagementPanel.java",
        name: "FlightManagementPanel.java",
        pkg: "ui",
        path: "code/ui/FlightManagementPanel.java",
        page: "pages/ui-FlightManagementPanel.html",
        role: "The 'Manage Flights' tab. It lets an admin add a new flight at the top, view all flights in a table at the bottom, or delete a selected flight.",
        concepts: ["JTable (Data Table)", "Form Validation", "Cascade Delete Warning"],
        code: `package ui;

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
                "Are you sure you want to delete this flight?\\n\\n" +
                "Flight: " + flightNumber + "\\n" +
                "Route: " + source + " \\u2192 " + destination + "\\n" +
                "Date: " + date + "\\n\\n" +
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
}`,
        fields: [
            { name: "flightNumberField .. distanceField", type: "8 JTextField Boxes", desc: "Input boxes for typing the new flight's number, route, date, time, aircraft, seats, and distance." },
            { name: "flightsTable & tableModel", type: "JTable / DefaultTableModel", desc: "The 9-column table showing all flights stored in MySQL." }
        ],
        walkthrough: [
            {
                sig: "1. Form & Read-Only Table Setup: createFormPanel() & createTablePanel()",
                lines: [41, 160],
                desc: "Places the 'Add New Flight' form in the NORTH (top) and the 'All Flights' table in the CENTER (bottom).",
                points: [
                    "Lines 145-150: Overrides 'isCellEditable()' to return 'false' so users cannot double-click and accidentally edit cells inside the table."
                ]
            },
            {
                sig: "2. Validating & Adding a Flight: addFlight()",
                lines: [162, 238],
                desc: "Checks that all 8 boxes are filled and that Total Seats and Distance are positive whole numbers before saving to MySQL.",
                points: [
                    "Uses Integer.parseInt(...) inside try-catch blocks to make sure the user typed numbers (not letters) for Total Seats and Distance."
                ]
            },
            {
                sig: "3. Refreshing & Deleting Flights: loadFlights() & deleteFlight()",
                lines: [240, 297],
                desc: "Loads all flights into the table or asks 'Are you sure?' before deleting a flight and all its bookings.",
                points: [
                    "Line 241: 'tableModel.setRowCount(0)' clears the old table rows before adding the fresh list from MySQL."
                ]
            }
        ],
        viva: [
            "Q: Why do we call tableModel.setRowCount(0) at the start of loadFlights()? A: It clears out the existing rows in the table first; otherwise, clicking Refresh would duplicate all the rows at the bottom of the table."
        ]
    },
    {
        id: "ui/SeatMapPanel.java",
        name: "SeatMapPanel.java",
        pkg: "ui",
        path: "code/ui/SeatMapPanel.java",
        page: "pages/ui-SeatMapPanel.html",
        role: "Draws the interactive airplane cabin map with 9 seats per row (3 seats | aisle | 4 seats | aisle | 2 seats), grouped into First Class (Gold), Business (Light Blue), and Economy (Light Green).",
        concepts: ["Dynamic Button Creation", "Custom Listener Interface", "Row & Column Math (1A–1I)"],
        code: `package ui;

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

            JLabel divider1 = new JLabel("\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500");
            divider1.setForeground(Color.GRAY);
            divider1.setAlignmentX(Component.CENTER_ALIGNMENT);
            seatsPanel.add(divider1);
            seatsPanel.add(Box.createVerticalStrut(5));
        }

        int businessStart = economySeats + 1;
        if (businessStart <= firstClassStart - 1) {
            addSection(seatsPanel, seats, businessStart - 1, firstClassStart - 2, "Business", seatsPerRow);

            JLabel divider2 = new JLabel("\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500");
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
}`,
        fields: [
            { name: "SEAT_LAYOUT = {3, 4, 2}", type: "int[] Constant", desc: "Means each row has 3 seats on the left, an aisle, 4 seats in the middle, an aisle, and 2 seats on the right (9 seats per row)." },
            { name: "SEAT_LABELS = A..I", type: "String[] Constant", desc: "Letters A through I used to name seats like '1A', '1B', '1C'..." },
            { name: "seatNumberToButtonIndex", type: "HashMap<Integer, Integer>", desc: "A quick lookup dictionary that remembers which button on screen belongs to which seat number." }
        ],
        walkthrough: [
            {
                sig: "1. Setup & Color Legend: initializeSeatMap() & createLegendPanel()",
                lines: [32, 92],
                desc: "Creates a scrollable area for the seats and a color key (Legend) at the bottom.",
                points: [
                    "Color key: Red = Booked (disabled), Blue = Currently Selected, Gold = First Class, Light Blue = Business, Light Green = Economy."
                ]
            },
            {
                sig: "2. Drawing the 3 Cabin Sections: updateSeatButtons()",
                lines: [100, 147],
                desc: "Draws First Class at the top (front of the plane), Business in the middle, and Economy at the bottom.",
                points: [
                    "Adds a gray horizontal divider line between First Class, Business, and Economy so the cabin sections are easy to see."
                ]
            },
            {
                sig: "3. Naming Seats (1A, 1B...) & Adding Aisles: addSection()",
                lines: [162, 208],
                desc: "Loops through the seats in a cabin section, turns seat numbers into labels like '1A', and puts gaps for the aisles.",
                points: [
                    "Lines 176-178: Simple math converts a seat number into a row and letter! '(seatNum - 1) / 9 + 1' gives the row number, and '(seatNum - 1) % 9' picks the letter A–I.",
                    "Lines 183-186: If 'seat.isBooked()' is true, the button is colored RED and disabled ('setEnabled(false)') so nobody can click it."
                ]
            },
            {
                sig: "4. Clicking a Seat Button: handleSeatClick(int seatNumber)",
                lines: [210, 232],
                desc: "Turns the clicked seat button BLUE, resets the previously clicked seat back to its normal class color, and tells BookingPanel which seat was chosen.",
                points: [
                    "Line 230: Calls 'seatSelectionListener.seatSelected(seatNumber)' so BookingPanel knows which seat number you picked."
                ]
            }
        ],
        viva: [
            "Q: How does SeatMapPanel turn seat number 10 into '2A'? A: With 9 seats per row: Row = (10 - 1) / 9 + 1 = 2, and Position = (10 - 1) % 9 = 0 (which is 'A' in SEAT_LABELS), giving '2A'."
        ]
    },
    {
        id: "ui/ViewBookingsPanel.java",
        name: "ViewBookingsPanel.java",
        pkg: "ui",
        path: "code/ui/ViewBookingsPanel.java",
        page: "pages/ui-ViewBookingsPanel.html",
        role: "The 'View Bookings' tab. It shows all booked tickets in a table and provides buttons to Cancel a booking or Export a printable .txt boarding pass.",
        concepts: ["JTable", "Booking Cancellation", "JFileChooser (Save File Dialog)"],
        code: `package ui;

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
                    "Ticket exported successfully to:\\n" + fileToSave.getAbsolutePath(),
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
}`,
        fields: [
            { name: "bookingsTable & tableModel", type: "JTable / DefaultTableModel", desc: "The 7-column table showing every ticket booked across all flights." },
            { name: "cancelButton / exportButton / refreshButton", type: "3 JButtons", desc: "Action buttons at the top-left of the screen." }
        ],
        walkthrough: [
            {
                sig: "1. Buttons, Table & Loading Data: createButtonPanel(), createTablePanel(), loadBookings()",
                lines: [37, 105],
                desc: "Creates the 3 action buttons at the top and fills the table with bookings from MySQL.",
                points: [
                    "Lines 89-105 (loadBookings): Clears old rows, fetches all bookings from BookingDAO, and adds each booking as a row in the table."
                ]
            },
            {
                sig: "2. Cancelling a Ticket: cancelBooking()",
                lines: [107, 135],
                desc: "Deletes the selected booking from MySQL after asking the user to confirm.",
                points: [
                    "Line 118: Reads the Booking ID from column 0 of the highlighted table row ('tableModel.getValueAt(selectedRow, 0)').",
                    "Line 126: Calls 'bookingDAO.cancelBooking(bookingId)' to delete it from MySQL and refreshes the table. The seat immediately becomes available again on the seat map!"
                ]
            },
            {
                sig: "3. Saving a Ticket as a .txt File: exportTicket()",
                lines: [137, 177],
                desc: "Opens a 'Save As' file window and saves the selected booking as a formatted boarding pass text file.",
                points: [
                    "Lines 156-160: Uses 'JFileChooser' to open a standard Windows 'Save File' dialog box, pre-filled with the filename 'ticket_<bookingId>.txt'.",
                    "Line 166: Calls 'booking.exportTicket(fileToSave.getAbsolutePath())' (from Booking.java) to write the boarding pass to disk."
                ]
            }
        ],
        viva: [
            "Q: What happens when you cancel a booking in ViewBookingsPanel? A: It deletes the row from the MySQL 'bookings' table. When you switch back to the 'Book Flight' tab, that seat is no longer in getBookedSeatNumbers(), so it turns from Red back to Available!"
        ]
    }
);

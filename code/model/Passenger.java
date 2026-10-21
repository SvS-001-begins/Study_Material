package model;

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
                return idProofNumber.matches("\\d{12}");
            case "Passport":
                return idProofNumber.matches("[A-Z]\\d{7}");
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
        return contactNumber.matches("\\d{10}");
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
}

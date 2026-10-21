package exceptions;

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
}

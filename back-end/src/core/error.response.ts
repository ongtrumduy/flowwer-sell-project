class ErrorResponse extends Error {
  statusCode: number;
  message: string;
  reasonStatusCode: string;

  constructor({
    statusCode,
    message,
    reasonStatusCode,
  }: {
    statusCode: number;
    message: string;
    reasonStatusCode: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.reasonStatusCode = reasonStatusCode;
  }
}

export default ErrorResponse;

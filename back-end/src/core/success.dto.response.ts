class SuccessDTODataResponse {
  statusCode: number;
  message: string;
  reasonStatusCode: string;
  metaData: any;

  constructor({
    statusCode,
    message,
    reasonStatusCode,
    metaData,
  }: {
    statusCode: number;
    message: string;
    reasonStatusCode: string;
    metaData: any;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.reasonStatusCode = reasonStatusCode;
    this.metaData = metaData;
  }
}

export default SuccessDTODataResponse;

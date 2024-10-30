import { Response } from 'express';

const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

const ReasonStatusCode = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  OK: 'Success',
};

class SuccessResponse {
  message;
  status;
  metaData;

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metaData = {},
  }: {
    message?: string;
    statusCode: number;
    reasonStatusCode: string;
    metaData: any;
  }) {
    this.message = message
      ? message
      : reasonStatusCode
        ? reasonStatusCode
        : ReasonStatusCode.OK;
    this.status = statusCode ? statusCode : StatusCode.OK;
    this.metaData = metaData;
  }

  send({ res, headers = {} }: { res: Response; headers?: any }) {
    // return res.status(this.status).json({
    //   message: this.message,
    //   metadata: this.metadata,
    //   statusCode: this.status,
    // //   ...headers,
    // });

    return res.status(this.status).json(this);
  }
}

export default SuccessResponse;

import { EnumReasonStatusCode } from '../utils/type';
import express, { Request, Response } from 'express';

class ErrorResponse {
  statusCode;
  message;
  reasonStatusCode;
  status;
  stack;

  constructor({
    statusCode = 500,
    message,
    reasonStatusCode,
    status,
    stack,
  }: {
    statusCode: number;
    message: string;
    reasonStatusCode: string;
    status: any;
    stack: any;
  }) {
    this.statusCode = statusCode ? statusCode : 500;

    this.message = message ? message : 'Internal Server Error';

    this.reasonStatusCode = reasonStatusCode
      ? reasonStatusCode
      : EnumReasonStatusCode.INTERNAL_SERVER_ERROR;

    this.status = 'ERROR';

    this.stack = stack;
  }

  send({ res, headers = {} }: { res: Response; headers?: any }) {
    return res.status(this.statusCode).json(this);
  }
}

export default ErrorResponse;

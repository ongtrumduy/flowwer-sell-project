import express, { Request, Response } from 'express';
import { EnumMessageStatus, EnumReasonStatusCode } from '../utils/type';

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
  statusCode;
  metaData;
  reasonStatusCode;

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metaData = {},
  }: {
    message: string;
    statusCode: number;
    reasonStatusCode: string;
    metaData: any;
  }) {
    this.message = message ? message : EnumMessageStatus.SUCCESS_200;

    this.reasonStatusCode = reasonStatusCode
      ? reasonStatusCode
      : EnumReasonStatusCode.SUCCESS_200;

    this.statusCode = statusCode ? statusCode : StatusCode.OK;

    this.metaData = metaData;
  }

  send({ res, headers = {} }: { res: Response; headers?: any }) {
    return res.status(this.statusCode).json(this);
  }
}

export default SuccessResponse;

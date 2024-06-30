import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";

import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

type ResponseObj = {
    statusCode: number,
    timeStamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseObj: ResponseObj = {
            statusCode: 500,
            timeStamp: new Date().toISOString(),
            path: request.url,
            response: '',
        }

        if (exception instanceof HttpException) {
            responseObj.statusCode = exception.getStatus();
            responseObj.response = exception.getResponse();
        } else if (exception instanceof PrismaClientValidationError) {
            responseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            responseObj.response = exception.message.replaceAll('/\n/g', '');
        } else if (exception instanceof PrismaClientKnownRequestError) {
            responseObj.statusCode = HttpStatus.BAD_REQUEST;
            const index = exception.message.lastIndexOf('\n');
            if (index > -1) {
                responseObj.response = exception.message.slice(index + 1);
            }
            else
                responseObj.response = exception.message.replaceAll('/\n/g', '');

        } else {
            responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            responseObj.response = 'Internal Server Error';
        }

        response
            .status(responseObj.statusCode)
            .json(responseObj);

        // Can Log the error

        super.catch(exception, host);
    }
}
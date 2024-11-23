import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => this.transformResponse(data)),
      catchError((error) => {
        return throwError(() => this.transformError(error));
      }),
    );
  }

  private transformResponse(data: T): Response<T> {
    return {
      status: 'success',
      message: 'completed successfully',
      data: data || null,
    };
  }

  private transformError(error: any): HttpException {
    let response: any;

    if (error instanceof HttpException) {
      const errorResponse = error.getResponse();

      // Handle string error messages
      if (typeof errorResponse === 'string') {
        response = {
          status: 'error',
          message: errorResponse,
          data: null,
        };
      }
      // Handle object error responses (like validation errors)
      else if (typeof errorResponse === 'object') {
        response = {
          status: 'error',
          // @ts-ignore
          message: Array.isArray(errorResponse.message)
            ? // @ts-ignore
              errorResponse.message
            : // @ts-ignore
              errorResponse.message || 'An error occurred',
          data: null,
        };
      }

      return new HttpException(response, error.getStatus());
    }

    // Handle unknown errors
    response = {
      status: 'error',
      message: 'Internal server error',
      data: null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    };

    return new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

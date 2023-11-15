import { Logger } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { Request, Response, NextFunction } from 'express';

const nestLogger = new Logger('HTTP');

export function requestLogMiddlware(request: Request, response: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = request;
  response.on('finish', () => {
    const { statusCode } = response;
    const timeString = clc.yellow(`${Date.now() - start}ms`);
    nestLogger.log(`${method} ${originalUrl} ${statusCode} ${timeString}`);
  });
  next();
}

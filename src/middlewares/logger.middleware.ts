import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import os from "os";

import {
  getStatusIndicator,
  getMethodIndicator,
  padField,
  formatBytes,
  safeStringify,
  getLogLevel,
  isSuspiciousRequest,
  writeToLog,
} from "../utils/loggerHelpers";

import {
  getAccessLogEntry,
  getErrorLogEntry,
  getPerformanceLogEntry,
  getSecurityLogEntry,
  getDebugLogEntry,
} from "../utils/loggerTables";

const logDirectory = path.join(__dirname, "../log");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFiles = {
  access: path.join(logDirectory, "access.log"),
  error: path.join(logDirectory, "error.log"),
  debug: path.join(logDirectory, "debug.log"),
  performance: path.join(logDirectory, "performance.log"),
  security: path.join(logDirectory, "security.log"),
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const startTime = new Date();

  const userAgent = req.get("User-Agent") || "Unknown";
  const contentLength = req.get("Content-Length") || "0";
  const acceptLanguage = req.get("Accept-Language") || "Unknown";
  const referer = req.get("Referer") || "Direct";
  const clientIP = req.ip || req.connection.remoteAddress;
  const headers = req.headers ?? {};
  const requestId = headers["x-request-id"] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const endTime = new Date();

    const query = req.query ?? {};
    const params = req.params ?? {};
    const body = req.body ?? {};
    const cookies = (req as any).cookies ?? {}; // cast if not typed

    const responseSize = res.get("Content-Length") || "Unknown";
    const contentType = res.get("Content-Type") || "Unknown";
    const logLevel = getLogLevel(res.statusCode);

    // Write Access Log
    const accessLogEntry = getAccessLogEntry(
      req,
      res,
      startTime,
      durationMs,
      clientIP,
      userAgent,
      referer,
      acceptLanguage,
      contentLength,
      responseSize,
      contentType,
      query,
      params,
      body,
      cookies,
      headers,
      endTime
    );
    writeToLog(logFiles.access, accessLogEntry);

    // Write Error Log (for status >= 400)
    if (res.statusCode >= 400) {
      const errorLogEntry = getErrorLogEntry(req, res, startTime, durationMs, clientIP, userAgent, query, body, logLevel);
      writeToLog(logFiles.error, errorLogEntry);
    }

    // Write Performance Log (for requests > 1000 ms)
    if (durationMs > 1000) {
      const perfLogEntry = getPerformanceLogEntry(req, res, startTime, durationMs, clientIP, contentLength, query);
      writeToLog(logFiles.performance, perfLogEntry);
    }

    // Write Security Log (suspicious or 401/403)
    if (isSuspiciousRequest(req) || res.statusCode === 401 || res.statusCode === 403) {
      const reason = isSuspiciousRequest(req) ? "Suspicious Pattern" : `HTTP ${res.statusCode}`;
      const securityLogEntry = getSecurityLogEntry(req, res, startTime, clientIP, userAgent, referer, headers, query, body, reason);
      writeToLog(logFiles.security, securityLogEntry);
    }

    // Write Debug Log only in development
    if (process.env.NODE_ENV === "development") {
      const debugLogEntry = getDebugLogEntry(req, res, startTime, durationMs, clientIP, headers, body, cookies);
      writeToLog(logFiles.debug, debugLogEntry);

      // Also print a short console line in dev
      console.log(
        `${getStatusIndicator(res.statusCode)} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${durationMs.toFixed(2)}ms`
      );
    }
  });

  next();
};

// import { Request, Response, NextFunction } from "express";
// import fs from "fs";
// import path from "path";
// import os from "os";

// const logDirectory = path.join(__dirname, "../log");
// if (!fs.existsSync(logDirectory)) {
//     fs.mkdirSync(logDirectory, { recursive: true });
// }

// const logFiles = {
//     access: path.join(logDirectory, "access.log"),
//     error: path.join(logDirectory, "error.log"),
//     debug: path.join(logDirectory, "debug.log"),
//     performance: path.join(logDirectory, "performance.log"),
//     security: path.join(logDirectory, "security.log")
// };

// const getStatusIndicator = (status: number): string => {
//     if (status >= 200 && status < 300) return "✅";
//     if (status >= 300 && status < 400) return "🔄";
//     if (status >= 400 && status < 500) return "⚠️ ";
//     if (status >= 500) return "❌";
//     return "ℹ️ ";
// };

// const getMethodIndicator = (method: string): string => {
//     const indicators: { [key: string]: string } = {
//         GET: "📖",
//         POST: "📝",
//         PUT: "✏️ ",
//         PATCH: "🔧",
//         DELETE: "🗑️ ",
//         OPTIONS: "⚙️ ",
//         HEAD: "👁️ "
//     };
//     return indicators[method] || "📋";
// };

// const formatBytes = (bytes: number): string => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
// };

// const safeStringify = (obj: any, maxLength = 1000): string => {
//     try {
//         const str = JSON.stringify(obj, null, 2);
//         return str.length > maxLength ? str + "..." : str;
//     } catch (error) {
//         return "[Circular Reference or Invalid JSON]";
//     }
// };

// const padField = (value: string, length: number): string => {
//     return value.length > length ? value + "..." : value.padEnd(length);
// };

// const writeToLog = (filePath: string, content: string) => {
//     fs.appendFile(filePath, content, { encoding: "utf8" }, (err) => {
//         if (err) {
//             console.error(`❌ Failed to write to ${path.basename(filePath)}:`, err.message);
//         }
//     });
// };

// const getLogLevel = (status: number): string => {
//     if (status >= 500) return "ERROR";
//     if (status >= 400) return "WARN";
//     if (status >= 300) return "INFO";
//     return "SUCCESS";
// };

// const isSuspiciousRequest = (req: Request): boolean => {
//     const suspiciousPatterns = [
//         /\.(php|asp|jsp|cgi)$/i,
//         /\/wp-admin|\/wp-login|\/phpmyadmin/i,
//         /\.\.|\/etc\/|\/var\/|\/usr\/|\/bin\//i,
//         /<script|javascript:|on\w+=/i,
//         /union\s+select|drop\s+table|insert\s+into/i
//     ];
    
//     const url = req.originalUrl.toLowerCase();
//     const userAgent = (req.get("User-Agent") || "").toLowerCase();
    
//     return suspiciousPatterns.some(pattern => 
//         pattern.test(url) || pattern.test(userAgent)
//     );
// };

// export const logger = (req: Request, res: Response, next: NextFunction) => {
//     const start = process.hrtime.bigint();
//     const startTime = new Date();
    
    
//     const userAgent = req.get("User-Agent") || "Unknown";
//     const contentLength = req.get("Content-Length") || "0";
//     const acceptLanguage = req.get("Accept-Language") || "Unknown";
//     const referer = req.get("Referer") || "Direct";
//     const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     const clientIP = req.ip || req.connection.remoteAddress;
    
//     res.on("finish", () => {
//         const end = process.hrtime.bigint();
//         const durationMs = Number(end - start) / 1e6;
//         const endTime = new Date();
        
//         const query = req.query ?? {};
//         const params = req.params ?? {};
//         const body = req.body ?? {};
//         const cookies = req.cookies ?? {};
//         const headers = req.headers ?? {};
        
        
//         const responseSize = res.get("Content-Length") || "Unknown";
//         const contentType = res.get("Content-Type") || "Unknown";
//         const logLevel = getLogLevel(res.statusCode);
        
        
//         const memoryUsage = process.memoryUsage();
//         const cpuUsage = process.cpuUsage();
        
        
//         const accessLogEntry = `
// ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
// │                           ${getStatusIndicator(res.statusCode)} REQUEST LOG - ${startTime.toLocaleString().padEnd(24)} │
// ├─────────────────────────────────────────────────────────────────────────────────────────────┤
// │ Field                │ Value                                                                │
// ├─────────────────────────────────────────────────────────────────────────────────────────────┤
// │ Timestamp            │ ${padField(startTime.toISOString(), 64)} │
// │ Method               │ ${padField(`${getMethodIndicator(req.method)} ${req.method}`, 64)} │
// │ Route                │ ${padField(req.originalUrl, 64)} │
// │ Status Code          │ ${padField(`${res.statusCode} ${getStatusIndicator(res.statusCode)}`, 64)} │
// │ Duration             │ ${padField(`${durationMs.toFixed(2)} ms`, 64)} │
// │ Client IP            │ ${padField(clientIP || "Unknown", 64)} │
// │ User Agent           │ ${padField(userAgent, 64)} │
// │ Referer              │ ${padField(referer, 64)} │
// │ Accept Language      │ ${padField(acceptLanguage, 64)} │
// │ Protocol             │ ${padField(`${req.protocol.toUpperCase()} ${req.secure ? "(Secure)" : "(Insecure)"}`, 64)} │
// │ Request Size         │ ${padField(formatBytes(parseInt(contentLength)), 64)} │
// │ Response Size        │ ${padField(responseSize === "Unknown" ? "Unknown" : formatBytes(parseInt(responseSize)), 64)} │
// │ Content Type         │ ${padField(contentType, 64)} │
// ├─────────────────────────────────────────────────────────────────────────────────────────────┤
// │ Query Params         │ ${padField(Object.keys(query).length === 0 ? "None" : JSON.stringify(query), 64)} │
// │ Route Params         │ ${padField(Object.keys(params).length === 0 ? "None" : JSON.stringify(params), 64)} │
// │ Request Body         │ ${padField(Object.keys(body).length === 0 ? "None" : safeStringify(body, 60), 64)} │
// │ Cookies              │ ${padField(Object.keys(cookies).length === 0 ? "None" : JSON.stringify(cookies), 64)} │
// ├─────────────────────────────────────────────────────────────────────────────────────────────┤
// │ Content-Type Header  │ ${padField(headers['content-type'] || "Not Set", 64)} │
// │ Authorization        │ ${padField(headers['authorization'] ? "[HIDDEN]" : "Not Set", 64)} │
// │ Accept Header        │ ${padField(headers['accept'] || "Not Set", 64)} │
// │ Host Header          │ ${padField(headers['host'] || "Not Set", 64)} │
// │ Origin Header        │ ${padField(headers['origin'] || "Not Set", 64)} │
// ├─────────────────────────────────────────────────────────────────────────────────────────────┤
// │ Memory Usage         │ ${padField(`${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)} heap`, 64)} │
// │ CPU Usage            │ ${padField(`${(cpuUsage.user / 1000).toFixed(1)}ms user, ${(cpuUsage.system / 1000).toFixed(1)}ms system`, 64)} │
// │ Process ID           │ ${padField(process.pid.toString(), 64)} │
// │ Node Version         │ ${padField(process.version, 64)} │
// │ Platform             │ ${padField(`${os.platform()}-${os.arch()}`, 64)} │
// │ Completed At         │ ${padField(endTime.toLocaleTimeString(), 64)} │
// └─────────────────────────────────────────────────────────────────────────────────────────────┘

// `;

        
//         writeToLog(logFiles.access, accessLogEntry);

        
//         if (res.statusCode >= 400) {
//             const errorLogEntry = `
// ┌───────────────────────────────────────────────────────────────────────────────────┐
// │                          ❌ ERROR LOG - ${startTime.toLocaleString().padEnd(20)} │
// ├─────────────────────────┬─────────────────────────────────────────────────────────┤
// │ Timestamp               │ ${padField(startTime.toISOString(), 55)} │
// │ Error Level             │ ${padField(logLevel, 55)} │
// │ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 55)} │
// │ Status Code             │ ${padField(res.statusCode.toString(), 55)} │
// │ Duration                │ ${padField(`${durationMs.toFixed(2)}ms`, 55)} │
// │ Client IP               │ ${padField(clientIP || "Unknown", 55)} │
// │ User Agent              │ ${padField(userAgent, 55)} │
// │ Query Params            │ ${padField(JSON.stringify(query), 55)} │
// │ Request Body            │ ${padField(safeStringify(body, 50), 55)} │
// │ Memory Usage            │ ${padField(formatBytes(memoryUsage.heapUsed), 55)} │
// └─────────────────────────┴─────────────────────────────────────────────────────────┘

// `;
//             writeToLog(logFiles.error, errorLogEntry);
//         }

        
//         if (durationMs > 1000) {
//             const perfLogEntry = `
// ┌─────────────────────────────────────────────────────────────────────────────────────┐
// │                        🐌 PERFORMANCE LOG - ${startTime.toLocaleString().padEnd(18)} │
// ├───────────────────────┬─────────────────────────────────────────────────────────────┤
// │ Timestamp             │ ${padField(startTime.toISOString(), 57)} │
// │ Method & Route        │ ${padField(`${req.method} ${req.originalUrl}`, 57)} │
// │ Duration              │ ${padField(`${durationMs.toFixed(2)}ms (SLOW!)`, 57)} │
// │ Status Code           │ ${padField(res.statusCode.toString(), 57)} │
// │ Client IP             │ ${padField(clientIP || "Unknown", 57)} │
// │ Memory RSS            │ ${padField(formatBytes(memoryUsage.rss), 57)} │
// │ Memory Heap           │ ${padField(`${formatBytes(memoryUsage.heapUsed)}/${formatBytes(memoryUsage.heapTotal)}`, 57)} │
// │ CPU User Time         │ ${padField(`${(cpuUsage.user / 1000).toFixed(2)}ms`, 57)} │
// │ CPU System Time       │ ${padField(`${(cpuUsage.system / 1000).toFixed(2)}ms`, 57)} │
// │ Request Size          │ ${padField(formatBytes(parseInt(contentLength)), 57)} │
// │ Query Params          │ ${padField(JSON.stringify(query), 57)} │
// └───────────────────────┴─────────────────────────────────────────────────────────────┘

// `;
//             writeToLog(logFiles.performance, perfLogEntry);
//         }

        
//         if (isSuspiciousRequest(req) || res.statusCode === 403 || res.statusCode === 401) {
//             const securityLogEntry = `
// ┌───────────────────────────────────────────────────────────────────────────────────────┐
// │                         🚨 SECURITY ALERT - ${startTime.toLocaleString().padEnd(19)} │
// ├─────────────────────────┬─────────────────────────────────────────────────────────────┤
// │ Timestamp               │ ${padField(startTime.toISOString(), 57)} │
// │ Alert Reason            │ ${padField(isSuspiciousRequest(req) ? "Suspicious Pattern" : `HTTP ${res.statusCode}`, 57)} │
// │ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 57)} │
// │ Status Code             │ ${padField(res.statusCode.toString(), 57)} │
// │ Client IP               │ ${padField(clientIP || "Unknown", 57)} │
// │ User Agent              │ ${padField(userAgent, 57)} │
// │ Referer                 │ ${padField(referer, 57)} │
// │ Authorization Header    │ ${padField(headers['authorization'] ? "[PRESENT]" : "[NOT PRESENT]", 57)} │
// │ Query Params            │ ${padField(JSON.stringify(query), 57)} │
// │ Request Body            │ ${padField(safeStringify(body, 55), 57)} │
// └─────────────────────────┴─────────────────────────────────────────────────────────────┘

// `;
//             writeToLog(logFiles.security, securityLogEntry);
//         }

        
//         if (process.env.NODE_ENV === "development") {
//             const debugLogEntry = `
// ┌─────────────────────────────────────────────────────────────────────────────────────────┐
// │                          🔍 DEBUG LOG - ${startTime.toLocaleString().padEnd(22)} │
// ├─────────────────────────┬───────────────────────────────────────────────────────────────┤
// │ Timestamp               │ ${padField(startTime.toISOString(), 59)} │
// │ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 59)} │
// │ Status & Duration       │ ${padField(`${res.statusCode} - ${durationMs.toFixed(2)}ms`, 59)} │
// │ Client IP               │ ${padField(clientIP || "Unknown", 59)} │
// │ Full Headers            │ ${padField(JSON.stringify(headers), 59)} │
// │ Full Body               │ ${padField(safeStringify(body), 59)} │
// │ All Cookies             │ ${padField(JSON.stringify(cookies), 59)} │
// │ Memory Details          │ ${padField(JSON.stringify(memoryUsage), 59)} │
// │ CPU Details             │ ${padField(JSON.stringify(cpuUsage), 59)} │
// │ OS Load Average         │ ${padField(os.loadavg().toString(), 59)} │
// │ Platform Details        │ ${padField(`${os.platform()} ${os.arch()} ${os.release()}`, 59)} │
// └─────────────────────────┴───────────────────────────────────────────────────────────────┘

// `;
//             writeToLog(logFiles.debug, debugLogEntry);
//         }

        
//         if (process.env.NODE_ENV === "development") {
//             console.log(`${getStatusIndicator(res.statusCode)} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${durationMs.toFixed(2)}ms`);
//         }
//     });

//     next();
// };




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

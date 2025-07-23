import { Request, Response } from "express";
import {
  getStatusIndicator,
  getMethodIndicator,
  padField,
  formatBytes,
  safeStringify,
} from "./loggerHelpers";

import os from "os";

export const getAccessLogEntry = (
  req: Request,
  res: Response,
  startTime: Date,
  durationMs: number,
  clientIP: string | undefined,
  userAgent: string,
  referer: string,
  acceptLanguage: string,
  contentLength: string,
  responseSize: string,
  contentType: string,
  query: any,
  params: any,
  body: any,
  cookies: any,
  headers: any,
  endTime: Date
) => `
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ${getStatusIndicator(res.statusCode)} REQUEST LOG - ${startTime.toLocaleString().padEnd(24)} │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Field                │ Value                                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Timestamp            │ ${padField(startTime.toISOString(), 64)} │
│ Method               │ ${padField(`${getMethodIndicator(req.method)} ${req.method}`, 64)} │
│ Route                │ ${padField(req.originalUrl, 64)} │
│ Status Code          │ ${padField(`${res.statusCode} ${getStatusIndicator(res.statusCode)}`, 64)} │
│ Duration             │ ${padField(`${durationMs.toFixed(2)} ms`, 64)} │
│ Client IP            │ ${padField(clientIP || "Unknown", 64)} │
│ User Agent           │ ${padField(userAgent, 64)} │
│ Referer              │ ${padField(referer, 64)} │
│ Accept Language      │ ${padField(acceptLanguage, 64)} │
│ Protocol             │ ${padField(`${req.protocol.toUpperCase()} ${req.secure ? "(Secure)" : "(Insecure)"}`, 64)} │
│ Request Size         │ ${padField(formatBytes(parseInt(contentLength)), 64)} │
│ Response Size        │ ${padField(responseSize === "Unknown" ? "Unknown" : formatBytes(parseInt(responseSize)), 64)} │
│ Content Type         │ ${padField(contentType, 64)} │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Query Params         │ ${padField(Object.keys(query).length === 0 ? "None" : JSON.stringify(query), 64)} │
│ Route Params         │ ${padField(Object.keys(params).length === 0 ? "None" : JSON.stringify(params), 64)} │
│ Request Body         │ ${padField(Object.keys(body).length === 0 ? "None" : safeStringify(body, 60), 64)} │
│ Cookies              │ ${padField(Object.keys(cookies).length === 0 ? "None" : JSON.stringify(cookies), 64)} │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Content-Type Header  │ ${padField(headers['content-type'] || "Not Set", 64)} │
│ Authorization        │ ${padField(headers['authorization'] ? "[HIDDEN]" : "Not Set", 64)} │
│ Accept Header        │ ${padField(headers['accept'] || "Not Set", 64)} │
│ Host Header          │ ${padField(headers['host'] || "Not Set", 64)} │
│ Origin Header        │ ${padField(headers['origin'] || "Not Set", 64)} │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Memory Usage         │ ${padField(`${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(process.memoryUsage().heapTotal)} heap`, 64)} │
│ CPU Usage            │ ${padField(`${(process.cpuUsage().user / 1000).toFixed(1)}ms user, ${(process.cpuUsage().system / 1000).toFixed(1)}ms system`, 64)} │
│ Process ID           │ ${padField(process.pid.toString(), 64)} │
│ Node Version         │ ${padField(process.version, 64)} │
│ Platform             │ ${padField(`${os.platform()}-${os.arch()}`, 64)} │
│ Completed At         │ ${padField(endTime.toLocaleTimeString(), 64)} │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
`;

export const getErrorLogEntry = (
  req: Request,
  res: Response,
  startTime: Date,
  durationMs: number,
  clientIP: string | undefined,
  userAgent: string,
  query: any,
  body: any,
  logLevel: string
) => `
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          ❌ ERROR LOG - ${startTime.toLocaleString().padEnd(20)} │
├─────────────────────────┬─────────────────────────────────────────────────────────┤
│ Timestamp               │ ${padField(startTime.toISOString(), 55)} │
│ Error Level             │ ${padField(logLevel, 55)} │
│ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 55)} │
│ Status Code             │ ${padField(res.statusCode.toString(), 55)} │
│ Duration                │ ${padField(`${durationMs.toFixed(2)}ms`, 55)} │
│ Client IP               │ ${padField(clientIP || "Unknown", 55)} │
│ User Agent              │ ${padField(userAgent, 55)} │
│ Query Params            │ ${padField(JSON.stringify(query), 55)} │
│ Request Body            │ ${padField(safeStringify(body, 50), 55)} │
│ Memory Usage            │ ${padField(formatBytes(process.memoryUsage().heapUsed), 55)} │
└─────────────────────────┴─────────────────────────────────────────────────────────┘
`;

export const getPerformanceLogEntry = (
  req: Request,
  res: Response,
  startTime: Date,
  durationMs: number,
  clientIP: string | undefined,
  contentLength: string,
  query: any
) => `
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        🐌 PERFORMANCE LOG - ${startTime.toLocaleString().padEnd(18)} │
├───────────────────────┬─────────────────────────────────────────────────────────────┤
│ Timestamp             │ ${padField(startTime.toISOString(), 57)} │
│ Method & Route        │ ${padField(`${req.method} ${req.originalUrl}`, 57)} │
│ Duration              │ ${padField(`${durationMs.toFixed(2)}ms (SLOW!)`, 57)} │
│ Status Code           │ ${padField(res.statusCode.toString(), 57)} │
│ Client IP             │ ${padField(clientIP || "Unknown", 57)} │
│ Memory RSS            │ ${padField(formatBytes(process.memoryUsage().rss), 57)} │
│ Memory Heap           │ ${padField(`${formatBytes(process.memoryUsage().heapUsed)}/${formatBytes(process.memoryUsage().heapTotal)}`, 57)} │
│ CPU User Time         │ ${padField(`${(process.cpuUsage().user / 1000).toFixed(2)}ms`, 57)} │
│ CPU System Time       │ ${padField(`${(process.cpuUsage().system / 1000).toFixed(2)}ms`, 57)} │
│ Request Size          │ ${padField(formatBytes(parseInt(contentLength)), 57)} │
│ Query Params          │ ${padField(JSON.stringify(query), 57)} │
└───────────────────────┴─────────────────────────────────────────────────────────────┘
`;

export const getSecurityLogEntry = (
  req: Request,
  res: Response,
  startTime: Date,
  clientIP: string | undefined,
  userAgent: string,
  referer: string,
  headers: any,
  query: any,
  body: any,
  suspiciousReason: string
) => `
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                         🚨 SECURITY ALERT - ${startTime.toLocaleString().padEnd(19)} │
├─────────────────────────┬─────────────────────────────────────────────────────────────┤
│ Timestamp               │ ${padField(startTime.toISOString(), 57)} │
│ Alert Reason            │ ${padField(suspiciousReason, 57)} │
│ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 57)} │
│ Status Code             │ ${padField(res.statusCode.toString(), 57)} │
│ Client IP               │ ${padField(clientIP || "Unknown", 57)} │
│ User Agent              │ ${padField(userAgent, 57)} │
│ Referer                 │ ${padField(referer, 57)} │
│ Authorization Header    │ ${padField(headers['authorization'] ? "[PRESENT]" : "[NOT PRESENT]", 57)} │
│ Query Params            │ ${padField(JSON.stringify(query), 57)} │
│ Request Body            │ ${padField(safeStringify(body, 55), 57)} │
└─────────────────────────┴─────────────────────────────────────────────────────────────┘
`;

export const getDebugLogEntry = (
  req: Request,
  res: Response,
  startTime: Date,
  durationMs: number,
  clientIP: string | undefined,
  headers: any,
  body: any,
  cookies: any
) => `
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          🔍 DEBUG LOG - ${startTime.toLocaleString().padEnd(22)} │
├─────────────────────────┬───────────────────────────────────────────────────────────────┤
│ Timestamp               │ ${padField(startTime.toISOString(), 59)} │
│ Method & Route          │ ${padField(`${req.method} ${req.originalUrl}`, 59)} │
│ Status & Duration       │ ${padField(`${res.statusCode} - ${durationMs.toFixed(2)}ms`, 59)} │
│ Client IP               │ ${padField(clientIP || "Unknown", 59)} │
│ Full Headers            │ ${padField(JSON.stringify(headers), 59)} │
│ Full Body               │ ${padField(safeStringify(body), 59)} │
│ All Cookies             │ ${padField(JSON.stringify(cookies), 59)} │
│ Memory Details          │ ${padField(JSON.stringify(process.memoryUsage()), 59)} │
│ CPU Details             │ ${padField(JSON.stringify(process.cpuUsage()), 59)} │
│ OS Load Average         │ ${padField(os.loadavg().toString(), 59)} │
│ Platform Details        │ ${padField(`${os.platform()} ${os.arch()} ${os.release()}`, 59)} │
└─────────────────────────┴───────────────────────────────────────────────────────────────┘
`;

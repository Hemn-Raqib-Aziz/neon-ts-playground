import { Request } from "express";

export const getStatusIndicator = (status: number): string => {
  if (status >= 200 && status < 300) return "✅";
  if (status >= 300 && status < 400) return "🔄";
  if (status >= 400 && status < 500) return "⚠️ ";
  if (status >= 500) return "❌";
  return "ℹ️ ";
};

export const getMethodIndicator = (method: string): string => {
  const indicators: Record<string, string> = {
    GET: "📖",
    POST: "📝",
    PUT: "✏️ ",
    PATCH: "🔧",
    DELETE: "🗑️ ",
    OPTIONS: "⚙️ ",
    HEAD: "👁️ ",
  };
  return indicators[method] || "📋";
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const safeStringify = (obj: any, maxLength = 1000): string => {
  try {
    const str = JSON.stringify(obj, null, 2);
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  } catch {
    return "[Circular Reference or Invalid JSON]";
  }
};

export const padField = (value: string, length: number): string => {
  return value.length > length ? value.slice(0, length - 3) + "..." : value.padEnd(length);
};

export const getLogLevel = (status: number): string => {
  if (status >= 500) return "ERROR";
  if (status >= 400) return "WARN";
  if (status >= 300) return "INFO";
  return "SUCCESS";
};

export const isSuspiciousRequest = (req: Request): boolean => {
  const suspiciousPatterns = [
    /\.(php|asp|jsp|cgi)$/i,
    /\/wp-admin|\/wp-login|\/phpmyadmin/i,
    /\.\.|\/etc\/|\/var\/|\/usr\/|\/bin\//i,
    /<script|javascript:|on\w+=/i,
    /union\s+select|drop\s+table|insert\s+into/i,
  ];

  const url = req.originalUrl.toLowerCase();
  const userAgent = (req.get("User-Agent") || "").toLowerCase();

  return suspiciousPatterns.some((pattern) => pattern.test(url) || pattern.test(userAgent));
};

export const writeToLog = (filePath: string, content: string) => {
  import("fs").then(fs => {
    fs.appendFile(filePath, content, { encoding: "utf8" }, (err) => {
      if (err) {
        console.error(`❌ Failed to write to ${filePath}:`, err.message);
      }
    });
  });
};

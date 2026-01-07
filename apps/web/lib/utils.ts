import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const normalizeUrl = (url: string) => (url.startsWith("http") ? url : `https://${url}`);

export const getPublicServerUrl = () => {
  const isServer = typeof window === "undefined";
  const isProduction = isServer ? process.env.NODE_ENV === "production" : import.meta.env.PROD;

  if (!isProduction) return `http://localhost:3000`;

  if (isServer && process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  if (import.meta.env.VITE_RAILWAY_PUBLIC_DOMAIN) {
    return `https://${import.meta.env.VITE_RAILWAY_PUBLIC_DOMAIN}`;
  }

  return `http://localhost:3000`;
};

export const getApiUrl = () => {
  const isServer = typeof window === "undefined";
  const isProduction = isServer ? process.env.NODE_ENV === "production" : import.meta.env.PROD;

  if (!isProduction) return `http://localhost:3001`;

  if (isServer && process.env.API_URL) {
    return normalizeUrl(process.env.API_URL);
  }

  if (import.meta.env.VITE_API_URL) {
    return normalizeUrl(import.meta.env.VITE_API_URL);
  }

  return `http://localhost:3001`;
};

export const getGitUrl = () => {
  const workerUrl = getApiUrl();
  if (workerUrl) {
    return workerUrl;
  }
  const baseUrl = getPublicServerUrl();
  return `${baseUrl}/api/git`;
};

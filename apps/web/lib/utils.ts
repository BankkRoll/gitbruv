import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPublicServerUrl = () => {
  const isServer = typeof window === "undefined";
  const isProduction = isServer ? process.env.NODE_ENV === "production" : import.meta.env.PROD;

  if (isProduction) {
    if (isServer) {
      if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
      }
    }
    if (import.meta.env.VITE_RAILWAY_PUBLIC_DOMAIN) {
      return `https://${import.meta.env.VITE_RAILWAY_PUBLIC_DOMAIN}`;
    }
  }

  return `http://localhost:3000`;
};

export const getApiUrl = () => {
  const isServer = typeof window === "undefined";
  const isProduction = isServer ? process.env.NODE_ENV === "production" : import.meta.env.PROD;

  if (isProduction) {
    if (isServer) {
      if (process.env.API_URL) {
        const url = process.env.API_URL.startsWith("http") ? process.env.API_URL : `https://${process.env.API_URL}`;
        return url;
      }
    }
    if (import.meta.env.VITE_API_URL) {
      const url = import.meta.env.VITE_API_URL.startsWith("http") ? import.meta.env.VITE_API_URL : `https://${import.meta.env.VITE_API_URL}`;
      return url;
    }
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

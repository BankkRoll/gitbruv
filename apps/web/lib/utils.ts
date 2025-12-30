import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPublicServerUrl = () => {
  console.log("PUBLIC SERVER URL", process.env.NODE_ENV, process.env.RAILWAY_PUBLIC_DOMAIN);
  if (process.env.NODE_ENV === "production") {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  } else {
    return `http://localhost:3000`;
  }
};

export const getApiUrl = () => {
  console.log("API URL", process.env.NODE_ENV, process.env.API_URL);
  if (process.env.NODE_ENV === "production") {
    return `https://${process.env.API_URL}`;
  } else {
    return `http://localhost:3001`;
  }
};

export const getGitUrl = () => {
  const workerUrl = getApiUrl();
  if (workerUrl) {
    return workerUrl;
  }
  const baseUrl = getPublicServerUrl();
  return `${baseUrl}/api/git`;
};

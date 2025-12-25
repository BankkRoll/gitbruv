/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV?: string;
  readonly VITE_RAILWAY_PUBLIC_DOMAIN?: string;
  readonly VITE_PUBLIC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

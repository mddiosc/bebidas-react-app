/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly VITE_APP_TITLE: string;
  // más variables de entorno aquí...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

/**
 * Configuración principal de la aplicación Angular.
 * Define los providers y configuraciones globales necesarias
 * para el funcionamiento de la aplicación.
 *
 * @constant {ApplicationConfig} appConfig
 *
 * @description
 * Providers configurados:
 * - provideBrowserGlobalErrorListeners: Manejo global de errores del navegador
 * - provideZonelessChangeDetection: Detección de cambios sin Zone.js (mejor rendimiento)
 * - provideRouter: Sistema de enrutamiento con lazy loading
 * - provideHttpClient: Cliente HTTP con soporte para interceptores
 * - provideServiceWorker: Service Worker para PWA y capacidades offline
 *
 * @example
 * ```typescript
 * // Uso en main.ts
 * import { appConfig } from './app/app.config';
 *
 * bootstrapApplication(AppComponent, appConfig)
 *   .catch((err) => console.error(err));
 * ```
 *
 * @see {@link routes} Para la configuración de rutas
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Listeners globales para errores del navegador
    provideBrowserGlobalErrorListeners(),

    // Detección de cambios optimizada sin Zone.js
    provideZonelessChangeDetection(),

    // Sistema de routing con configuración de rutas
    provideRouter(routes),

    // Cliente HTTP con soporte para interceptores legacy
    provideHttpClient(withInterceptorsFromDi()),

    /**
     * Service Worker para PWA.
     * - enabled: Solo en modo producción
     * - registrationStrategy: Registra 30s después de que la app esté estable
     */
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};

import { Injectable, signal, effect } from '@angular/core';

/**
 * Servicio para gestionar el tema de la aplicación (modo claro/oscuro).
 * Persiste la preferencia del usuario en localStorage y sincroniza
 * el tema con el elemento HTML raíz.
 *
 * @class ThemeService
 *
 * @example
 * ```typescript
 * // Inyectar en un componente
 * private themeService = inject(ThemeService);
 *
 * // Alternar tema
 * this.themeService.toggleTheme();
 *
 * // Verificar si está en modo oscuro
 * const isDark = this.themeService.isDarkMode();
 * ```
 *
 * @description
 * Características:
 * - Persistencia en localStorage
 * - Señales reactivas para cambios de tema
 * - Detección de preferencia del sistema
 * - Sincronización automática con el DOM
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /** Clave para almacenar el tema en localStorage */
  private readonly THEME_KEY = 'todo-app-theme';

  /** Señal reactiva que indica si el modo oscuro está activo */
  isDarkMode = signal<boolean>(false);

  /**
   * Constructor del servicio.
   * Inicializa el tema desde localStorage o preferencia del sistema.
   */
  constructor() {
    this.initializeTheme();
    this.setupThemeEffect();
  }

  /**
   * Inicializa el tema al cargar la aplicación.
   * Prioriza: localStorage > preferencia del sistema > modo claro por defecto.
   *
   * @private
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }

  /**
   * Configura un efecto reactivo para aplicar el tema al DOM.
   * Se ejecuta automáticamente cuando cambia isDarkMode.
   *
   * @private
   */
  private setupThemeEffect(): void {
    effect(() => {
      const isDark = this.isDarkMode();
      this.applyTheme(isDark);
    });
  }

  /**
   * Aplica el tema al elemento HTML raíz y guarda en localStorage.
   *
   * @param {boolean} isDark - true para modo oscuro, false para claro
   * @private
   */
  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add('dark-theme');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      htmlElement.classList.remove('dark-theme');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }

  /**
   * Alterna entre modo claro y oscuro.
   *
   * @returns {void}
   *
   * @example
   * ```html
   * <button (click)="themeService.toggleTheme()">
   *   Cambiar Tema
   * </button>
   * ```
   */
  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  /**
   * Establece el tema específicamente.
   *
   * @param {boolean} isDark - true para modo oscuro, false para claro
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Forzar modo oscuro
   * this.themeService.setTheme(true);
   * ```
   */
  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }
}

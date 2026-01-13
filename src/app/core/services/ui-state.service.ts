import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Servicio centralizado para gestionar el estado de la interfaz de usuario.
 * Permite compartir y modificar el estado de la UI desde cualquier componente.
 *
 * @class UiStateService
 * @injectable
 * @providedIn 'root'
 *
 * @description
 * Este servicio proporciona:
 * - Estado del menú de navegación (abierto/cerrado)
 * - Detección de pantalla móvil reactiva
 * - Métodos para alternar y controlar el menú
 *
 * @example
 * ```typescript
 * constructor(private uiState: UiStateService) {}
 *
 * toggleMenu() {
 *   this.uiState.toggleMenu();
 * }
 *
 * checkIfMobile() {
 *   if (this.uiState.isMobile()) {
 *     console.log('Estamos en móvil');
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  /** Platform ID para verificar si estamos en el navegador */
  private platformId = inject(PLATFORM_ID);

  /** Señal reactiva que indica si el menú de navegación está abierto */
  public menuOpen = signal(false);

  /** Señal reactiva que indica si estamos en una pantalla móvil (< 768px) */
  public isMobile = signal(false);

  constructor() {
    // Solo ejecutar en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Inicializar el estado móvil
      this.checkMobileScreen();

      // Escuchar cambios en el tamaño de la ventana
      window.addEventListener('resize', () => this.checkMobileScreen());
    }
  }

  /**
   * Alterna el estado del menú de navegación.
   * Si está abierto lo cierra, si está cerrado lo abre.
   *
   * @example
   * ```typescript
   * this.uiState.toggleMenu();
   * ```
   */
  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  /**
   * Abre el menú de navegación.
   *
   * @example
   * ```typescript
   * this.uiState.openMenu();
   * ```
   */
  openMenu(): void {
    this.menuOpen.set(true);
  }

  /**
   * Cierra el menú de navegación.
   * Útil para cerrar el menú automáticamente después de una navegación.
   *
   * @example
   * ```typescript
   * this.uiState.closeMenu();
   * ```
   */
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /**
   * Verifica si la pantalla actual es de tipo móvil.
   * Actualiza la señal isMobile basándose en el ancho de la ventana.
   * Se considera móvil si el ancho es menor a 768px.
   *
   * @private
   */
  private checkMobileScreen(): void {
    const width = window.innerWidth;
    this.isMobile.set(width < 768);
  }
}

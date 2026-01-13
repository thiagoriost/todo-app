# 📱 Guía de Progressive Web App (PWA)

## Características Implementadas

### ✅ Service Worker
- **Caché offline**: La aplicación funciona sin conexión a internet
- **Actualizaciones automáticas**: El service worker se actualiza cuando hay cambios
- **Estrategia de caché**: 
  - Assets de la app: precarga (prefetch)
  - Recursos estáticos: carga bajo demanda (lazy)
  - API Tasks: estrategia de frescura (freshness)
  - API Categories: estrategia de rendimiento (performance)

### 📱 Mobile First Design
- **Diseño responsive**: Optimizado primero para móviles
- **Breakpoints**:
  - Mobile: < 480px
  - Tablet: 480px - 1024px
  - Desktop: > 1024px
- **Touch-friendly**: Todos los elementos táctiles tienen mínimo 44px
- **Gestos táctiles**: Feedback visual en interacciones

### 🎨 Optimizaciones Móviles
- **Viewport optimizado**: Configuración para evitar zoom indeseado
- **Prevención de zoom en inputs**: Los inputs tienen font-size mínimo de 16px (iOS)
- **Meta tags PWA**: Configuración completa para Android e iOS
- **Theme color**: Barra de navegación del navegador personalizada
- **Splash screen**: Configurado mediante manifest

### 📦 Instalación como App
La aplicación puede instalarse en dispositivos móviles y desktop como una app nativa.

#### En Android:
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar app" o "Agregar a pantalla de inicio"

#### En iOS:
1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"

#### En Desktop (Chrome/Edge):
1. Busca el ícono de instalación (+) en la barra de direcciones
2. Haz clic en "Instalar"

### 🚀 Comandos de Desarrollo

#### Desarrollo sin Service Worker
```bash
npm start
# o
ng serve
```

#### Build de producción con PWA
```bash
npm run build
# o
ng build
```

#### Probar PWA localmente
```bash
# Instalar http-server si no lo tienes
npm install -g http-server

# Build de producción
ng build

# Servir desde el build
cd dist/todo-app/browser
http-server -p 8080 -c-1
```

Luego abre: http://localhost:8080

### 📊 Verificar PWA

#### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Verifica:
   - **Manifest**: Debe mostrar todos los íconos y configuración
   - **Service Workers**: Debe estar registrado y activo
   - **Storage**: Revisa el caché

#### Lighthouse
1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Haz clic en "Generate report"
5. Objetivo: Score > 90

### 🔄 Actualización de la App

El Service Worker se actualiza automáticamente cuando:
1. El usuario visita la app después de 30 segundos de estabilidad
2. Hay cambios en los archivos de la aplicación
3. El manifest o service worker cambian

### 🛠️ Configuración

#### ngsw-config.json
Configura el comportamiento del Service Worker:
- **assetGroups**: Define qué recursos cachear y cómo
- **dataGroups**: Configura el caché de APIs

#### manifest.webmanifest
Define metadatos de la PWA:
- Nombre de la app
- Íconos
- Tema de color
- Orientación preferida
- Shortcuts de la app

### 📏 Variables CSS (Mobile-First)

```scss
:root {
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### 🎯 Mejores Prácticas Implementadas

1. **Tamaños táctiles mínimos**: 44x44px (Apple HIG)
2. **Contraste de texto**: WCAG AA compliance
3. **Gestos nativos**: Swipe, tap, long-press
4. **Performance**:
   - Lazy loading de assets
   - Optimización de imágenes
   - Code splitting automático
5. **Accesibilidad**:
   - ARIA labels
   - Soporte para lectores de pantalla
   - Modo de movimiento reducido

### 🐛 Troubleshooting

#### El Service Worker no se registra
- Verifica que estés en modo producción
- HTTPS es requerido (excepto localhost)
- Limpia el caché del navegador

#### La app no se instala
- Verifica que todos los íconos estén presentes
- Revisa el manifest.webmanifest
- Usa Lighthouse para encontrar problemas

#### Caché desactualizado
```javascript
// En Chrome DevTools > Application > Service Workers
// Haz clic en "Unregister" y recarga
```

### 📱 Compatibilidad

- **Android**: Chrome 57+, Firefox 58+
- **iOS**: Safari 11.3+ (soporte parcial)
- **Desktop**: Chrome 40+, Edge 79+, Firefox 44+

### 🔐 Seguridad

- HTTPS requerido en producción
- Content Security Policy configurado
- Sanitización de entradas
- Validación en frontend y backend

---

**Nota**: Esta aplicación está optimizada para uso móvil con enfoque "Mobile First". Todas las características están diseñadas para funcionar primero en dispositivos móviles y escalar a pantallas más grandes.

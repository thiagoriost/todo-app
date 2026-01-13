# 📱 Guía para Probar la App en tu Móvil

## 🌐 Tu IP Local
**IP de tu computadora:** `192.168.1.3`

## 🚀 Pasos para Acceder desde tu Móvil

### 1️⃣ Inicia el servidor para red local
```bash
npm run start:mobile
```

### 2️⃣ Espera a que el servidor inicie
Verás un mensaje como:
```
✔ Browser application bundle generation complete.
Local:   http://localhost:4200/
Network: http://192.168.1.3:4200/
```

### 3️⃣ Desde tu móvil
Asegúrate de que tu móvil esté conectado a la **misma red WiFi** que tu computadora.

Abre el navegador en tu móvil y accede a:
```
http://192.168.1.3:4200
```

## 📱 URLs de Acceso

| Dispositivo | URL |
|-------------|-----|
| **Computadora** | http://localhost:4200 |
| **Móvil/Tablet** | http://192.168.1.3:4200 |
| **Otros dispositivos en la red** | http://192.168.1.3:4200 |

## 🔥 Configuración del Firewall (Si no puedes acceder)

Si tu móvil no puede conectarse, es posible que el firewall de Windows esté bloqueando el puerto:

### Opción 1: Permitir temporalmente (Recomendado)
1. Abre **Windows Defender Firewall**
2. Click en **"Permitir una aplicación a través del firewall"**
3. Click en **"Cambiar configuración"**
4. Click en **"Permitir otra aplicación"**
5. Busca **"Node.js"** o el proceso de Angular
6. Marca las casillas **"Privada"** y **"Pública"**
7. Click **"Aceptar"**

### Opción 2: Crear regla de puerto (PowerShell como Admin)
```powershell
New-NetFirewallRule -DisplayName "Angular Dev Server" -Direction Inbound -Protocol TCP -LocalPort 4200 -Action Allow
```

### Opción 3: Deshabilitar temporalmente (NO recomendado)
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```
⚠️ Recuerda volver a activarlo después:
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

## 🧪 Probar Funcionalidades PWA

### Instalar la App en tu Móvil

#### Android (Chrome)
1. Abre la app en Chrome
2. Toca el menú ⋮ (tres puntos)
3. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar app"**
4. Confirma la instalación
5. ¡La app aparecerá como una aplicación nativa!

#### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón **Compartir** 📤 (parte inferior)
3. Desplázate y selecciona **"Agregar a pantalla de inicio"**
4. Personaliza el nombre si deseas
5. Toca **"Agregar"**

### Probar Modo Offline
1. Abre la app en tu móvil
2. Navega por las diferentes secciones
3. Activa **modo avión** en tu móvil
4. Recarga la app o intenta navegar
5. ✅ La app debería seguir funcionando gracias al Service Worker

## 🎨 Probar Diseño Responsive

### Tamaños a verificar:
- **Móvil pequeño**: < 480px (Ejemplo: iPhone SE)
- **Móvil grande**: 480-768px (Ejemplo: iPhone 14 Pro)
- **Tablet**: 768-1024px (Ejemplo: iPad)
- **Desktop**: > 1024px (Computadora)

### Características a probar:
- ✅ Menú hamburguesa aparece en móvil
- ✅ Menú se oculta al navegar
- ✅ Botones tienen tamaño mínimo táctil (44x44px)
- ✅ Texto legible sin zoom
- ✅ Formularios adaptables
- ✅ Navegación fluida

## 🔧 Solución de Problemas

### ❌ Error: "No se puede acceder a este sitio"
**Causa:** Tu móvil no está en la misma red WiFi
**Solución:** Verifica que ambos dispositivos estén en la misma red

### ❌ Error: "Conexión rechazada"
**Causa:** Firewall bloqueando el puerto 4200
**Solución:** Sigue los pasos de configuración del firewall arriba

### ❌ La IP cambió
**Solución:** Vuelve a obtener tu IP con:
```bash
ipconfig | Select-String -Pattern "IPv4"
```

### ❌ Cambios no se reflejan en el móvil
**Solución:** 
1. Fuerza la recarga: **Ctrl + Shift + R** (Android Chrome)
2. Limpia caché del navegador
3. Desinstala la PWA y vuelve a instalarla

## 📊 Herramientas de Desarrollo Remoto

### Chrome DevTools Remotos (Android)
1. En tu computadora, abre Chrome
2. Ve a `chrome://inspect`
3. Conecta tu móvil Android por USB
4. Activa **"Depuración USB"** en el móvil
5. Acepta la conexión
6. Click en **"Inspect"** junto a tu página
7. ¡Ahora puedes ver la consola y red del móvil!

### Safari Web Inspector (iOS)
1. En el iPhone: **Ajustes → Safari → Avanzado → Inspector Web** (activar)
2. Conecta el iPhone a la Mac
3. En Safari (Mac): **Desarrollar → [Tu iPhone] → localhost**

## 🎯 Checklist de Pruebas

- [ ] App carga correctamente
- [ ] Menú hamburguesa funciona
- [ ] Navegación entre páginas
- [ ] Formularios responsivos
- [ ] Botones táctiles (mínimo 44x44px)
- [ ] Texto legible sin zoom
- [ ] PWA instalable
- [ ] Funciona offline
- [ ] Iconos correctos
- [ ] Colores y diseño consistente

## 💡 Tips Profesionales

1. **Usa ngrok** para acceso desde internet:
   ```bash
   npm install -g ngrok
   ngrok http 4200
   ```
   Te dará una URL pública temporal

2. **Simula throttling** en Chrome DevTools:
   - Red lenta (3G, 4G)
   - CPU lenta
   - Prueba condiciones reales

3. **Lighthouse en móvil**:
   - Chrome DevTools → Lighthouse
   - Dispositivo: Mobile
   - Categorías: Performance, PWA, Accessibility

## 🔒 Seguridad

⚠️ **Importante:**
- Estos comandos son solo para **desarrollo local**
- NO uses `--disable-host-check` en producción
- El servidor solo es accesible en tu red local
- Cierra el servidor cuando termines de probar

---

**¿Listo para probar?** Ejecuta:
```bash
npm run start:mobile
```

Y accede desde tu móvil a: **http://192.168.1.3:4200**

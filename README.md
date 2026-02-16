# Copy Hover - Extensión de Chrome

Extensión de Chrome que te permite copiar texto de cualquier elemento web simplemente pasando el mouse sobre él mientras mantienes presionada la tecla **Alt**, con feedback visual instantáneo.

## 🚀 Características

- **Copia rápida con hover**: Copia texto sin necesidad de seleccionar manualmente
- **Activación con tecla modificadora**: Usa **Alt + Hover** para resaltar y **Alt + Clic** para copiar
- **Feedback visual inmediato**: 
  - Resaltado del elemento al pasar el mouse
  - Animación de confirmación al copiar
  - Notificación toast con el estado de la operación
- **Interfaz moderna**: Diseño limpio y profesional con modo oscuro
- **Control simple**: Activa/desactiva la extensión con un solo clic
- **Sin interferencias**: Solo funciona cuando la extensión está activada

## 📦 Instalación

1. Descarga o clona este repositorio
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta que contiene los archivos de la extensión
6. **IMPORTANTE**: Asegúrate de que la carpeta `images` contenga el archivo `icon512.png`

## 🎯 Uso

### Activación

1. Haz clic en el ícono de la extensión en la barra de herramientas de Chrome
2. Activa la extensión con el switch de activación
3. El badge mostrará "ON" cuando esté activa

### Copiar Texto

1. En cualquier página web, mantén presionada la tecla **Alt**
2. Pasa el mouse sobre el elemento que contiene el texto que deseas copiar
3. Verás un resaltado visual del elemento
4. Haz **clic** (mientras mantienes Alt) para copiar el texto al portapapeles
5. Aparecerá una notificación confirmando que el texto fue copiado

### Ejemplo de Uso

```
1. Activa la extensión desde el popup
2. Navega a cualquier página web
3. Mantén Alt + pasa el mouse sobre un párrafo → Se resalta
4. Mantén Alt + haz clic → ¡Texto copiado!
```

## 🛠️ Estructura de Archivos

```
copy-hover/
├── manifest.json          # Configuración de la extensión (Manifest V3)
├── background.js          # Service worker para gestión de estado
├── content.js             # Script principal de contenido
├── popup.html             # Interfaz del popup
├── popup.js               # Lógica del popup
├── popup.css              # Estilos del popup
├── styles.css             # Estilos para elementos resaltados y notificaciones
├── images/
│   └── icon512.png        # Ícono de la extensión
└── README.md              # Este archivo
```

## ⚙️ Funcionamiento Técnico

### Eventos y Comportamiento

- **`mouseover` + Alt**: Resalta el elemento bajo el cursor
- **`mouseout`**: Elimina el resaltado cuando el mouse sale del elemento
- **`click` + Alt**: Copia el `innerText` del elemento al portapapeles

### Clases CSS Aplicadas

- `.copy-hover-highlight`: Aplicada al elemento cuando se pasa el mouse con Alt
- `.copy-hover-copied`: Animación temporal al copiar exitosamente
- `#copy-hover-toast`: Notificación flotante con feedback

### Almacenamiento

La extensión usa `chrome.storage.sync` para:
- Persistir el estado de activación entre sesiones
- Sincronizar la configuración entre dispositivos con la misma cuenta de Chrome

## 🐛 Solución de Problemas

**La extensión no funciona:**
- Asegúrate de que esté activada en el popup (badge debe mostrar "ON")
- Recarga la página web después de activarla
- Verifica que estés manteniendo presionada la tecla **Alt**

**No puedo ver el ícono:**
- Asegúrate de tener un archivo `icon512.png` en la carpeta `images/`
- Recarga la extensión desde `chrome://extensions/`

**El texto no se copia:**
- Verifica los permisos del portapapeles en Chrome
- Algunas páginas pueden bloquear el acceso al portapapeles por políticas de seguridad
- Asegúrate de hacer clic mientras mantienes presionada la tecla Alt

**El resaltado no aparece:**
- Verifica que el elemento tenga texto visible (`innerText` no vacío)
- Algunos elementos pueden tener estilos que ocultan el outline

## 📝 Notas Técnicas

- Utiliza **Manifest V3** (última versión de Chrome Extensions)
- Compatible con Chrome 88+
- Usa `chrome.storage.sync` para persistir configuraciones
- Usa la API moderna `navigator.clipboard.writeText()` para copiar texto
- Previene la propagación de eventos para evitar interferencias con la página

## 🔒 Permisos

La extensión requiere los siguientes permisos:

- **`storage`**: Para guardar el estado de activación
- **`activeTab`**: Para interactuar con la pestaña activa
- **`scripting`**: Para inyectar scripts de contenido

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue primero para discutir los cambios
2. Haz fork del proyecto
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Realiza tus cambios y haz commit (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para facilitar la copia de texto en la web.

---

**¿Te gusta este proyecto?** Dale una ⭐ en GitHub

// Función para inicializar el estado de la extensión (badge)
function initializeExtension() {
    chrome.storage.sync.get(["isEnabled"], (data) => {
        updateBadge(data.isEnabled || false);
    });
}

// Función para actualizar el badge
function updateBadge(isEnabled) {
    chrome.action.setBadgeText({ text: isEnabled ? "✓" : "✕" });
    chrome.action.setBadgeBackgroundColor({
        color: isEnabled ? "#00E676" : "#FF5252"
    });
}

// Evento que se ejecuta cuando la extensión se instala o actualiza por primera vez
chrome.runtime.onInstalled.addListener(() => {
    // Inicializa el estado de la extensión y las opciones por defecto
    chrome.storage.sync.set({
        isEnabled: false,
        modifierKey: 'alt'
    });

    // Inicializar badge como OFF
    updateBadge(false);
});

// Asegura que el badge se actualice al iniciar el navegador
chrome.runtime.onStartup.addListener(initializeExtension);

// Escucha mensajes de otras partes de la extensión (popup o script de contenido)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Verifica si el mensaje está solicitando el estado actual
    if (request.action === "getStatus") {
        // Recupera el estado del almacenamiento sincronizado
        chrome.storage.sync.get(["isEnabled", "modifierKey"], (data) => {
            // Envía la respuesta con el estado
            sendResponse({
                isEnabled: data.isEnabled,
                modifierKey: data.modifierKey || 'alt'
            });
        });
        // Retorna true para indicar que enviaremos una respuesta de forma asíncrona
        return true;
    }

    // Verifica si el mensaje está solicitando la actualización del badge
    if (request.action === "badgeUpdate") {
        updateBadge(request.isEnabled);
    }
});

// Inicialización inmediata al cargar el service worker
initializeExtension();
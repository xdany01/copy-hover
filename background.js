// Evento que se ejecuta cuando la extensión se instala o actualiza por primera vez
chrome.runtime.onInstalled.addListener(() => {
    // Inicializa el estado de la extensión como "desactivado" (false) en el almacenamiento sincronizado
    chrome.storage.sync.set({ isEnabled: false });
});

// Escucha mensajes de otras partes de la extensión (popup o script de contenido)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Verifica si el mensaje está solicitando el estado actual
    if (request.action === "getStatus") {
        // Recupera el estado "isEnabled" del almacenamiento sincronizado
        chrome.storage.sync.get("isEnabled", (data) => {
            // Envía la respuesta con el estado
            sendResponse({ isEnabled: data.isEnabled });
        });
        // Retorna true para indicar que enviaremos una respuesta de forma asíncrona
        return true;
    }
});

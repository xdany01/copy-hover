// Cargar las opciones guardadas cuando se abre el popup
document.addEventListener('DOMContentLoaded', restoreOptions);
// Guardar las opciones cuando el usuario cambia el interruptor
document.getElementById('toggleExtension').addEventListener('change', saveOptions);

// Función para guardar el estado de la extensión
function saveOptions() {
    const isEnabled = document.getElementById('toggleExtension').checked;

    // Guardar en chrome.storage.sync para persistencia entre sesiones
    chrome.storage.sync.set({ isEnabled: isEnabled }, () => {
        updateStatusUI(isEnabled);

        // Enviar mensaje al script de contenido (content.js) para actualizar el estado en la página actual
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "toggleState",
                    isEnabled: isEnabled
                });
            }
        });
    });
}

// Restaurar el estado guardado al abrir el popup
function restoreOptions() {
    // Por defecto está desactivado (false) si no hay nada guardado
    chrome.storage.sync.get({ isEnabled: false }, (items) => {
        document.getElementById('toggleExtension').checked = items.isEnabled;
        updateStatusUI(items.isEnabled);
    });
}

// Actualizar la interfaz de usuario (el texto "ON/OFF" y el color)
function updateStatusUI(isEnabled) {
    const badge = document.getElementById('statusBadge');

    if (isEnabled) {
        badge.textContent = 'ON';
        badge.classList.add('active');
    } else {
        badge.textContent = 'OFF';
        badge.classList.remove('active');
    }
}

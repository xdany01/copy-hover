// Cargar las opciones guardadas cuando se abre el popup
document.addEventListener('DOMContentLoaded', restoreOptions);
// Guardar las opciones cuando el usuario cambia el interruptor
document.getElementById('toggleExtension').addEventListener('change', saveOptions);
// Guardar la tecla modificadora cuando cambia
document.getElementById('modifierKey').addEventListener('change', saveModifierKey);

// Función para guardar el estado de la extensión
function saveOptions() {
    const isEnabled = document.getElementById('toggleExtension').checked;

    // Guardar en chrome.storage.sync para persistencia entre sesiones
    chrome.storage.sync.set({ isEnabled: isEnabled }, () => {
        updateStatusUI(isEnabled);

        // Enviar mensaje al background para actualizar el badge
        chrome.runtime.sendMessage({ action: "badgeUpdate", isEnabled: isEnabled });

        // Enviar mensaje al script de contenido para actualizar el estado en la página actual
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

// Función para guardar la tecla modificadora
function saveModifierKey() {
    const modifier = document.getElementById('modifierKey').value;

    chrome.storage.sync.set({ modifierKey: modifier }, () => {
        updateModifierLabel(modifier);
        // Enviar mensaje al script de contenido con la nueva tecla
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "updateModifierKey",
                    modifierKey: modifier
                });
            }
        });
    });
}

// Actualiza la etiqueta de la instrucción según la tecla seleccionada
function updateModifierLabel(modifier) {
    const instructionText = document.getElementById('instructionText');
    const keyLabels = { alt: 'Alt', ctrl: 'Ctrl', shift: 'Shift', none: null };
    const keyName = keyLabels[modifier];

    if (keyName) {
        instructionText.innerHTML = `Mantén <span class="key" id="modifierKeyLabel">${keyName}</span> + <span class="mouse">Clic</span> para copiar.`;
    } else {
        instructionText.innerHTML = `Haz <span class="mouse">Clic</span> para copiar.`;
    }
}

// Restaurar el estado guardado al abrir el popup
function restoreOptions() {
    chrome.storage.sync.get({ isEnabled: false, modifierKey: 'alt' }, (items) => {
        document.getElementById('toggleExtension').checked = items.isEnabled;
        document.getElementById('modifierKey').value = items.modifierKey;
        updateModifierLabel(items.modifierKey);
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

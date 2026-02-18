// Variable para controlar si la extensión está habilitada o no
let isExtensionEnabled = false;
// Almacena el último elemento que fue resaltado para poder limpiarlo después
let lastHighlightedElement = null;
// Tecla modificadora activa ('alt', 'ctrl', 'shift', 'none')
let activeModifierKey = 'alt';

// Cargar el estado inicial de la extensión desde el almacenamiento de Chrome
chrome.storage.sync.get(["isEnabled", "modifierKey"], (data) => {
    isExtensionEnabled = data.isEnabled || false;
    activeModifierKey = data.modifierKey || 'alt';
});

// Escuchar cambios en la configuración (si el usuario activa/desactiva desde el popup)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.isEnabled) {
        isExtensionEnabled = changes.isEnabled.newValue;
        if (!isExtensionEnabled) {
            removeHighlight();
        }
    }
    if (changes.modifierKey) {
        activeModifierKey = changes.modifierKey.newValue;
        removeHighlight();
    }
});

// Escuchar mensajes desde otras partes de la extensión (como el popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleState") {
        isExtensionEnabled = request.isEnabled;
        if (!isExtensionEnabled) {
            removeHighlight();
        }
    }
    if (request.action === "updateModifierKey") {
        activeModifierKey = request.modifierKey;
        removeHighlight();
    }
});

// Función que comprueba si la tecla modificadora está presionada según la configuración
function isModifierActive(event) {
    switch (activeModifierKey) {
        case 'alt':   return event.altKey;
        case 'ctrl':  return event.ctrlKey;
        case 'shift': return event.shiftKey;
        case 'none':  return true;
        default:      return event.altKey;
    }
}

// Evento cuando el mouse se mueve sobre un elemento: Resalta el texto si la extensión está activa
document.addEventListener('mouseover', (event) => {
    if (!isExtensionEnabled) return;
    if (event.target.id === 'copy-hover-toast') return;

    if (isModifierActive(event)) {
        let target = event.target;

        // Filtro simple: debe tener texto visible no vacío
        if (target.innerText && target.innerText.trim().length > 0) {
            if (lastHighlightedElement && lastHighlightedElement !== target) {
                removeHighlight();
            }

            target.classList.add('copy-hover-highlight');
            lastHighlightedElement = target;
        }
    }
});

// Evento cuando el mouse sale de un elemento: Quita el resaltado
document.addEventListener('mouseout', (event) => {
    if (!isExtensionEnabled) return;
    if (event.target === lastHighlightedElement) {
        removeHighlight();
    }
});

// Evento de clic: Si se presiona Clic cuando la extension esta activa,
// copia el texto al portapapeles
document.addEventListener('click', (event) => {
    if (!isExtensionEnabled) return;

    if (isModifierActive(event)) {
        event.preventDefault();
        event.stopPropagation();

        const target = event.target;
        const textToCopy = target.innerText;

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast("¡Copiado al portapapeles!", "success");

                target.classList.add('copy-hover-copied');
                setTimeout(() => {
                    target.classList.remove('copy-hover-copied');
                }, 400);
            }).catch(err => {
                console.error('Error al copiar: ', err);
                showToast("No se pudo copiar el texto", "error");
            });
        }
    }
}, true);

// Función auxiliar para eliminar el estilo de resaltado del último elemento
function removeHighlight() {
    if (lastHighlightedElement) {
        lastHighlightedElement.classList.remove('copy-hover-highlight');
        lastHighlightedElement = null;
    }
}

// Función para mostrar una notificación flotante (toast) con feedback al usuario
function showToast(message, type = "normal") {
    let toast = document.getElementById('copy-hover-toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-hover-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    // Reiniciar clases
    toast.className = '';
    if (type === 'success') toast.classList.add('success');
    if (type === 'error') toast.classList.add('error');

    // Forzar reflow para reiniciar animación si ya estaba visible
    void toast.offsetWidth;

    toast.classList.add('show');

    // Ocultar después de 2.5 segundos
    if (toast.timeoutId) clearTimeout(toast.timeoutId);

    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

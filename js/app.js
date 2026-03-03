/**
 * app.js - Inicialización de Scrach_IA y gestión de estado global
 */

// Estado global de la aplicación
const AppState = {
  mode: 'games',
  difficulty: 'easy',
  isRunning: false,
  projectName: 'Mi Proyecto',
  autoSave: true
};

// Referencias globales
let editor = null;
let aiEngine = null;
let modeManager = null;
let executor = null;

/**
 * Inicialización principal
 */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Inicializa componentes principales
  const workspace = document.getElementById('workspace-container');
  const blocksPanel = document.getElementById('blocks-palette');

  editor = new BlockEditor(workspace, blocksPanel);
  window.editor = editor; // Exponer globalmente para eventos inline

  aiEngine = new AIEngine();
  modeManager = new ModeManager();

  const canvas = document.getElementById('preview-canvas');
  executor = new BlockExecutor(canvas);

  // Configura listeners de eventos
  setupEventListeners();

  // Inicializa el modo por defecto
  modeManager.setMode('games');
  modeManager.setDifficulty('easy');

  // Configura listeners del manager de modos
  modeManager.on('modeChange', ({ mode }) => {
    editor.renderBlocksPalette(mode.id, AppState.difficulty);
    AppState.mode = mode.id;
    executor.reset();
  });

  modeManager.on('difficultyChange', ({ difficulty }) => {
    editor.renderBlocksPalette(AppState.mode, difficulty.id);
    AppState.difficulty = difficulty.id;
  });

  // Cargar proyecto guardado si existe
  loadSavedProject();

  // Mostrar pantalla de bienvenida
  showWelcomeMessage();

  console.log('✅ Scrach_IA inicializado correctamente');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
  // Botones de modo
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modeManager.setMode(btn.dataset.mode);
    });
  });

  // Botones de dificultad
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modeManager.setDifficulty(btn.dataset.difficulty);
    });
  });

  // Botón ejecutar
  const runBtn = document.getElementById('run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', handleRunButton);
  }

  // Botón detener
  const stopBtn = document.getElementById('stop-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      executor.stop();
      document.getElementById('run-btn').textContent = '▶ Ejecutar';
      document.getElementById('run-btn').classList.remove('running');
      AppState.isRunning = false;
    });
  }

  // Botón reset
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      executor.reset();
      editor.clearWorkspace();
    });
  }

  // Botón limpiar workspace
  const clearBtn = document.getElementById('clear-workspace-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Limpiar el workspace? Se perderán todos los bloques.')) {
        editor.clearWorkspace();
        executor.reset();
      }
    });
  }

  // Panel de IA
  const aiInput = document.getElementById('ai-prompt-input');
  const aiSendBtn = document.getElementById('ai-send-btn');

  if (aiSendBtn) {
    aiSendBtn.addEventListener('click', handleAIPrompt);
  }

  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAIPrompt();
      }
    });
  }

  // Sugerencias de IA
  document.querySelectorAll('.ai-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('ai-prompt-input');
      if (input) {
        input.value = btn.textContent.trim();
        handleAIPrompt();
      }
    });
  });

  // Botón guardar
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProject);
  }

  // Botón cargar
  const loadBtn = document.getElementById('load-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', loadProject);
  }

  // Botón zoom reset
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => editor.resetZoom());
  }

  // Proyecto de ejemplo
  const exampleBtn = document.getElementById('example-project-btn');
  if (exampleBtn) {
    exampleBtn.addEventListener('click', loadExampleProject);
  }

  // Nombre del proyecto
  const projectNameInput = document.getElementById('project-name');
  if (projectNameInput) {
    projectNameInput.addEventListener('change', (e) => {
      AppState.projectName = e.target.value;
    });
  }

  // Resize de canvas
  window.addEventListener('resize', debounce(() => {
    resizeCanvas();
  }, 200));

  // Atajos de teclado
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Tabs del panel derecho
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.dataset.panel;
      document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${targetPanel}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/**
 * Maneja el botón de ejecución
 */
async function handleRunButton() {
  const runBtn = document.getElementById('run-btn');

  if (AppState.isRunning) {
    executor.stop();
    runBtn.innerHTML = '▶ Ejecutar';
    runBtn.classList.remove('running');
    AppState.isRunning = false;
    return;
  }

  const sequences = editor.getBlockSequence();
  if (sequences.length === 0) {
    showNotification('⚠️ No hay bloques en el workspace. Arrastra algunos bloques primero.', 'warning');
    return;
  }

  runBtn.innerHTML = '⏹ Detener';
  runBtn.classList.add('running');
  AppState.isRunning = true;

  executor.reset();
  await executor.execute(sequences);

  runBtn.innerHTML = '▶ Ejecutar';
  runBtn.classList.remove('running');
  AppState.isRunning = false;
}

/**
 * Maneja el input del prompt de IA
 */
async function handleAIPrompt() {
  const input = document.getElementById('ai-prompt-input');
  const sendBtn = document.getElementById('ai-send-btn');
  if (!input || !input.value.trim()) return;

  const prompt = input.value.trim();
  input.value = '';

  // Deshabilitar input durante procesamiento
  input.disabled = true;
  sendBtn.disabled = true;
  sendBtn.textContent = '⏳';

  // Mostrar mensaje del usuario en el chat
  addChatMessage(prompt, 'user');

  // Mostrar indicador de "pensando"
  const thinkingId = addThinkingIndicator();

  try {
    const result = await aiEngine.processPrompt(prompt);
    removeThinkingIndicator(thinkingId);
    addChatMessage(result.message, 'assistant');

    if (result.blocks && result.blocks.length > 0) {
      editor.addBlocksFromAI(result.blocks);
      showNotification(`✨ ${result.blocks.length} bloques añadidos al workspace`, 'success');
    }
  } catch (e) {
    removeThinkingIndicator(thinkingId);
    addChatMessage('❌ Hubo un error al procesar tu solicitud. Inténtalo de nuevo.', 'assistant');
  }

  input.disabled = false;
  sendBtn.disabled = false;
  sendBtn.textContent = '→';
  input.focus();
}

/**
 * Añade un mensaje al chat de IA
 */
function addChatMessage(message, role) {
  const chatContainer = document.getElementById('ai-chat-messages');
  if (!chatContainer) return;

  const msgEl = document.createElement('div');
  msgEl.className = `chat-message chat-${role}`;

  // Procesar markdown básico
  const formattedMsg = message
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  msgEl.innerHTML = `
    <div class="chat-bubble">${formattedMsg}</div>
  `;

  chatContainer.appendChild(msgEl);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addThinkingIndicator() {
  const chatContainer = document.getElementById('ai-chat-messages');
  if (!chatContainer) return null;

  const id = `thinking-${Date.now()}`;
  const el = document.createElement('div');
  el.id = id;
  el.className = 'chat-message chat-assistant';
  el.innerHTML = `
    <div class="chat-bubble thinking">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    </div>
  `;
  chatContainer.appendChild(el);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return id;
}

function removeThinkingIndicator(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Guarda el proyecto en localStorage
 */
function saveProject() {
  try {
    const projectData = {
      name: AppState.projectName,
      mode: AppState.mode,
      difficulty: AppState.difficulty,
      workspace: editor.serialize(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('scratchia_project', JSON.stringify(projectData));
    showNotification('💾 Proyecto guardado correctamente', 'success');
  } catch (e) {
    showNotification('❌ Error al guardar el proyecto', 'error');
  }
}

/**
 * Carga el proyecto desde localStorage
 */
function loadProject() {
  try {
    const saved = localStorage.getItem('scratchia_project');
    if (!saved) {
      showNotification('📂 No hay proyecto guardado', 'info');
      return;
    }
    const data = JSON.parse(saved);
    editor.deserialize(data.workspace);
    AppState.projectName = data.name || 'Mi Proyecto';
    const nameInput = document.getElementById('project-name');
    if (nameInput) nameInput.value = AppState.projectName;
    showNotification('📂 Proyecto cargado correctamente', 'success');
  } catch (e) {
    showNotification('❌ Error al cargar el proyecto', 'error');
  }
}

function loadSavedProject() {
  if (AppState.autoSave) {
    try {
      const saved = localStorage.getItem('scratchia_project');
      if (saved) {
        const data = JSON.parse(saved);
        // Solo auto-cargar si es reciente (menos de 1 hora)
        const age = Date.now() - new Date(data.timestamp).getTime();
        if (age < 3600000) {
          editor.deserialize(data.workspace);
          AppState.projectName = data.name || 'Mi Proyecto';
          const nameInput = document.getElementById('project-name');
          if (nameInput) nameInput.value = AppState.projectName;
        }
      }
    } catch (e) {
      // Ignorar errores de auto-carga
    }
  }
}

/**
 * Carga un proyecto de ejemplo para el modo actual
 */
function loadExampleProject() {
  const exampleBlocks = modeManager.generateExampleProject();
  editor.clearWorkspace();
  editor.addBlocksFromAI(exampleBlocks);
  showNotification(`🎯 Proyecto de ejemplo cargado para modo ${modeManager.getCurrentMode().name}`, 'success');
}

/**
 * Muestra notificaciones
 */
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  requestAnimationFrame(() => notif.classList.add('show'));

  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

/**
 * Muestra un mensaje de bienvenida en el chat
 */
function showWelcomeMessage() {
  setTimeout(() => {
    const suggestions = aiEngine.getExamplePrompts().slice(0, 3);
    addChatMessage(
      `¡Bienvenido a **Scrach_IA**! 🤖✨\n\nSoy tu asistente de programación visual con IA. Puedes pedirme que:\n• Genere bloques de código\n• Cree proyectos completos\n• Explique cómo usar los bloques\n\nPrueba con:\n${suggestions.map(s => `• ${s}`).join('\n')}`,
      'assistant'
    );
  }, 500);
}

/**
 * Maneja atajos de teclado
 */
function handleKeyboardShortcuts(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveProject();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    // TODO: Implementar undo
  }
  if (e.key === 'F5') {
    e.preventDefault();
    handleRunButton();
  }
  if (e.key === 'Delete' && editor.selectedBlock) {
    editor.deleteBlock(editor.selectedBlock.id);
    editor.selectedBlock = null;
  }
}

/**
 * Redimensiona el canvas de preview
 */
function resizeCanvas() {
  const canvas = document.getElementById('preview-canvas');
  if (canvas && executor) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    executor.draw();
  }
}

/**
 * Función de debounce
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

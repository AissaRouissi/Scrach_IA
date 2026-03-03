/**
 * modes.js - Gestión de los 5 modos de uso de Scrach_IA
 */

const MODES = {
  games: {
    id: 'games',
    name: 'Juegos',
    icon: '🎮',
    description: 'Crear juegos interactivos: plataformas, puzzles, arcade',
    color: '#e74c3c',
    defaultBlocks: ['when_flag_clicked', 'forever', 'move_steps', 'if_on_edge_bounce', 'when_key_pressed', 'set_variable'],
    previewBg: '#1a0a0a',
    tips: [
      'Usa los bloques de Movimiento para controlar tu sprite',
      'Los bloques de Sensores detectan colisiones',
      'Variables para guardar la puntuación',
      'Eventos para responder a teclas del teclado'
    ]
  },
  art: {
    id: 'art',
    name: 'Arte',
    icon: '🎨',
    description: 'Crear arte generativo y animaciones visuales',
    color: '#9b59b6',
    defaultBlocks: ['when_flag_clicked', 'forever', 'set_effect', 'change_size', 'set_color', 'next_costume'],
    previewBg: '#0d0a1a',
    tips: [
      'Usa efectos visuales para arte generativo',
      'Combina movimiento con colores cambiantes',
      'El modo IA puede crear patrones únicos',
      'Experimenta con tamaños y rotaciones'
    ]
  },
  music: {
    id: 'music',
    name: 'Música',
    icon: '🎵',
    description: 'Crear composiciones y efectos de sonido',
    color: '#e91e8c',
    defaultBlocks: ['when_flag_clicked', 'set_instrument', 'play_note', 'set_volume', 'play_drum', 'forever'],
    previewBg: '#0a0a1a',
    tips: [
      'Combina notas para crear melodías',
      'Usa diferentes instrumentos',
      'Los bucles crean ritmos continuos',
      'Cambia el volumen para dinamismo'
    ]
  },
  stories: {
    id: 'stories',
    name: 'Historias',
    icon: '📖',
    description: 'Crear historias interactivas y animaciones narrativas',
    color: '#f39c12',
    defaultBlocks: ['when_flag_clicked', 'say_for_secs', 'think_for_secs', 'switch_costume', 'when_receive_message', 'ask_and_wait'],
    previewBg: '#0a0d1a',
    tips: [
      'Usa "decir" y "pensar" para diálogos',
      'Mensajes para coordinar personajes',
      'Disfraces para animar personajes',
      'Pregunta al usuario para hacerlo interactivo'
    ]
  },
  robot: {
    id: 'robot',
    name: 'Robot/IoT',
    icon: '🤖',
    description: 'Programar dispositivos y simulaciones de robótica',
    color: '#1abc9c',
    defaultBlocks: ['when_flag_clicked', 'move_steps', 'turn_right', 'if_then', 'touching_edge', 'set_variable'],
    previewBg: '#0a1a0a',
    tips: [
      'Simula el movimiento de robots',
      'Sensores para detectar obstáculos',
      'Variables para almacenar estados',
      'IA para toma de decisiones autónoma'
    ]
  }
};

const DIFFICULTY_LEVELS = {
  easy: {
    id: 'easy',
    name: 'Fácil',
    icon: '🟢',
    description: 'Bloques simplificados, interfaz limpia, tutoriales guiados',
    hiddenCategories: [],
    simplifiedUI: true,
    showTutorials: true,
    maxBlocks: 20
  },
  hard: {
    id: 'hard',
    name: 'Difícil',
    icon: '🔴',
    description: 'Todos los bloques disponibles, opciones avanzadas, modo código',
    hiddenCategories: [],
    simplifiedUI: false,
    showTutorials: false,
    maxBlocks: null
  }
};

class ModeManager {
  constructor() {
    this.currentMode = 'games';
    this.currentDifficulty = 'easy';
    this.callbacks = {};
  }

  /**
   * Cambia el modo de uso
   */
  setMode(modeId) {
    if (!MODES[modeId]) return;

    const previousMode = this.currentMode;
    this.currentMode = modeId;

    this.applyModeUI(modeId);
    this.trigger('modeChange', { mode: MODES[modeId], previous: previousMode });
  }

  /**
   * Cambia el nivel de dificultad
   */
  setDifficulty(difficultyId) {
    if (!DIFFICULTY_LEVELS[difficultyId]) return;

    this.currentDifficulty = difficultyId;
    this.applyDifficultyUI(difficultyId);
    this.trigger('difficultyChange', { difficulty: DIFFICULTY_LEVELS[difficultyId] });
  }

  /**
   * Aplica cambios de UI para el modo
   */
  applyModeUI(modeId) {
    const mode = MODES[modeId];

    // Actualiza botones de modo
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === modeId);
    });

    // Actualiza el área de preview
    const preview = document.getElementById('preview-area');
    if (preview) {
      preview.style.background = mode.previewBg;
    }

    // Actualiza las tips del modo
    const tipsContainer = document.getElementById('mode-tips');
    if (tipsContainer) {
      tipsContainer.innerHTML = mode.tips.map(tip =>
        `<li class="mode-tip">💡 ${tip}</li>`
      ).join('');
    }

    // Actualiza el indicador de modo
    const modeIndicator = document.getElementById('current-mode-indicator');
    if (modeIndicator) {
      modeIndicator.innerHTML = `${mode.icon} ${mode.name}`;
      modeIndicator.style.color = mode.color;
    }

    // Muestra notificación
    this.showModeNotification(mode);
  }

  /**
   * Aplica cambios de UI para la dificultad
   */
  applyDifficultyUI(difficultyId) {
    const difficulty = DIFFICULTY_LEVELS[difficultyId];
    const app = document.getElementById('app');

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === difficultyId);
    });

    if (app) {
      app.classList.toggle('easy-mode', difficultyId === 'easy');
      app.classList.toggle('hard-mode', difficultyId === 'hard');
    }

    // Muestra/oculta panel de código en modo difícil
    const codePanel = document.getElementById('code-panel');
    if (codePanel) {
      codePanel.style.display = difficultyId === 'hard' ? 'block' : 'none';
    }
  }

  showModeNotification(mode) {
    const notif = document.createElement('div');
    notif.className = 'mode-notification';
    notif.innerHTML = `${mode.icon} Modo <strong>${mode.name}</strong> activado`;
    notif.style.borderColor = mode.color;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 2500);
  }

  /**
   * Obtiene el modo actual
   */
  getCurrentMode() {
    return MODES[this.currentMode];
  }

  getCurrentDifficulty() {
    return DIFFICULTY_LEVELS[this.currentDifficulty];
  }

  /**
   * Registra callbacks de eventos
   */
  on(event, callback) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(callback);
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data));
    }
  }

  /**
   * Obtiene los bloques sugeridos para el modo actual
   */
  getDefaultBlocks() {
    return MODES[this.currentMode].defaultBlocks;
  }

  /**
   * Genera un proyecto de ejemplo para el modo actual
   */
  generateExampleProject() {
    const mode = MODES[this.currentMode];
    return mode.defaultBlocks.map(blockId => {
      const def = BLOCKS_DEFINITION.find(b => b.id === blockId);
      if (!def) return null;
      const params = {};
      if (def.params) def.params.forEach(p => { params[p.name] = p.default; });
      return { id: blockId, params };
    }).filter(Boolean);
  }
}

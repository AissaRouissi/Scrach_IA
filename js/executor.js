/**
 * executor.js - Ejecutor/intérprete de los bloques de Scrach_IA
 */

class BlockExecutor {
  constructor(previewCanvas) {
    this.canvas = previewCanvas;
    this.ctx = previewCanvas ? previewCanvas.getContext('2d') : null;
    this.isRunning = false;
    this.isPaused = false;
    this.sprites = [];
    this.variables = {};
    this.messages = {};
    this.timers = {};
    this.executionLog = [];
    this.stepDelay = 300;
    this.currentStep = 0;

    // Sprite principal de demo
    this.sprite = {
      x: 200,
      y: 150,
      direction: 90,
      size: 1,
      visible: true,
      costume: 0,
      color: '#4a90d9',
      effects: { ghost: 0, brightness: 0, color: 0 },
      speech: null,
      thought: null,
      speechTimer: null
    };

    if (this.canvas) {
      this.setupCanvas();
    }
  }

  setupCanvas() {
    this.canvas.width = this.canvas.offsetWidth || 320;
    this.canvas.height = this.canvas.offsetHeight || 240;
    this.drawInitialState();
  }

  /**
   * Ejecuta una secuencia de bloques
   */
  async execute(blockSequences) {
    if (this.isRunning) {
      this.stop();
      return;
    }

    this.isRunning = true;
    this.executionLog = [];
    this.logExecution('▶️ Iniciando ejecución...');

    try {
      // Ejecuta todas las secuencias que empiezan con eventos de inicio
      const startSequences = blockSequences.filter(seq =>
        seq.length > 0 && ['when_flag_clicked', 'when_start'].includes(seq[0].defId)
      );

      if (startSequences.length === 0 && blockSequences.length > 0) {
        // Si no hay evento de inicio, ejecuta la primera secuencia
        await this.executeSequence(blockSequences[0]);
      } else {
        // Ejecuta en paralelo todas las secuencias de inicio
        await Promise.all(startSequences.map(seq => this.executeSequence(seq)));
      }
    } catch (e) {
      if (e.message !== 'STOPPED') {
        this.logExecution(`❌ Error: ${e.message}`);
      }
    }

    this.isRunning = false;
    this.logExecution('⏹️ Ejecución completada');
    this.updateExecutionPanel();
  }

  /**
   * Ejecuta una secuencia de bloques en orden
   */
  async executeSequence(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      if (!this.isRunning) throw new Error('STOPPED');
      while (this.isPaused) await this.delay(100);

      const block = blocks[i];
      this.currentStep = i;
      this.highlightBlock(block.id);
      await this.executeBlock(block);
      await this.delay(this.stepDelay);
    }
  }

  /**
   * Ejecuta un bloque individual
   */
  async executeBlock(block) {
    const params = block.params || {};
    const blockId = block.defId;

    this.logExecution(`🔹 ${blockId}`);

    switch (blockId) {
      // === MOVIMIENTO ===
      case 'move_steps': {
        const steps = parseFloat(params.steps) || 10;
        const radians = (this.sprite.direction - 90) * Math.PI / 180;
        this.sprite.x += steps * Math.cos(radians);
        this.sprite.y += steps * Math.sin(radians);
        this.clampSprite();
        this.draw();
        break;
      }
      case 'turn_right':
        this.sprite.direction = (this.sprite.direction + (parseFloat(params.degrees) || 15)) % 360;
        this.draw();
        break;
      case 'turn_left':
        this.sprite.direction = (this.sprite.direction - (parseFloat(params.degrees) || 15) + 360) % 360;
        this.draw();
        break;
      case 'go_to_xy':
        this.sprite.x = this.scaleX(parseFloat(params.x) || 0);
        this.sprite.y = this.scaleY(parseFloat(params.y) || 0);
        this.draw();
        break;
      case 'go_to_random':
        this.sprite.x = 20 + Math.random() * (this.canvas.width - 40);
        this.sprite.y = 20 + Math.random() * (this.canvas.height - 40);
        this.draw();
        break;
      case 'glide_to_xy': {
        const targetX = this.scaleX(parseFloat(params.x) || 0);
        const targetY = this.scaleY(parseFloat(params.y) || 0);
        const secs = parseFloat(params.secs) || 1;
        await this.glide(targetX, targetY, secs);
        break;
      }
      case 'set_x':
        this.sprite.x = this.scaleX(parseFloat(params.x) || 0);
        this.draw();
        break;
      case 'set_y':
        this.sprite.y = this.scaleY(parseFloat(params.y) || 0);
        this.draw();
        break;
      case 'change_x':
        this.sprite.x += parseFloat(params.dx) || 10;
        this.clampSprite();
        this.draw();
        break;
      case 'change_y':
        this.sprite.y -= parseFloat(params.dy) || 10;
        this.clampSprite();
        this.draw();
        break;
      case 'if_on_edge_bounce':
        if (this.sprite.x <= 20 || this.sprite.x >= this.canvas.width - 20) {
          this.sprite.direction = 180 - this.sprite.direction;
        }
        if (this.sprite.y <= 20 || this.sprite.y >= this.canvas.height - 20) {
          this.sprite.direction = -this.sprite.direction;
        }
        this.draw();
        break;
      case 'point_in_direction':
        this.sprite.direction = parseFloat(params.angle) || 90;
        this.draw();
        break;

      // === APARIENCIA ===
      case 'say_for_secs': {
        const msg = params.message || '¡Hola!';
        const secs = parseFloat(params.secs) || 2;
        this.sprite.speech = msg;
        this.draw();
        await this.delay(secs * 1000);
        this.sprite.speech = null;
        this.draw();
        break;
      }
      case 'say':
        this.sprite.speech = params.message || '¡Hola!';
        this.draw();
        break;
      case 'think_for_secs': {
        const msg = params.message || 'Hmm...';
        const secs = parseFloat(params.secs) || 2;
        this.sprite.thought = msg;
        this.draw();
        await this.delay(secs * 1000);
        this.sprite.thought = null;
        this.draw();
        break;
      }
      case 'show':
        this.sprite.visible = true;
        this.draw();
        break;
      case 'hide':
        this.sprite.visible = false;
        this.draw();
        break;
      case 'set_size':
        this.sprite.size = (parseFloat(params.size) || 100) / 100;
        this.draw();
        break;
      case 'change_size':
        this.sprite.size = Math.max(0.1, this.sprite.size + (parseFloat(params.change) || 10) / 100);
        this.draw();
        break;
      case 'set_effect':
        if (this.sprite.effects[params.effect] !== undefined) {
          this.sprite.effects[params.effect] = parseFloat(params.value) || 0;
        }
        this.draw();
        break;
      case 'clear_effects':
        this.sprite.effects = { ghost: 0, brightness: 0, color: 0 };
        this.draw();
        break;
      case 'set_color':
        this.sprite.color = params.color || '#4a90d9';
        this.draw();
        break;
      case 'next_costume':
        this.sprite.costume = (this.sprite.costume + 1) % 4;
        this.draw();
        break;

      // === SONIDO ===
      case 'play_sound':
      case 'play_sound_until_done':
        this.logExecution(`🔊 Reproduciendo sonido: ${params.sound || 'pop'}`);
        this.playSimpleSound();
        break;
      case 'play_note':
        this.playNote(parseFloat(params.note) || 60);
        await this.delay((parseFloat(params.beats) || 0.5) * 500);
        break;
      case 'set_volume':
        this.logExecution(`🔊 Volumen: ${params.volume || 100}%`);
        break;
      case 'set_instrument':
        this.logExecution(`🎹 Instrumento: ${params.instrument || 'piano'}`);
        break;

      // === CONTROL ===
      case 'wait_secs':
        await this.delay((parseFloat(params.secs) || 1) * 1000);
        break;
      case 'repeat': {
        const times = parseInt(params.times) || 10;
        for (let i = 0; i < times; i++) {
          if (!this.isRunning) throw new Error('STOPPED');
          this.logExecution(`🔄 Iteración ${i + 1}/${times}`);
          await this.delay(this.stepDelay);
          this.draw();
        }
        break;
      }
      case 'forever':
        this.logExecution(`♾️ Bucle infinito (deteniendo después de 5 iteraciones en demo)`);
        for (let i = 0; i < 5; i++) {
          if (!this.isRunning) throw new Error('STOPPED');
          this.sprite.x += 15;
          this.clampSprite();
          this.draw();
          await this.delay(300);
        }
        break;
      case 'if_then':
        this.logExecution(`❓ Evaluando condición: ${params.condition}`);
        break;
      case 'if_then_else':
        this.logExecution(`❓ Si/Si no: ${params.condition}`);
        break;
      case 'stop':
        this.logExecution(`⏹️ Detener: ${params.option}`);
        if (params.option === 'todo') {
          this.stop();
          throw new Error('STOPPED');
        }
        break;
      case 'create_clone':
        this.logExecution(`🔀 Creando clon de: ${params.target}`);
        this.createSpriteClone();
        break;
      case 'for_each': {
        const max = parseInt(params.max) || 10;
        for (let i = 1; i <= Math.min(max, 5); i++) {
          if (!this.isRunning) throw new Error('STOPPED');
          this.variables[params.var || 'i'] = i;
          this.logExecution(`🔢 ${params.var || 'i'} = ${i}`);
          await this.delay(200);
        }
        break;
      }

      // === EVENTOS ===
      case 'when_flag_clicked':
        this.logExecution('🚩 Al presionar bandera verde');
        break;
      case 'when_key_pressed':
        this.logExecution(`⌨️ Al presionar tecla: ${params.key}`);
        break;
      case 'broadcast':
        this.logExecution(`📨 Enviando mensaje: ${params.message}`);
        this.messages[params.message] = Date.now();
        break;
      case 'when_receive_message':
        this.logExecution(`📬 Recibiendo mensaje: ${params.message}`);
        break;

      // === SENSORES ===
      case 'ask_and_wait': {
        const question = params.question || '¿Cómo te llamas?';
        this.sprite.speech = question;
        this.draw();
        const answer = window.prompt(question) || 'respuesta';
        this.variables['respuesta'] = answer;
        this.sprite.speech = null;
        this.draw();
        this.logExecution(`💬 Respuesta: ${answer}`);
        break;
      }
      case 'touching_edge': {
        const touching = this.sprite.x <= 20 || this.sprite.x >= this.canvas.width - 20 ||
          this.sprite.y <= 20 || this.sprite.y >= this.canvas.height - 20;
        this.logExecution(`📡 Tocando borde: ${touching}`);
        break;
      }

      // === OPERADORES ===
      case 'add':
        this.logExecution(`➕ ${params.a} + ${params.b} = ${parseFloat(params.a) + parseFloat(params.b)}`);
        break;
      case 'subtract':
        this.logExecution(`➖ ${params.a} - ${params.b} = ${parseFloat(params.a) - parseFloat(params.b)}`);
        break;
      case 'multiply':
        this.logExecution(`✖️ ${params.a} × ${params.b} = ${parseFloat(params.a) * parseFloat(params.b)}`);
        break;
      case 'divide':
        this.logExecution(`➗ ${params.a} ÷ ${params.b} = ${parseFloat(params.a) / parseFloat(params.b)}`);
        break;
      case 'random': {
        const min = parseInt(params.min) || 1;
        const max = parseInt(params.max) || 10;
        const result = min + Math.floor(Math.random() * (max - min + 1));
        this.logExecution(`🎲 Aleatorio entre ${min} y ${max}: ${result}`);
        break;
      }

      // === VARIABLES ===
      case 'set_variable':
        this.variables[params.var || 'variable'] = params.value;
        this.logExecution(`📦 ${params.var} = ${params.value}`);
        this.updateVariablesDisplay();
        break;
      case 'change_variable': {
        const current = parseFloat(this.variables[params.var] || 0);
        this.variables[params.var] = current + (parseFloat(params.amount) || 1);
        this.logExecution(`📦 ${params.var} += ${params.amount} = ${this.variables[params.var]}`);
        this.updateVariablesDisplay();
        break;
      }
      case 'show_variable':
        this.logExecution(`👁️ Mostrando variable: ${params.var} = ${this.variables[params.var] || 0}`);
        this.updateVariablesDisplay();
        break;

      // === IA ===
      case 'ai_generate_text': {
        const responses = [
          'Una vez en un mundo digital, vivía un sprite valiente...',
          'La inteligencia artificial soñaba con píxeles y código...',
          'En el año 2099, los robots aprendieron a crear arte...'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.sprite.speech = response.substring(0, 30) + '...';
        this.logExecution(`🤖 IA genera: "${response}"`);
        this.draw();
        await this.delay(2000);
        this.sprite.speech = null;
        this.draw();
        break;
      }
      case 'ai_classify_image':
        this.logExecution(`🖼️ IA clasifica imagen: gato (95% confianza)`);
        break;
      case 'ai_detect_emotion':
        this.logExecution(`😊 IA detecta emoción: alegría (87% confianza)`);
        break;
      case 'ai_text_to_speech':
        this.logExecution(`🗣️ Convirtiendo a voz: "${params.text}"`);
        this.playSimpleSound();
        break;
      case 'ai_translate':
        this.logExecution(`🌍 Traducido al ${params.language}: "Hello"`);
        break;
      case 'ai_chatbot':
        this.logExecution(`💬 Chatbot responde: "¡Hola! Estoy aquí para ayudarte."`);
        this.sprite.speech = '¡Hola! Soy Scrach_IA';
        this.draw();
        await this.delay(2000);
        this.sprite.speech = null;
        this.draw();
        break;

      default:
        this.logExecution(`⚙️ Ejecutando: ${blockId}`);
    }

    this.updateExecutionPanel();
  }

  /**
   * Dibuja el estado actual en el canvas
   */
  draw() {
    if (!this.ctx || !this.canvas) return;

    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Fondo
    const bgColor = document.getElementById('preview-area')?.style.background || '#1a1a2e';
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, width, height);

    // Grid de referencia
    this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    if (!this.sprite.visible) return;

    const s = this.sprite;
    const size = 20 * s.size;

    this.ctx.save();
    this.ctx.translate(s.x, s.y);
    this.ctx.rotate((s.direction - 90) * Math.PI / 180);

    // Efecto fantasma
    this.ctx.globalAlpha = 1 - (s.effects.ghost / 100);

    // Sprite: triángulo apuntando hacia la dirección
    const costumeColors = ['#4a90d9', '#e74c3c', '#27ae60', '#f39c12'];
    const color = s.costume < costumeColors.length ? costumeColors[s.costume] : s.color;

    this.ctx.fillStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 10;

    // Cuerpo del sprite
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(-size * 0.7, size * 0.7);
    this.ctx.lineTo(size * 0.7, size * 0.7);
    this.ctx.closePath();
    this.ctx.fill();

    // Ojos
    this.ctx.fillStyle = 'white';
    this.ctx.shadowBlur = 0;
    this.ctx.beginPath();
    this.ctx.arc(-size * 0.25, -size * 0.1, size * 0.2, 0, Math.PI * 2);
    this.ctx.arc(size * 0.25, -size * 0.1, size * 0.2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();

    // Speech bubble
    if (s.speech) {
      this.drawSpeechBubble(s.x, s.y - 30 * s.size, s.speech, false);
    }
    if (s.thought) {
      this.drawSpeechBubble(s.x, s.y - 30 * s.size, s.thought, true);
    }

    // Clones
    this.sprites.forEach(clone => {
      this.ctx.save();
      this.ctx.translate(clone.x, clone.y);
      this.ctx.fillStyle = 'rgba(74, 144, 217, 0.5)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawSpeechBubble(x, y, text, isThought) {
    const padding = 8;
    const maxWidth = 120;
    const fontSize = 11;
    this.ctx.font = `${fontSize}px Arial`;

    // Wrap text
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (this.ctx.measureText(testLine).width > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize + 4;
    const bubbleWidth = Math.min(maxWidth + padding * 2, 150);
    const bubbleHeight = lines.length * lineHeight + padding * 2;
    const bx = Math.min(Math.max(x - bubbleWidth / 2, 5), this.canvas.width - bubbleWidth - 5);
    const by = Math.max(y - bubbleHeight - 10, 5);

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;

    if (isThought) {
      // Thought bubble (circles)
      this.ctx.beginPath();
      this.ctx.roundRect(bx, by, bubbleWidth, bubbleHeight, 12);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(x - 5, y - 8, 4, 0, Math.PI * 2);
      this.ctx.arc(x, y - 3, 3, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.roundRect(bx, by, bubbleWidth, bubbleHeight, 8);
      this.ctx.fill();
      this.ctx.stroke();
      // Tail
      this.ctx.beginPath();
      this.ctx.moveTo(x - 6, y - 10);
      this.ctx.lineTo(x + 6, y - 10);
      this.ctx.lineTo(x, y - 2);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.fillStyle = '#333';
    lines.forEach((line, i) => {
      this.ctx.fillText(line, bx + padding, by + padding + fontSize + i * lineHeight);
    });
  }

  /**
   * Funciones auxiliares
   */
  scaleX(x) {
    return this.canvas ? this.canvas.width / 2 + x * (this.canvas.width / 480) : x;
  }

  scaleY(y) {
    return this.canvas ? this.canvas.height / 2 - y * (this.canvas.height / 360) : y;
  }

  clampSprite() {
    if (!this.canvas) return;
    this.sprite.x = Math.max(10, Math.min(this.canvas.width - 10, this.sprite.x));
    this.sprite.y = Math.max(10, Math.min(this.canvas.height - 10, this.sprite.y));
  }

  async glide(targetX, targetY, secs) {
    const steps = Math.max(1, secs * 10);
    const dx = (targetX - this.sprite.x) / steps;
    const dy = (targetY - this.sprite.y) / steps;
    for (let i = 0; i < steps; i++) {
      if (!this.isRunning) throw new Error('STOPPED');
      this.sprite.x += dx;
      this.sprite.y += dy;
      this.draw();
      await this.delay(secs * 100);
    }
  }

  playSimpleSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio not available
    }
  }

  playNote(midiNote) {
    try {
      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio not available
    }
  }

  createSpriteClone() {
    this.sprites.push({
      x: this.sprite.x + 20 + Math.random() * 30,
      y: this.sprite.y + 20 + Math.random() * 30
    });
    this.draw();
  }

  drawInitialState() {
    this.sprite.x = this.canvas.width / 2;
    this.sprite.y = this.canvas.height / 2;
    this.draw();
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.logExecution('⏹️ Detenido por el usuario');
    this.updateExecutionPanel();
  }

  pause() {
    this.isPaused = !this.isPaused;
    this.logExecution(this.isPaused ? '⏸️ Pausado' : '▶️ Reanudado');
  }

  reset() {
    this.stop();
    this.sprites = [];
    this.variables = {};
    this.sprite = {
      x: this.canvas ? this.canvas.width / 2 : 200,
      y: this.canvas ? this.canvas.height / 2 : 150,
      direction: 90,
      size: 1,
      visible: true,
      costume: 0,
      color: '#4a90d9',
      effects: { ghost: 0, brightness: 0, color: 0 },
      speech: null,
      thought: null
    };
    this.executionLog = [];
    this.draw();
    this.updateExecutionPanel();
    this.updateVariablesDisplay();
  }

  logExecution(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.executionLog.unshift({ time: timestamp, message });
    if (this.executionLog.length > 50) this.executionLog.pop();
  }

  updateExecutionPanel() {
    const panel = document.getElementById('execution-log');
    if (!panel) return;
    panel.innerHTML = this.executionLog.map(entry =>
      `<div class="log-entry"><span class="log-time">${entry.time}</span> ${entry.message}</div>`
    ).join('');
  }

  updateVariablesDisplay() {
    const panel = document.getElementById('variables-display');
    if (!panel) return;
    const vars = Object.entries(this.variables);
    if (vars.length === 0) {
      panel.innerHTML = '<div class="no-vars">Sin variables</div>';
      return;
    }
    panel.innerHTML = vars.map(([key, val]) =>
      `<div class="var-item"><span class="var-name">${key}</span><span class="var-value">${val}</span></div>`
    ).join('');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

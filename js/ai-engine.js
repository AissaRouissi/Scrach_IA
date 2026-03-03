/**
 * ai-engine.js - Motor de IA para generación de bloques por prompt
 */

class AIEngine {
  constructor() {
    this.isProcessing = false;
    this.conversationHistory = [];

    // Patrones de reconocimiento de intención
    this.intentPatterns = [
      // Movimiento
      { keywords: ['mover', 'desplazar', 'caminar', 'ir', 'avanzar'], blocks: ['move_steps', 'go_to_xy'] },
      { keywords: ['girar', 'rotar', 'giro', 'vuelta'], blocks: ['turn_right', 'turn_left'] },
      { keywords: ['saltar', 'brincar', 'rebote', 'rebotar'], blocks: ['if_on_edge_bounce', 'move_steps', 'change_y'] },
      { keywords: ['deslizar', 'deslizarse'], blocks: ['glide_to_xy'] },

      // Apariencia
      { keywords: ['decir', 'hablar', 'mensaje', 'texto', 'mostrar texto'], blocks: ['say_for_secs', 'say'] },
      { keywords: ['pensar', 'reflexionar'], blocks: ['think_for_secs'] },
      { keywords: ['cambiar disfraz', 'disfraz', 'animación'], blocks: ['switch_costume', 'next_costume'] },
      { keywords: ['mostrar', 'aparecer', 'visible'], blocks: ['show'] },
      { keywords: ['esconder', 'ocultar', 'desaparecer', 'invisible'], blocks: ['hide'] },
      { keywords: ['tamaño', 'crecer', 'agrandar', 'pequeño', 'grande'], blocks: ['set_size', 'change_size'] },
      { keywords: ['efecto', 'transparencia', 'color', 'brillo'], blocks: ['set_effect', 'change_effect'] },

      // Sonido
      { keywords: ['sonido', 'reproducir', 'música', 'audio', 'play'], blocks: ['play_sound', 'play_sound_until_done'] },
      { keywords: ['volumen', 'silencio', 'silenciar'], blocks: ['set_volume', 'change_volume'] },
      { keywords: ['nota', 'melodía', 'instrumento'], blocks: ['play_note', 'set_instrument'] },

      // Control
      { keywords: ['repetir', 'bucle', 'loop', 'veces', 'ciclo'], blocks: ['repeat', 'forever'] },
      { keywords: ['si', 'cuando', 'condición', 'entonces'], blocks: ['if_then', 'if_then_else'] },
      { keywords: ['esperar', 'pausa', 'parar', 'delay'], blocks: ['wait_secs'] },
      { keywords: ['siempre', 'infinito', 'por siempre'], blocks: ['forever'] },
      { keywords: ['clon', 'clonar', 'copiar sprite'], blocks: ['create_clone'] },
      { keywords: ['detener', 'parar todo', 'stop'], blocks: ['stop'] },

      // Eventos
      { keywords: ['al iniciar', 'al empezar', 'bandera', 'inicio'], blocks: ['when_flag_clicked'] },
      { keywords: ['al presionar', 'tecla', 'teclado'], blocks: ['when_key_pressed'] },
      { keywords: ['clic', 'hacer clic', 'pulsar'], blocks: ['when_clicked'] },
      { keywords: ['mensaje', 'enviar', 'recibir', 'broadcast'], blocks: ['broadcast', 'when_receive_message'] },

      // Sensores
      { keywords: ['tocar', 'tocando', 'colisión', 'choque'], blocks: ['touching_sprite', 'touching_edge'] },
      { keywords: ['color', 'detectar color'], blocks: ['touching_color'] },
      { keywords: ['ratón', 'mouse', 'cursor'], blocks: ['mouse_x', 'mouse_y', 'mouse_down'] },
      { keywords: ['tecla presionada', 'tecla pulsada'], blocks: ['key_pressed'] },
      { keywords: ['preguntar', 'pregunta', 'input usuario'], blocks: ['ask_and_wait'] },

      // Operadores
      { keywords: ['sumar', 'suma', 'más', 'agregar'], blocks: ['add'] },
      { keywords: ['restar', 'resta', 'menos', 'diferencia'], blocks: ['subtract'] },
      { keywords: ['multiplicar', 'multiplicación', 'por'], blocks: ['multiply'] },
      { keywords: ['dividir', 'división', 'entre'], blocks: ['divide'] },
      { keywords: ['aleatorio', 'random', 'azar'], blocks: ['random'] },

      // Variables
      { keywords: ['variable', 'guardar', 'almacenar', 'valor'], blocks: ['set_variable', 'change_variable'] },
      { keywords: ['puntuación', 'score', 'puntos'], blocks: ['set_variable', 'change_variable', 'show_variable'] },
      { keywords: ['lista', 'array', 'colección'], blocks: ['add_to_list'] },

      // IA
      { keywords: ['generar texto', 'texto ia', 'gpt', 'texto inteligente'], blocks: ['ai_generate_text'] },
      { keywords: ['clasificar', 'reconocer imagen', 'visión'], blocks: ['ai_classify_image'] },
      { keywords: ['emoción', 'sentimiento', 'cara', 'expresión'], blocks: ['ai_detect_emotion'] },
      { keywords: ['voz', 'hablar', 'text to speech', 'tts'], blocks: ['ai_text_to_speech'] },
      { keywords: ['traducir', 'traducción', 'idioma'], blocks: ['ai_translate'] },
      { keywords: ['chatbot', 'chat', 'conversación ia'], blocks: ['ai_chatbot'] }
    ];

    // Plantillas de proyectos comunes
    this.templates = {
      juego_simple: ['when_flag_clicked', 'forever', 'move_steps', 'if_on_edge_bounce'],
      animacion: ['when_flag_clicked', 'forever', 'next_costume', 'wait_secs'],
      pregunta_respuesta: ['when_flag_clicked', 'ask_and_wait', 'if_then', 'say_for_secs'],
      cuentaregresiva: ['when_flag_clicked', 'set_variable', 'repeat', 'change_variable', 'say_for_secs'],
      sigue_raton: ['when_flag_clicked', 'forever', 'point_towards', 'move_steps'],
      rebote: ['when_flag_clicked', 'forever', 'move_steps', 'if_on_edge_bounce', 'turn_right'],
      musica_simple: ['when_flag_clicked', 'set_instrument', 'play_note', 'play_note', 'play_note'],
      ia_texto: ['when_flag_clicked', 'ask_and_wait', 'ai_generate_text', 'say_for_secs']
    };
  }

  /**
   * Procesa un prompt de texto y genera bloques
   */
  async processPrompt(prompt) {
    this.isProcessing = true;
    this.conversationHistory.push({ role: 'user', content: prompt });

    // Simula un delay de procesamiento
    await this.delay(800 + Math.random() * 700);

    const result = this.analyzePrompt(prompt.toLowerCase());

    this.conversationHistory.push({
      role: 'assistant',
      content: result.message
    });

    this.isProcessing = false;
    return result;
  }

  /**
   * Analiza el prompt y retorna bloques sugeridos
   */
  analyzePrompt(prompt) {
    // Detecta plantillas completas primero
    const templateMatch = this.detectTemplate(prompt);
    if (templateMatch) {
      return this.buildTemplateResult(templateMatch, prompt);
    }

    // Detecta bloques individuales por patrones
    const detectedBlocks = this.detectBlocksByPattern(prompt);

    if (detectedBlocks.length === 0) {
      return this.buildFallbackResult(prompt);
    }

    return this.buildBlockResult(detectedBlocks, prompt);
  }

  /**
   * Detecta si el prompt coincide con una plantilla de proyecto
   */
  detectTemplate(prompt) {
    const templateKeywords = {
      juego_simple: ['juego', 'game', 'plataformas', 'arcade'],
      animacion: ['animación', 'animar', 'animado', 'disfraz cambiar'],
      pregunta_respuesta: ['pregunta', 'respuesta', 'quiz', 'trivia'],
      cuentaregresiva: ['cuenta regresiva', 'countdown', 'temporizador', 'contador'],
      sigue_raton: ['seguir ratón', 'seguir cursor', 'sigue al ratón'],
      rebote: ['rebote', 'rebotar', 'pelota'],
      musica_simple: ['música', 'canción', 'melodía', 'composición'],
      ia_texto: ['ia texto', 'generar respuesta', 'chatbot']
    };

    for (const [template, keywords] of Object.entries(templateKeywords)) {
      if (keywords.some(kw => prompt.includes(kw))) {
        return template;
      }
    }

    return null;
  }

  /**
   * Construye resultado desde plantilla
   */
  buildTemplateResult(templateName, prompt) {
    const blockIds = this.templates[templateName];
    const blocks = blockIds.map(id => {
      const def = BLOCKS_DEFINITION.find(b => b.id === id);
      return def ? {
        id: def.id,
        params: this.getDefaultParams(def),
        description: def.description
      } : null;
    }).filter(Boolean);

    const templateNames = {
      juego_simple: 'Juego Simple con Movimiento',
      animacion: 'Animación de Disfraz',
      pregunta_respuesta: 'Sistema de Preguntas y Respuestas',
      cuentaregresiva: 'Cuenta Regresiva',
      sigue_raton: 'Sprite que Sigue el Ratón',
      rebote: 'Pelota con Rebote',
      musica_simple: 'Melodía Simple',
      ia_texto: 'Chatbot con IA'
    };

    return {
      success: true,
      blocks,
      message: `✨ He generado una plantilla de **${templateNames[templateName]}** con ${blocks.length} bloques conectados. ¡Puedes personalizar los parámetros!`,
      type: 'template'
    };
  }

  /**
   * Detecta bloques individuales por patrones de palabras clave
   */
  detectBlocksByPattern(prompt) {
    const detectedIds = new Set();

    this.intentPatterns.forEach(pattern => {
      if (pattern.keywords.some(kw => prompt.includes(kw))) {
        pattern.blocks.forEach(id => detectedIds.add(id));
      }
    });

    return Array.from(detectedIds).map(id => {
      const def = BLOCKS_DEFINITION.find(b => b.id === id);
      return def ? {
        id: def.id,
        params: this.extractParamsFromPrompt(def, prompt),
        description: def.description
      } : null;
    }).filter(Boolean);
  }

  /**
   * Intenta extraer parámetros del prompt
   */
  extractParamsFromPrompt(blockDef, prompt) {
    const params = this.getDefaultParams(blockDef);

    // Extrae números del prompt
    const numbers = prompt.match(/\d+/g);

    if (numbers && blockDef.params) {
      let numIndex = 0;
      blockDef.params.forEach(param => {
        if (param.type === 'number' && numbers[numIndex]) {
          params[param.name] = parseInt(numbers[numIndex++]);
        }
      });
    }

    // Extrae texto entre comillas
    const quotedText = prompt.match(/"([^"]+)"|'([^']+)'/);
    if (quotedText && blockDef.params) {
      const textParam = blockDef.params.find(p => p.type === 'text');
      if (textParam) {
        params[textParam.name] = quotedText[1] || quotedText[2];
      }
    }

    return params;
  }

  /**
   * Construye resultado con bloques detectados
   */
  buildBlockResult(blocks, prompt) {
    const blockNames = blocks.map(b => {
      const def = BLOCKS_DEFINITION.find(d => d.id === b.id);
      return def ? def.label.replace(/\{[^}]+\}/g, '...') : b.id;
    }).join(', ');

    return {
      success: true,
      blocks,
      message: `🎯 He identificado ${blocks.length} bloque(s) para tu solicitud: **${blockNames}**. Se han añadido al workspace.`,
      type: 'blocks'
    };
  }

  /**
   * Resultado de fallback cuando no se detecta nada
   */
  buildFallbackResult(prompt) {
    // Sugerencias genéricas
    const suggestions = [
      { id: 'when_flag_clicked', params: {} },
      { id: 'say_for_secs', params: { message: 'Hola mundo', secs: 2 } },
      { id: 'move_steps', params: { steps: 10 } }
    ].map(s => {
      const def = BLOCKS_DEFINITION.find(b => b.id === s.id);
      return def ? { id: def.id, params: { ...this.getDefaultParams(def), ...s.params }, description: def.description } : null;
    }).filter(Boolean);

    return {
      success: false,
      blocks: suggestions,
      message: `🤔 No entendí bien tu solicitud "${prompt}". Te sugiero estos bloques básicos para empezar. Intenta ser más específico, por ejemplo: "mover 10 pasos al hacer clic" o "repetir sonido 3 veces"`,
      type: 'fallback'
    };
  }

  /**
   * Obtiene parámetros por defecto de un bloque
   */
  getDefaultParams(blockDef) {
    const params = {};
    if (blockDef.params) {
      blockDef.params.forEach(p => {
        params[p.name] = p.default;
      });
    }
    return params;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Genera sugerencias de prompts de ejemplo
   */
  getExamplePrompts() {
    return [
      '🎮 Crear un juego donde el sprite sigue al ratón',
      '🔄 Repetir una animación 10 veces',
      '🎵 Reproducir una melodía simple al iniciar',
      '💬 Hacer que el sprite diga "¡Hola!" al hacer clic',
      '🤖 Generar texto con IA cuando el usuario pregunta',
      '⚽ Hacer una pelota que rebota en los bordes',
      '🎨 Cambiar el color del sprite con efectos',
      '📊 Crear un contador de puntuación',
      '🌟 Detectar emociones en una imagen',
      '🗣️ Traducir el texto que escriba el usuario'
    ];
  }

  /**
   * Historial de conversación para el panel de chat
   */
  getChatHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

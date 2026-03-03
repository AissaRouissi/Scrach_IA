/**
 * blocks.js - Definición de los 100 bloques base de Scrach_IA
 * Organizados en 9 categorías con colores distintivos
 */

const BLOCK_CATEGORIES = {
  movimiento: { name: 'Movimiento', color: '#4a90d9', icon: '🏃' },
  apariencia: { name: 'Apariencia', color: '#9b59b6', icon: '👁️' },
  sonido: { name: 'Sonido', color: '#e91e8c', icon: '🎵' },
  eventos: { name: 'Eventos', color: '#f1c40f', icon: '⚡' },
  control: { name: 'Control', color: '#e67e22', icon: '🔄' },
  sensores: { name: 'Sensores', color: '#1abc9c', icon: '📡' },
  operadores: { name: 'Operadores', color: '#27ae60', icon: '➗' },
  variables: { name: 'Variables', color: '#e74c3c', icon: '📦' },
  ia: { name: 'IA', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🤖' }
};

const BLOCKS_DEFINITION = [
  // ===== MOVIMIENTO (15 bloques) =====
  {
    id: 'move_steps',
    category: 'movimiento',
    label: 'mover {steps} pasos',
    params: [{ name: 'steps', type: 'number', default: 10 }],
    description: 'Mueve el sprite hacia adelante'
  },
  {
    id: 'turn_right',
    category: 'movimiento',
    label: 'girar ↻ {degrees} grados',
    params: [{ name: 'degrees', type: 'number', default: 15 }],
    description: 'Gira el sprite a la derecha'
  },
  {
    id: 'turn_left',
    category: 'movimiento',
    label: 'girar ↺ {degrees} grados',
    params: [{ name: 'degrees', type: 'number', default: 15 }],
    description: 'Gira el sprite a la izquierda'
  },
  {
    id: 'go_to_xy',
    category: 'movimiento',
    label: 'ir a x:{x} y:{y}',
    params: [
      { name: 'x', type: 'number', default: 0 },
      { name: 'y', type: 'number', default: 0 }
    ],
    description: 'Mueve el sprite a coordenadas específicas'
  },
  {
    id: 'go_to_random',
    category: 'movimiento',
    label: 'ir a posición aleatoria',
    params: [],
    description: 'Mueve el sprite a una posición aleatoria'
  },
  {
    id: 'glide_to_xy',
    category: 'movimiento',
    label: 'deslizar en {secs} segs a x:{x} y:{y}',
    params: [
      { name: 'secs', type: 'number', default: 1 },
      { name: 'x', type: 'number', default: 0 },
      { name: 'y', type: 'number', default: 0 }
    ],
    description: 'Desliza suavemente el sprite'
  },
  {
    id: 'set_x',
    category: 'movimiento',
    label: 'fijar x a {x}',
    params: [{ name: 'x', type: 'number', default: 0 }],
    description: 'Establece la posición X del sprite'
  },
  {
    id: 'set_y',
    category: 'movimiento',
    label: 'fijar y a {y}',
    params: [{ name: 'y', type: 'number', default: 0 }],
    description: 'Establece la posición Y del sprite'
  },
  {
    id: 'change_x',
    category: 'movimiento',
    label: 'cambiar x en {dx}',
    params: [{ name: 'dx', type: 'number', default: 10 }],
    description: 'Cambia la posición X del sprite'
  },
  {
    id: 'change_y',
    category: 'movimiento',
    label: 'cambiar y en {dy}',
    params: [{ name: 'dy', type: 'number', default: 10 }],
    description: 'Cambia la posición Y del sprite'
  },
  {
    id: 'if_on_edge_bounce',
    category: 'movimiento',
    label: 'si toca el borde, rebotar',
    params: [],
    description: 'Rebota al tocar el borde'
  },
  {
    id: 'set_rotation_style',
    category: 'movimiento',
    label: 'fijar estilo de rotación {style}',
    params: [{ name: 'style', type: 'select', options: ['libre', 'izquierda-derecha', 'sin rotación'], default: 'libre' }],
    description: 'Establece el estilo de rotación'
  },
  {
    id: 'point_in_direction',
    category: 'movimiento',
    label: 'apuntar en dirección {angle}°',
    params: [{ name: 'angle', type: 'number', default: 90 }],
    description: 'Apunta el sprite en una dirección'
  },
  {
    id: 'point_towards',
    category: 'movimiento',
    label: 'apuntar hacia {target}',
    params: [{ name: 'target', type: 'select', options: ['puntero del ratón', 'sprite1'], default: 'puntero del ratón' }],
    description: 'Apunta hacia un objetivo'
  },
  {
    id: 'bounce_speed',
    category: 'movimiento',
    label: 'mover con velocidad {speed}',
    params: [{ name: 'speed', type: 'number', default: 5 }],
    description: 'Mueve el sprite con velocidad específica'
  },

  // ===== APARIENCIA (15 bloques) =====
  {
    id: 'say_for_secs',
    category: 'apariencia',
    label: 'decir {message} por {secs} segs',
    params: [
      { name: 'message', type: 'text', default: '¡Hola!' },
      { name: 'secs', type: 'number', default: 2 }
    ],
    description: 'Muestra un bocadillo con texto'
  },
  {
    id: 'say',
    category: 'apariencia',
    label: 'decir {message}',
    params: [{ name: 'message', type: 'text', default: '¡Hola!' }],
    description: 'Muestra un bocadillo de diálogo'
  },
  {
    id: 'think_for_secs',
    category: 'apariencia',
    label: 'pensar {message} por {secs} segs',
    params: [
      { name: 'message', type: 'text', default: 'Hmm...' },
      { name: 'secs', type: 'number', default: 2 }
    ],
    description: 'Muestra un bocadillo de pensamiento'
  },
  {
    id: 'switch_costume',
    category: 'apariencia',
    label: 'cambiar disfraz a {costume}',
    params: [{ name: 'costume', type: 'text', default: 'disfraz1' }],
    description: 'Cambia el disfraz del sprite'
  },
  {
    id: 'next_costume',
    category: 'apariencia',
    label: 'siguiente disfraz',
    params: [],
    description: 'Cambia al siguiente disfraz'
  },
  {
    id: 'show',
    category: 'apariencia',
    label: 'mostrar',
    params: [],
    description: 'Hace visible el sprite'
  },
  {
    id: 'hide',
    category: 'apariencia',
    label: 'esconder',
    params: [],
    description: 'Oculta el sprite'
  },
  {
    id: 'set_size',
    category: 'apariencia',
    label: 'fijar tamaño a {size}%',
    params: [{ name: 'size', type: 'number', default: 100 }],
    description: 'Establece el tamaño del sprite'
  },
  {
    id: 'change_size',
    category: 'apariencia',
    label: 'cambiar tamaño en {change}',
    params: [{ name: 'change', type: 'number', default: 10 }],
    description: 'Cambia el tamaño del sprite'
  },
  {
    id: 'set_effect',
    category: 'apariencia',
    label: 'fijar efecto {effect} a {value}',
    params: [
      { name: 'effect', type: 'select', options: ['color', 'brillo', 'fantasma', 'ojo de pez', 'torbellino', 'pixelar', 'mosaico'], default: 'color' },
      { name: 'value', type: 'number', default: 0 }
    ],
    description: 'Aplica un efecto visual'
  },
  {
    id: 'change_effect',
    category: 'apariencia',
    label: 'cambiar efecto {effect} en {value}',
    params: [
      { name: 'effect', type: 'select', options: ['color', 'brillo', 'fantasma'], default: 'color' },
      { name: 'value', type: 'number', default: 25 }
    ],
    description: 'Cambia un efecto visual'
  },
  {
    id: 'clear_effects',
    category: 'apariencia',
    label: 'quitar efectos gráficos',
    params: [],
    description: 'Elimina todos los efectos visuales'
  },
  {
    id: 'go_to_front',
    category: 'apariencia',
    label: 'ir a la capa {layer}',
    params: [{ name: 'layer', type: 'select', options: ['delantera', 'trasera'], default: 'delantera' }],
    description: 'Mueve el sprite a una capa'
  },
  {
    id: 'go_forward_layers',
    category: 'apariencia',
    label: 'avanzar {layers} capas',
    params: [{ name: 'layers', type: 'number', default: 1 }],
    description: 'Mueve el sprite hacia adelante en capas'
  },
  {
    id: 'set_color',
    category: 'apariencia',
    label: 'fijar color a {color}',
    params: [{ name: 'color', type: 'color', default: '#ff0000' }],
    description: 'Cambia el color del sprite'
  },

  // ===== SONIDO (10 bloques) =====
  {
    id: 'play_sound',
    category: 'sonido',
    label: 'reproducir sonido {sound}',
    params: [{ name: 'sound', type: 'text', default: 'pop' }],
    description: 'Reproduce un sonido'
  },
  {
    id: 'play_sound_until_done',
    category: 'sonido',
    label: 'reproducir sonido {sound} hasta terminar',
    params: [{ name: 'sound', type: 'text', default: 'pop' }],
    description: 'Reproduce un sonido hasta el final'
  },
  {
    id: 'stop_all_sounds',
    category: 'sonido',
    label: 'detener todos los sonidos',
    params: [],
    description: 'Para todos los sonidos en reproducción'
  },
  {
    id: 'set_volume',
    category: 'sonido',
    label: 'fijar volumen a {volume}%',
    params: [{ name: 'volume', type: 'number', default: 100 }],
    description: 'Establece el volumen'
  },
  {
    id: 'change_volume',
    category: 'sonido',
    label: 'cambiar volumen en {change}',
    params: [{ name: 'change', type: 'number', default: -10 }],
    description: 'Cambia el volumen'
  },
  {
    id: 'set_pitch',
    category: 'sonido',
    label: 'fijar tono a {pitch}',
    params: [{ name: 'pitch', type: 'number', default: 0 }],
    description: 'Establece el tono del sonido'
  },
  {
    id: 'set_pan',
    category: 'sonido',
    label: 'fijar paneo a {pan}',
    params: [{ name: 'pan', type: 'number', default: 0 }],
    description: 'Establece el paneo estéreo'
  },
  {
    id: 'play_note',
    category: 'sonido',
    label: 'tocar nota {note} por {beats} tiempos',
    params: [
      { name: 'note', type: 'number', default: 60 },
      { name: 'beats', type: 'number', default: 0.5 }
    ],
    description: 'Toca una nota musical'
  },
  {
    id: 'set_instrument',
    category: 'sonido',
    label: 'fijar instrumento a {instrument}',
    params: [{ name: 'instrument', type: 'select', options: ['piano', 'guitarra', 'trompeta', 'violín', 'batería'], default: 'piano' }],
    description: 'Establece el instrumento musical'
  },
  {
    id: 'play_drum',
    category: 'sonido',
    label: 'tocar batería {drum} por {beats} tiempos',
    params: [
      { name: 'drum', type: 'select', options: ['caja', 'bombo', 'hi-hat', 'platillo'], default: 'caja' },
      { name: 'beats', type: 'number', default: 0.25 }
    ],
    description: 'Toca un instrumento de batería'
  },

  // ===== EVENTOS (10 bloques) =====
  {
    id: 'when_flag_clicked',
    category: 'eventos',
    label: 'al presionar 🚩',
    params: [],
    type: 'hat',
    description: 'Se ejecuta al hacer clic en la bandera verde'
  },
  {
    id: 'when_key_pressed',
    category: 'eventos',
    label: 'al presionar tecla {key}',
    params: [{ name: 'key', type: 'select', options: ['espacio', 'arriba', 'abajo', 'izquierda', 'derecha', 'a', 'b', 'c', 'd', 'e'], default: 'espacio' }],
    type: 'hat',
    description: 'Se ejecuta al presionar una tecla'
  },
  {
    id: 'when_clicked',
    category: 'eventos',
    label: 'al hacer clic en este sprite',
    params: [],
    type: 'hat',
    description: 'Se ejecuta al hacer clic en el sprite'
  },
  {
    id: 'when_backdrop',
    category: 'eventos',
    label: 'al cambiar fondo a {backdrop}',
    params: [{ name: 'backdrop', type: 'text', default: 'fondo1' }],
    type: 'hat',
    description: 'Se ejecuta al cambiar el fondo'
  },
  {
    id: 'when_greater_than',
    category: 'eventos',
    label: 'cuando {sensor} > {value}',
    params: [
      { name: 'sensor', type: 'select', options: ['volumen', 'temporizador'], default: 'temporizador' },
      { name: 'value', type: 'number', default: 10 }
    ],
    type: 'hat',
    description: 'Se ejecuta cuando un sensor supera un valor'
  },
  {
    id: 'when_receive_message',
    category: 'eventos',
    label: 'al recibir {message}',
    params: [{ name: 'message', type: 'text', default: 'mensaje1' }],
    type: 'hat',
    description: 'Se ejecuta al recibir un mensaje'
  },
  {
    id: 'broadcast',
    category: 'eventos',
    label: 'enviar {message}',
    params: [{ name: 'message', type: 'text', default: 'mensaje1' }],
    description: 'Envía un mensaje a todos los sprites'
  },
  {
    id: 'broadcast_and_wait',
    category: 'eventos',
    label: 'enviar {message} y esperar',
    params: [{ name: 'message', type: 'text', default: 'mensaje1' }],
    description: 'Envía un mensaje y espera respuesta'
  },
  {
    id: 'when_timer',
    category: 'eventos',
    label: 'al pasar {secs} segundos',
    params: [{ name: 'secs', type: 'number', default: 3 }],
    type: 'hat',
    description: 'Se ejecuta después de un tiempo'
  },
  {
    id: 'when_start',
    category: 'eventos',
    label: 'al iniciar el programa',
    params: [],
    type: 'hat',
    description: 'Se ejecuta al iniciar el programa'
  },

  // ===== CONTROL (15 bloques) =====
  {
    id: 'wait_secs',
    category: 'control',
    label: 'esperar {secs} segundos',
    params: [{ name: 'secs', type: 'number', default: 1 }],
    description: 'Pausa la ejecución por un tiempo'
  },
  {
    id: 'repeat',
    category: 'control',
    label: 'repetir {times}',
    params: [{ name: 'times', type: 'number', default: 10 }],
    type: 'c',
    description: 'Repite un bloque de instrucciones'
  },
  {
    id: 'forever',
    category: 'control',
    label: 'por siempre',
    params: [],
    type: 'c',
    description: 'Repite indefinidamente'
  },
  {
    id: 'if_then',
    category: 'control',
    label: 'si {condition} entonces',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    type: 'c',
    description: 'Ejecuta si la condición es verdadera'
  },
  {
    id: 'if_then_else',
    category: 'control',
    label: 'si {condition} entonces ... si no',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    type: 'c',
    description: 'Ejecuta una de dos ramas según condición'
  },
  {
    id: 'wait_until',
    category: 'control',
    label: 'esperar hasta que {condition}',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    description: 'Espera hasta que se cumpla la condición'
  },
  {
    id: 'repeat_until',
    category: 'control',
    label: 'repetir hasta que {condition}',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    type: 'c',
    description: 'Repite hasta que se cumpla la condición'
  },
  {
    id: 'stop',
    category: 'control',
    label: 'detener {option}',
    params: [{ name: 'option', type: 'select', options: ['todo', 'este script', 'otros scripts en sprite'], default: 'todo' }],
    description: 'Detiene la ejecución'
  },
  {
    id: 'create_clone',
    category: 'control',
    label: 'crear clon de {target}',
    params: [{ name: 'target', type: 'select', options: ['este sprite', 'sprite1', 'sprite2'], default: 'este sprite' }],
    description: 'Crea un clon del sprite'
  },
  {
    id: 'when_start_as_clone',
    category: 'control',
    label: 'al comenzar como clon',
    params: [],
    type: 'hat',
    description: 'Se ejecuta cuando el clon inicia'
  },
  {
    id: 'delete_clone',
    category: 'control',
    label: 'eliminar este clon',
    params: [],
    description: 'Elimina el clon actual'
  },
  {
    id: 'for_each',
    category: 'control',
    label: 'para cada {var} de 1 a {max}',
    params: [
      { name: 'var', type: 'text', default: 'i' },
      { name: 'max', type: 'number', default: 10 }
    ],
    type: 'c',
    description: 'Itera con una variable de control'
  },
  {
    id: 'while',
    category: 'control',
    label: 'mientras {condition}',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    type: 'c',
    description: 'Repite mientras la condición es verdadera'
  },
  {
    id: 'try_catch',
    category: 'control',
    label: 'intentar ... si error: {action}',
    params: [{ name: 'action', type: 'text', default: 'mostrar error' }],
    type: 'c',
    description: 'Maneja errores en la ejecución'
  },
  {
    id: 'run_parallel',
    category: 'control',
    label: 'ejecutar en paralelo',
    params: [],
    type: 'c',
    description: 'Ejecuta bloques en paralelo'
  },

  // ===== SENSORES (10 bloques) =====
  {
    id: 'touching_edge',
    category: 'sensores',
    label: '¿tocando el borde?',
    params: [],
    type: 'boolean',
    description: 'Detecta si toca el borde'
  },
  {
    id: 'touching_color',
    category: 'sensores',
    label: '¿tocando el color {color}?',
    params: [{ name: 'color', type: 'color', default: '#ff0000' }],
    type: 'boolean',
    description: 'Detecta si toca un color específico'
  },
  {
    id: 'touching_sprite',
    category: 'sensores',
    label: '¿tocando {sprite}?',
    params: [{ name: 'sprite', type: 'text', default: 'sprite1' }],
    type: 'boolean',
    description: 'Detecta si toca otro sprite'
  },
  {
    id: 'distance_to',
    category: 'sensores',
    label: 'distancia a {target}',
    params: [{ name: 'target', type: 'select', options: ['puntero del ratón', 'sprite1'], default: 'puntero del ratón' }],
    type: 'reporter',
    description: 'Calcula la distancia a un objetivo'
  },
  {
    id: 'ask_and_wait',
    category: 'sensores',
    label: 'preguntar {question} y esperar',
    params: [{ name: 'question', type: 'text', default: '¿Cómo te llamas?' }],
    description: 'Hace una pregunta al usuario'
  },
  {
    id: 'key_pressed',
    category: 'sensores',
    label: '¿tecla {key} presionada?',
    params: [{ name: 'key', type: 'select', options: ['espacio', 'arriba', 'abajo', 'izquierda', 'derecha'], default: 'espacio' }],
    type: 'boolean',
    description: 'Detecta si una tecla está presionada'
  },
  {
    id: 'mouse_down',
    category: 'sensores',
    label: '¿ratón presionado?',
    params: [],
    type: 'boolean',
    description: 'Detecta si el ratón está presionado'
  },
  {
    id: 'mouse_x',
    category: 'sensores',
    label: 'posición x del ratón',
    params: [],
    type: 'reporter',
    description: 'Obtiene la posición X del ratón'
  },
  {
    id: 'mouse_y',
    category: 'sensores',
    label: 'posición y del ratón',
    params: [],
    type: 'reporter',
    description: 'Obtiene la posición Y del ratón'
  },
  {
    id: 'timer',
    category: 'sensores',
    label: 'temporizador',
    params: [],
    type: 'reporter',
    description: 'Obtiene el valor del temporizador'
  },

  // ===== OPERADORES (10 bloques) =====
  {
    id: 'add',
    category: 'operadores',
    label: '{a} + {b}',
    params: [
      { name: 'a', type: 'number', default: 1 },
      { name: 'b', type: 'number', default: 1 }
    ],
    type: 'reporter',
    description: 'Suma dos valores'
  },
  {
    id: 'subtract',
    category: 'operadores',
    label: '{a} - {b}',
    params: [
      { name: 'a', type: 'number', default: 5 },
      { name: 'b', type: 'number', default: 3 }
    ],
    type: 'reporter',
    description: 'Resta dos valores'
  },
  {
    id: 'multiply',
    category: 'operadores',
    label: '{a} × {b}',
    params: [
      { name: 'a', type: 'number', default: 2 },
      { name: 'b', type: 'number', default: 3 }
    ],
    type: 'reporter',
    description: 'Multiplica dos valores'
  },
  {
    id: 'divide',
    category: 'operadores',
    label: '{a} ÷ {b}',
    params: [
      { name: 'a', type: 'number', default: 10 },
      { name: 'b', type: 'number', default: 2 }
    ],
    type: 'reporter',
    description: 'Divide dos valores'
  },
  {
    id: 'random',
    category: 'operadores',
    label: 'número al azar entre {min} y {max}',
    params: [
      { name: 'min', type: 'number', default: 1 },
      { name: 'max', type: 'number', default: 10 }
    ],
    type: 'reporter',
    description: 'Genera un número aleatorio'
  },
  {
    id: 'greater_than',
    category: 'operadores',
    label: '{a} > {b}',
    params: [
      { name: 'a', type: 'number', default: 5 },
      { name: 'b', type: 'number', default: 3 }
    ],
    type: 'boolean',
    description: 'Compara si A es mayor que B'
  },
  {
    id: 'less_than',
    category: 'operadores',
    label: '{a} < {b}',
    params: [
      { name: 'a', type: 'number', default: 3 },
      { name: 'b', type: 'number', default: 5 }
    ],
    type: 'boolean',
    description: 'Compara si A es menor que B'
  },
  {
    id: 'equals',
    category: 'operadores',
    label: '{a} = {b}',
    params: [
      { name: 'a', type: 'number', default: 5 },
      { name: 'b', type: 'number', default: 5 }
    ],
    type: 'boolean',
    description: 'Compara si A es igual a B'
  },
  {
    id: 'and',
    category: 'operadores',
    label: '{a} y {b}',
    params: [
      { name: 'a', type: 'boolean', default: 'verdadero' },
      { name: 'b', type: 'boolean', default: 'verdadero' }
    ],
    type: 'boolean',
    description: 'Operador lógico AND'
  },
  {
    id: 'not',
    category: 'operadores',
    label: 'no {condition}',
    params: [{ name: 'condition', type: 'boolean', default: 'verdadero' }],
    type: 'boolean',
    description: 'Operador lógico NOT'
  },

  // ===== VARIABLES (5 bloques) =====
  {
    id: 'set_variable',
    category: 'variables',
    label: 'fijar {var} a {value}',
    params: [
      { name: 'var', type: 'text', default: 'miVariable' },
      { name: 'value', type: 'number', default: 0 }
    ],
    description: 'Establece el valor de una variable'
  },
  {
    id: 'change_variable',
    category: 'variables',
    label: 'cambiar {var} en {amount}',
    params: [
      { name: 'var', type: 'text', default: 'miVariable' },
      { name: 'amount', type: 'number', default: 1 }
    ],
    description: 'Cambia el valor de una variable'
  },
  {
    id: 'show_variable',
    category: 'variables',
    label: 'mostrar variable {var}',
    params: [{ name: 'var', type: 'text', default: 'miVariable' }],
    description: 'Muestra la variable en pantalla'
  },
  {
    id: 'hide_variable',
    category: 'variables',
    label: 'esconder variable {var}',
    params: [{ name: 'var', type: 'text', default: 'miVariable' }],
    description: 'Oculta la variable de pantalla'
  },
  {
    id: 'add_to_list',
    category: 'variables',
    label: 'añadir {item} a {list}',
    params: [
      { name: 'item', type: 'text', default: 'elemento' },
      { name: 'list', type: 'text', default: 'miLista' }
    ],
    description: 'Añade un elemento a una lista'
  },

  // ===== IA (10 bloques) =====
  {
    id: 'ai_generate_text',
    category: 'ia',
    label: 'generar texto: {prompt}',
    params: [{ name: 'prompt', type: 'text', default: 'Escribe un poema corto' }],
    type: 'reporter',
    description: 'Genera texto usando IA'
  },
  {
    id: 'ai_classify_image',
    category: 'ia',
    label: 'clasificar imagen {image}',
    params: [{ name: 'image', type: 'text', default: 'imagen1' }],
    type: 'reporter',
    description: 'Clasifica una imagen con IA'
  },
  {
    id: 'ai_detect_emotion',
    category: 'ia',
    label: 'detectar emoción en {image}',
    params: [{ name: 'image', type: 'text', default: 'cámara' }],
    type: 'reporter',
    description: 'Detecta emociones en una imagen'
  },
  {
    id: 'ai_text_to_speech',
    category: 'ia',
    label: 'convertir a voz: {text}',
    params: [{ name: 'text', type: 'text', default: 'Hola mundo' }],
    description: 'Convierte texto a voz'
  },
  {
    id: 'ai_translate',
    category: 'ia',
    label: 'traducir {text} al {language}',
    params: [
      { name: 'text', type: 'text', default: 'Hola' },
      { name: 'language', type: 'select', options: ['inglés', 'francés', 'alemán', 'japonés', 'chino'], default: 'inglés' }
    ],
    type: 'reporter',
    description: 'Traduce texto a otro idioma'
  },
  {
    id: 'ai_speech_to_text',
    category: 'ia',
    label: 'escuchar y transcribir',
    params: [],
    type: 'reporter',
    description: 'Convierte voz a texto'
  },
  {
    id: 'ai_generate_image',
    category: 'ia',
    label: 'generar imagen: {description}',
    params: [{ name: 'description', type: 'text', default: 'Un paisaje montañoso al atardecer' }],
    type: 'reporter',
    description: 'Genera una imagen usando IA'
  },
  {
    id: 'ai_sentiment_analysis',
    category: 'ia',
    label: 'analizar sentimiento de {text}',
    params: [{ name: 'text', type: 'text', default: '¡Qué día tan bonito!' }],
    type: 'reporter',
    description: 'Analiza el sentimiento de un texto'
  },
  {
    id: 'ai_chatbot',
    category: 'ia',
    label: 'chatbot responde a {message}',
    params: [{ name: 'message', type: 'text', default: '¿Cómo estás?' }],
    type: 'reporter',
    description: 'Interactúa con un chatbot de IA'
  },
  {
    id: 'ai_pose_detection',
    category: 'ia',
    label: 'detectar pose corporal',
    params: [],
    type: 'reporter',
    description: 'Detecta la pose corporal con IA'
  }
];

/**
 * Obtiene los bloques filtrados por categoría y modo
 */
function getBlocksByCategory(category, mode = 'all', difficulty = 'easy') {
  let blocks = BLOCKS_DEFINITION.filter(b => b.category === category);

  if (difficulty === 'easy') {
    blocks = blocks.filter(b => !b.advancedOnly);
  }

  if (mode !== 'all') {
    const modeBlocks = MODE_BLOCK_FILTERS[mode];
    if (modeBlocks) {
      blocks = blocks.filter(b => modeBlocks.includes(b.id) || modeBlocks.includes(b.category));
    }
  }

  return blocks;
}

/**
 * Filtros de bloques por modo de uso
 */
const MODE_BLOCK_FILTERS = {
  games: ['movimiento', 'control', 'sensores', 'eventos', 'variables', 'apariencia'],
  art: ['apariencia', 'movimiento', 'operadores', 'control', 'ia'],
  music: ['sonido', 'eventos', 'control', 'operadores', 'ia'],
  stories: ['apariencia', 'eventos', 'control', 'sensores', 'ia'],
  robot: ['movimiento', 'sensores', 'control', 'variables', 'ia']
};

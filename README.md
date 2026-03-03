# Scrach_IA 🧩🤖

**Editor de bloques visual moderno con Inteligencia Artificial integrada** — una alternativa mejorada a Scratch, diseñada para crear proyectos interactivos de manera visual, potente y accesible.

---

## 🚀 Cómo Ejecutar

1. Clona o descarga el repositorio
2. Abre el archivo `index.html` en tu navegador web moderno (Chrome, Firefox, Edge)
3. ¡No requiere servidor, instalación ni dependencias!

```bash
# Con Python (opcional, para servidor local)
python3 -m http.server 8080
# Luego abre: http://localhost:8080
```

---

## ✨ Características Principales

- **100 bloques integrados** organizados en 9 categorías con colores distintivos
- **Editor visual drag & drop** — arrastra bloques al workspace y conéctalos
- **5 modos de uso** especializados para diferentes tipos de proyectos
- **2 niveles de dificultad** — Fácil para principiantes, Difícil para avanzados
- **Motor de IA integrado** — describe en texto lo que quieres y la IA genera los bloques
- **Vista previa en tiempo real** con canvas interactivo
- **Ejecutor de bloques** con log de ejecución y gestión de variables
- **Guardado automático** en localStorage
- Diseño **dark mode** moderno con animaciones suaves

---

## 🎮 Los 5 Modos de Uso

| Modo | Icono | Descripción |
|------|-------|-------------|
| **Juegos** | 🎮 | Crear juegos interactivos: plataformas, puzzles, arcade |
| **Arte** | 🎨 | Crear arte generativo y animaciones visuales |
| **Música** | 🎵 | Crear composiciones y efectos de sonido |
| **Historias** | 📖 | Crear historias interactivas y animaciones narrativas |
| **Robot/IoT** | 🤖 | Programar dispositivos y simulaciones de robótica |

---

## 🎯 Niveles de Dificultad

| Nivel | Icono | Descripción |
|-------|-------|-------------|
| **Fácil** | 🟢 | Bloques simplificados, interfaz limpia, tutoriales guiados |
| **Difícil** | 🔴 | Todos los bloques disponibles, opciones avanzadas, modo código |

---

## 🧩 Los 100 Bloques Organizados por Categoría

### 🏃 Movimiento (15 bloques)
| Bloque | Descripción |
|--------|-------------|
| mover {steps} pasos | Mueve el sprite hacia adelante |
| girar ↻ {degrees} grados | Gira el sprite a la derecha |
| girar ↺ {degrees} grados | Gira el sprite a la izquierda |
| ir a x:{x} y:{y} | Mueve el sprite a coordenadas específicas |
| ir a posición aleatoria | Mueve el sprite a una posición aleatoria |
| deslizar en {secs} segs a x:{x} y:{y} | Desliza suavemente el sprite |
| fijar x a {x} | Establece la posición X del sprite |
| fijar y a {y} | Establece la posición Y del sprite |
| cambiar x en {dx} | Cambia la posición X del sprite |
| cambiar y en {dy} | Cambia la posición Y del sprite |
| si toca el borde, rebotar | Rebota al tocar el borde |
| fijar estilo de rotación | Establece el estilo de rotación |
| apuntar en dirección {angle}° | Apunta el sprite en una dirección |
| apuntar hacia {target} | Apunta hacia un objetivo |
| mover con velocidad {speed} | Mueve el sprite con velocidad específica |

### 👁️ Apariencia (15 bloques)
| Bloque | Descripción |
|--------|-------------|
| decir {message} por {secs} segs | Muestra un bocadillo con texto |
| decir {message} | Muestra un bocadillo de diálogo |
| pensar {message} por {secs} segs | Muestra un bocadillo de pensamiento |
| cambiar disfraz a {costume} | Cambia el disfraz del sprite |
| siguiente disfraz | Cambia al siguiente disfraz |
| mostrar | Hace visible el sprite |
| esconder | Oculta el sprite |
| fijar tamaño a {size}% | Establece el tamaño del sprite |
| cambiar tamaño en {change} | Cambia el tamaño del sprite |
| fijar efecto {effect} a {value} | Aplica un efecto visual |
| cambiar efecto {effect} en {value} | Cambia un efecto visual |
| quitar efectos gráficos | Elimina todos los efectos visuales |
| ir a la capa {layer} | Mueve el sprite a una capa |
| avanzar {layers} capas | Mueve el sprite hacia adelante en capas |
| fijar color a {color} | Cambia el color del sprite |

### 🎵 Sonido (10 bloques)
| Bloque | Descripción |
|--------|-------------|
| reproducir sonido {sound} | Reproduce un sonido |
| reproducir sonido {sound} hasta terminar | Reproduce un sonido hasta el final |
| detener todos los sonidos | Para todos los sonidos |
| fijar volumen a {volume}% | Establece el volumen |
| cambiar volumen en {change} | Cambia el volumen |
| fijar tono a {pitch} | Establece el tono del sonido |
| fijar paneo a {pan} | Establece el paneo estéreo |
| tocar nota {note} por {beats} tiempos | Toca una nota musical |
| fijar instrumento a {instrument} | Establece el instrumento musical |
| tocar batería {drum} por {beats} tiempos | Toca un instrumento de batería |

### ⚡ Eventos (10 bloques)
| Bloque | Descripción |
|--------|-------------|
| al presionar 🚩 | Se ejecuta al hacer clic en la bandera verde |
| al presionar tecla {key} | Se ejecuta al presionar una tecla |
| al hacer clic en este sprite | Se ejecuta al hacer clic en el sprite |
| al cambiar fondo a {backdrop} | Se ejecuta al cambiar el fondo |
| cuando {sensor} > {value} | Se ejecuta cuando un sensor supera un valor |
| al recibir {message} | Se ejecuta al recibir un mensaje |
| enviar {message} | Envía un mensaje a todos los sprites |
| enviar {message} y esperar | Envía un mensaje y espera respuesta |
| al pasar {secs} segundos | Se ejecuta después de un tiempo |
| al iniciar el programa | Se ejecuta al iniciar el programa |

### 🔄 Control (15 bloques)
| Bloque | Descripción |
|--------|-------------|
| esperar {secs} segundos | Pausa la ejecución por un tiempo |
| repetir {times} | Repite un bloque de instrucciones |
| por siempre | Repite indefinidamente |
| si {condition} entonces | Ejecuta si la condición es verdadera |
| si {condition} entonces ... si no | Ejecuta una de dos ramas según condición |
| esperar hasta que {condition} | Espera hasta que se cumpla la condición |
| repetir hasta que {condition} | Repite hasta que se cumpla la condición |
| detener {option} | Detiene la ejecución |
| crear clon de {target} | Crea un clon del sprite |
| al comenzar como clon | Se ejecuta cuando el clon inicia |
| eliminar este clon | Elimina el clon actual |
| para cada {var} de 1 a {max} | Itera con una variable de control |
| mientras {condition} | Repite mientras la condición es verdadera |
| intentar ... si error | Maneja errores en la ejecución |
| ejecutar en paralelo | Ejecuta bloques en paralelo |

### 📡 Sensores (10 bloques)
| Bloque | Descripción |
|--------|-------------|
| ¿tocando el borde? | Detecta si toca el borde |
| ¿tocando el color {color}? | Detecta si toca un color específico |
| ¿tocando {sprite}? | Detecta si toca otro sprite |
| distancia a {target} | Calcula la distancia a un objetivo |
| preguntar {question} y esperar | Hace una pregunta al usuario |
| ¿tecla {key} presionada? | Detecta si una tecla está presionada |
| ¿ratón presionado? | Detecta si el ratón está presionado |
| posición x del ratón | Obtiene la posición X del ratón |
| posición y del ratón | Obtiene la posición Y del ratón |
| temporizador | Obtiene el valor del temporizador |

### ➗ Operadores (10 bloques)
| Bloque | Descripción |
|--------|-------------|
| {a} + {b} | Suma dos valores |
| {a} - {b} | Resta dos valores |
| {a} × {b} | Multiplica dos valores |
| {a} ÷ {b} | Divide dos valores |
| número al azar entre {min} y {max} | Genera un número aleatorio |
| {a} > {b} | Compara si A es mayor que B |
| {a} < {b} | Compara si A es menor que B |
| {a} = {b} | Compara si A es igual a B |
| {a} y {b} | Operador lógico AND |
| no {condition} | Operador lógico NOT |

### 📦 Variables (5 bloques)
| Bloque | Descripción |
|--------|-------------|
| fijar {var} a {value} | Establece el valor de una variable |
| cambiar {var} en {amount} | Cambia el valor de una variable |
| mostrar variable {var} | Muestra la variable en pantalla |
| esconder variable {var} | Oculta la variable de pantalla |
| añadir {item} a {list} | Añade un elemento a una lista |

### 🤖 IA (10 bloques)
| Bloque | Descripción |
|--------|-------------|
| generar texto: {prompt} | Genera texto usando IA |
| clasificar imagen {image} | Clasifica una imagen con IA |
| detectar emoción en {image} | Detecta emociones en una imagen |
| convertir a voz: {text} | Convierte texto a voz |
| traducir {text} al {language} | Traduce texto a otro idioma |
| escuchar y transcribir | Convierte voz a texto |
| generar imagen: {description} | Genera una imagen usando IA |
| analizar sentimiento de {text} | Analiza el sentimiento de un texto |
| chatbot responde a {message} | Interactúa con un chatbot de IA |
| detectar pose corporal | Detecta la pose corporal con IA |

---

## 🛠️ Tecnologías Usadas

- **HTML5** — Estructura de la aplicación
- **CSS3** — Estilos modernos con variables CSS, grid, flexbox, animaciones
- **JavaScript Vanilla** — Sin frameworks, máxima compatibilidad
- **Canvas API** — Vista previa de ejecución en tiempo real
- **Web Audio API** — Reproducción de sonidos y notas musicales
- **localStorage** — Guardado persistente de proyectos

---

## 📁 Estructura del Proyecto

```
/
├── index.html              # Página principal con el editor completo
├── css/
│   └── styles.css          # Estilos principales (dark mode moderno)
├── js/
│   ├── app.js              # Inicialización de la app y gestión de estado global
│   ├── blocks.js           # Definición de los 100 bloques base con sus categorías
│   ├── editor.js           # Lógica del editor visual (drag & drop, canvas, snap)
│   ├── ai-engine.js        # Motor de IA para generación de bloques por prompt
│   ├── modes.js            # Gestión de los 5 modos de uso
│   └── executor.js         # Ejecutor/intérprete de los bloques
└── README.md               # Esta documentación
```

---

## 🗺️ Roadmap Futuro

- [ ] **Múltiples sprites** — Gestionar varios sprites en el canvas
- [ ] **Exportación** — Exportar proyectos como HTML/JS ejecutable
- [ ] **Biblioteca de proyectos** — Galería de proyectos de la comunidad
- [ ] **Colaboración en tiempo real** — Programación colaborativa
- [ ] **API de IA real** — Integración con OpenAI, Gemini, etc.
- [ ] **Extensiones** — Sistema de plugins para nuevos bloques
- [ ] **Modo móvil** — Soporte táctil completo
- [ ] **Depurador visual** — Paso a paso con inspección de variables
- [ ] **Bloques personalizados** — Crear tus propios bloques reutilizables
- [ ] **Sonidos y disfraces** — Biblioteca de assets multimedia

---

## 📄 Licencia

MIT License — libre para usar, modificar y distribuir.

---

*Scrach_IA — Programación visual + IA para todos 🚀*

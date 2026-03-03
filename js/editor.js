/**
 * editor.js - Lógica del editor visual: drag & drop, canvas, snap
 */

class BlockEditor {
  constructor(workspace, blocksPanel) {
    this.workspace = workspace;
    this.inner = workspace.querySelector('.workspace-inner') || workspace;
    this.blocksPanel = blocksPanel;
    this.blocks = [];
    this.connections = [];
    this.dragState = null;
    this.snapDistance = 24;
    this.blockIdCounter = 0;
    this.offset = { x: 0, y: 0 };
    this.scale = 1;
    this.isPanning = false;
    this.panStart = null;
    this.selectedBlock = null;

    this.init();
  }

  init() {
    this.setupWorkspaceEvents();
    this.renderBlocksPalette();
  }

  /**
   * Configura los eventos del workspace
   */
  setupWorkspaceEvents() {
    this.workspace.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      this.showDropIndicator(e);
    });

    this.workspace.addEventListener('drop', (e) => {
      e.preventDefault();
      this.hideDropIndicator();
      this.handleDrop(e);
    });

    this.workspace.addEventListener('dragleave', () => {
      this.hideDropIndicator();
    });

    // Pan con clic medio o espacio + arrastre
    this.workspace.addEventListener('mousedown', (e) => {
      if (e.button === 1 || (e.button === 0 && (e.target === this.workspace || e.target === this.inner))) {
        this.startPan(e);
      }
    });

    this.workspace.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.doPan(e);
      }
    });

    this.workspace.addEventListener('mouseup', () => {
      this.stopPan();
    });

    // Zoom con rueda del ratón
    this.workspace.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.handleZoom(e);
    });
  }

  /**
   * Muestra indicador visual de zona de drop
   */
  showDropIndicator(e) {
    this.workspace.classList.add('drag-over');
  }

  hideDropIndicator() {
    this.workspace.classList.remove('drag-over');
  }

  /**
   * Maneja el drop de un bloque desde la paleta al workspace
   */
  handleDrop(e) {
    const blockId = e.dataTransfer.getData('blockId');
    if (!blockId) return;

    const blockDef = BLOCKS_DEFINITION.find(b => b.id === blockId);
    if (!blockDef) return;

    const rect = this.workspace.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offset.x) / this.scale;
    const y = (e.clientY - rect.top - this.offset.y) / this.scale;

    this.addBlock(blockDef, x, y);
  }

  /**
   * Añade un bloque al workspace
   */
  addBlock(blockDef, x, y, params = null) {
    const id = `block_${++this.blockIdCounter}`;
    const blockParams = params || this.getDefaultParams(blockDef);

    const block = {
      id,
      defId: blockDef.id,
      category: blockDef.category,
      label: blockDef.label,
      params: blockParams,
      x,
      y,
      connectedTo: null,
      connectedFrom: null,
      element: null
    };

    this.blocks.push(block);
    this.renderBlock(block);
    this.checkSnapConnections(block);

    return block;
  }

  /**
   * Obtiene los parámetros por defecto de un bloque
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

  /**
   * Renderiza un bloque en el workspace
   */
  renderBlock(block) {
    const blockDef = BLOCKS_DEFINITION.find(b => b.id === block.defId);
    const category = BLOCK_CATEGORIES[block.category];

    const el = document.createElement('div');
    el.className = `workspace-block block-${block.category}`;
    el.id = block.id;
    el.style.left = `${block.x}px`;
    el.style.top = `${block.y}px`;
    el.dataset.blockId = block.id;

    if (blockDef && blockDef.type === 'hat') {
      el.classList.add('hat-block');
    }
    if (blockDef && (blockDef.type === 'c' || blockDef.type === 'loop')) {
      el.classList.add('c-block');
    }

    // Construye el contenido del bloque con parámetros editables
    el.innerHTML = this.buildBlockHTML(block, blockDef);

    // Connector points
    el.insertAdjacentHTML('beforeend', `
      <div class="connector top-connector" data-block-id="${block.id}" data-type="top"></div>
      <div class="connector bottom-connector" data-block-id="${block.id}" data-type="bottom"></div>
    `);

    // Delete button
    el.insertAdjacentHTML('beforeend', `
      <button class="block-delete-btn" title="Eliminar bloque" onclick="window.editor.deleteBlock('${block.id}')">×</button>
    `);

    // Drag events
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', (e) => this.startBlockDrag(e, block));
    el.addEventListener('dragend', (e) => this.endBlockDrag(e, block));
    el.addEventListener('click', (e) => {
      if (!e.target.classList.contains('block-delete-btn')) {
        this.selectBlock(block);
      }
    });

    // Parameter input events
    el.querySelectorAll('.block-param').forEach(input => {
      input.addEventListener('change', (e) => {
        block.params[e.target.dataset.param] = e.target.value;
      });
      input.addEventListener('click', (e) => e.stopPropagation());
    });

    this.inner.appendChild(el);
    block.element = el;

    // Animate in
    requestAnimationFrame(() => el.classList.add('block-appear'));

    return el;
  }

  /**
   * Construye el HTML interno del bloque
   */
  buildBlockHTML(block, blockDef) {
    if (!blockDef) return `<span class="block-label">${block.label}</span>`;

    let labelHTML = blockDef.label;

    if (blockDef.params && blockDef.params.length > 0) {
      blockDef.params.forEach(param => {
        const value = block.params[param.name] !== undefined ? block.params[param.name] : param.default;
        let inputHTML = '';

        if (param.type === 'number') {
          inputHTML = `<input type="number" class="block-param" data-param="${param.name}" value="${value}" style="width:${String(value).length * 10 + 30}px">`;
        } else if (param.type === 'text') {
          inputHTML = `<input type="text" class="block-param" data-param="${param.name}" value="${value}" style="width:${Math.max(40, String(value).length * 8 + 10)}px">`;
        } else if (param.type === 'select') {
          const options = param.options.map(o =>
            `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`
          ).join('');
          inputHTML = `<select class="block-param" data-param="${param.name}">${options}</select>`;
        } else if (param.type === 'color') {
          inputHTML = `<input type="color" class="block-param block-color" data-param="${param.name}" value="${value}">`;
        } else if (param.type === 'boolean') {
          inputHTML = `<select class="block-param" data-param="${param.name}">
            <option value="verdadero" ${value === 'verdadero' ? 'selected' : ''}>verdadero</option>
            <option value="falso" ${value === 'falso' ? 'selected' : ''}>falso</option>
          </select>`;
        } else {
          inputHTML = `<input type="text" class="block-param" data-param="${param.name}" value="${value}" style="width:60px">`;
        }

        labelHTML = labelHTML.replace(`{${param.name}}`, inputHTML);
      });
    }

    const category = BLOCK_CATEGORIES[block.category];
    const icon = category ? category.icon : '📦';

    return `<span class="block-label">${icon} ${labelHTML}</span>`;
  }

  /**
   * Inicia el arrastre de un bloque en el workspace
   */
  startBlockDrag(e, block) {
    e.stopPropagation();
    const rect = block.element.getBoundingClientRect();
    this.dragState = {
      block,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: block.x,
      startY: block.y
    };

    block.element.classList.add('dragging');
    e.dataTransfer.setDragImage(block.element, this.dragState.offsetX, this.dragState.offsetY);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('workspaceBlockId', block.id);

    // Disconnect from chain
    if (block.connectedFrom) {
      const parentBlock = this.blocks.find(b => b.id === block.connectedFrom);
      if (parentBlock) {
        parentBlock.connectedTo = null;
      }
      block.connectedFrom = null;
    }
  }

  endBlockDrag(e, block) {
    if (!this.dragState) return;

    const rect = this.workspace.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.dragState.offsetX - this.offset.x) / this.scale;
    const y = (e.clientY - rect.top - this.dragState.offsetY - this.offset.y) / this.scale;

    block.x = Math.max(0, x);
    block.y = Math.max(0, y);
    block.element.style.left = `${block.x}px`;
    block.element.style.top = `${block.y}px`;
    block.element.classList.remove('dragging');

    this.checkSnapConnections(block);
    this.dragState = null;
  }

  /**
   * Comprueba si el bloque debe conectarse a otro (snap)
   */
  checkSnapConnections(movedBlock) {
    const movedDef = BLOCKS_DEFINITION.find(b => b.id === movedBlock.defId);

    this.blocks.forEach(block => {
      if (block.id === movedBlock.id) return;
      if (block.connectedTo) return;

      const dx = movedBlock.x - block.x;
      const dy = movedBlock.y - (block.y + 44);

      if (Math.abs(dx) < this.snapDistance && Math.abs(dy) < this.snapDistance) {
        this.connectBlocks(block, movedBlock);
      }
    });
  }

  /**
   * Conecta dos bloques
   */
  connectBlocks(parentBlock, childBlock) {
    // Disconnect child from previous parent
    if (childBlock.connectedFrom) {
      const prevParent = this.blocks.find(b => b.id === childBlock.connectedFrom);
      if (prevParent) prevParent.connectedTo = null;
    }

    parentBlock.connectedTo = childBlock.id;
    childBlock.connectedFrom = parentBlock.id;

    // Snap position
    childBlock.x = parentBlock.x;
    childBlock.y = parentBlock.y + 44;
    childBlock.element.style.left = `${childBlock.x}px`;
    childBlock.element.style.top = `${childBlock.y}px`;

    // Visual feedback
    parentBlock.element.classList.add('connected');
    childBlock.element.classList.add('connected-child');
    this.showConnectionAnimation(childBlock);
  }

  showConnectionAnimation(block) {
    block.element.classList.add('snap-connect');
    setTimeout(() => block.element.classList.remove('snap-connect'), 400);
  }

  /**
   * Elimina un bloque del workspace
   */
  deleteBlock(blockId) {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    // Desconectar
    if (block.connectedFrom) {
      const parent = this.blocks.find(b => b.id === block.connectedFrom);
      if (parent) parent.connectedTo = null;
    }
    if (block.connectedTo) {
      const child = this.blocks.find(b => b.id === block.connectedTo);
      if (child) child.connectedFrom = null;
    }

    // Animación de salida
    block.element.classList.add('block-remove');
    setTimeout(() => {
      if (block.element.parentNode) {
        block.element.parentNode.removeChild(block.element);
      }
      this.blocks = this.blocks.filter(b => b.id !== blockId);
    }, 200);
  }

  /**
   * Selecciona un bloque
   */
  selectBlock(block) {
    if (this.selectedBlock) {
      this.selectedBlock.element.classList.remove('selected');
    }
    this.selectedBlock = block;
    block.element.classList.add('selected');
  }

  /**
   * Limpia el workspace
   */
  clearWorkspace() {
    this.blocks.forEach(block => {
      if (block.element && block.element.parentNode) {
        block.element.parentNode.removeChild(block.element);
      }
    });
    this.blocks = [];
    this.connections = [];
    this.blockIdCounter = 0;
    this.selectedBlock = null;
  }

  /**
   * Pan del workspace
   */
  startPan(e) {
    if (e.target !== this.workspace && e.target !== this.inner) return;
    this.isPanning = true;
    this.panStart = { x: e.clientX - this.offset.x, y: e.clientY - this.offset.y };
    this.workspace.style.cursor = 'grabbing';
  }

  doPan(e) {
    if (!this.isPanning) return;
    this.offset.x = e.clientX - this.panStart.x;
    this.offset.y = e.clientY - this.panStart.y;
    this.applyTransform();
  }

  stopPan() {
    this.isPanning = false;
    this.workspace.style.cursor = 'default';
  }

  /**
   * Zoom del workspace
   */
  handleZoom(e) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.scale = Math.min(2, Math.max(0.3, this.scale * delta));
    this.applyTransform();
    this.updateZoomIndicator();
  }

  applyTransform() {
    this.inner.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
  }

  updateZoomIndicator() {
    const indicator = document.getElementById('zoom-level');
    if (indicator) {
      indicator.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  /**
   * Renderiza la paleta de bloques
   */
  renderBlocksPalette(mode = 'all', difficulty = 'easy') {
    const palette = document.getElementById('blocks-palette');
    if (!palette) return;

    palette.innerHTML = '';

    Object.entries(BLOCK_CATEGORIES).forEach(([catId, catInfo]) => {
      let blocks = BLOCKS_DEFINITION.filter(b => b.category === catId);

      if (difficulty === 'easy') {
        blocks = blocks.filter(b => !b.advancedOnly);
      }

      if (mode !== 'all') {
        const modeFilter = MODE_BLOCK_FILTERS[mode];
        if (modeFilter && !modeFilter.includes(catId)) return;
      }

      if (blocks.length === 0) return;

      const catSection = document.createElement('div');
      catSection.className = 'palette-category';
      catSection.dataset.category = catId;

      const catHeader = document.createElement('div');
      catHeader.className = 'palette-category-header';
      catHeader.innerHTML = `
        <span class="cat-icon">${catInfo.icon}</span>
        <span class="cat-name">${catInfo.name}</span>
        <span class="cat-count">${blocks.length}</span>
      `;
      catHeader.style.borderColor = catInfo.color.includes('gradient') ? '#667eea' : catInfo.color;
      catHeader.addEventListener('click', () => {
        catSection.classList.toggle('collapsed');
      });

      const catBlocks = document.createElement('div');
      catBlocks.className = 'palette-blocks';

      blocks.forEach(blockDef => {
        const blockEl = this.createPaletteBlock(blockDef, catInfo);
        catBlocks.appendChild(blockEl);
      });

      catSection.appendChild(catHeader);
      catSection.appendChild(catBlocks);
      palette.appendChild(catSection);
    });
  }

  /**
   * Crea un bloque en la paleta
   */
  createPaletteBlock(blockDef, catInfo) {
    const el = document.createElement('div');
    el.className = `palette-block block-${blockDef.category}`;
    el.setAttribute('draggable', 'true');
    el.dataset.blockId = blockDef.id;
    el.title = blockDef.description || blockDef.label;

    const color = catInfo.color.includes('gradient') ? '#667eea' : catInfo.color;
    el.style.borderLeftColor = color;

    // Simplify label for palette
    const simpleLabel = blockDef.label.replace(/\{[^}]+\}/g, '___');
    el.innerHTML = `<span>${catInfo.icon} ${simpleLabel}</span>`;

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('blockId', blockDef.id);
      e.dataTransfer.effectAllowed = 'copy';
      el.classList.add('palette-block-dragging');
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('palette-block-dragging');
    });

    el.addEventListener('click', () => {
      // Add to workspace on click as well
      this.addBlock(blockDef, 50 + Math.random() * 200, 50 + Math.random() * 150);
    });

    return el;
  }

  /**
   * Serializa el workspace a JSON
   */
  serialize() {
    return JSON.stringify({
      blocks: this.blocks.map(b => ({
        id: b.id,
        defId: b.defId,
        category: b.category,
        params: b.params,
        x: b.x,
        y: b.y,
        connectedTo: b.connectedTo,
        connectedFrom: b.connectedFrom
      })),
      offset: this.offset,
      scale: this.scale
    });
  }

  /**
   * Carga un workspace desde JSON
   */
  deserialize(json) {
    try {
      const data = JSON.parse(json);
      this.clearWorkspace();
      this.offset = data.offset || { x: 0, y: 0 };
      this.scale = data.scale || 1;

      if (data.blocks) {
        data.blocks.forEach(blockData => {
          const blockDef = BLOCKS_DEFINITION.find(b => b.id === blockData.defId);
          if (blockDef) {
            const block = this.addBlock(blockDef, blockData.x, blockData.y, blockData.params);
            block.id = blockData.id;
            block.connectedTo = blockData.connectedTo;
            block.connectedFrom = blockData.connectedFrom;
            if (block.element) block.element.id = blockData.id;
          }
        });
      }

      this.applyTransform();
    } catch (e) {
      console.error('Error loading workspace:', e);
    }
  }

  /**
   * Obtiene el script ordenado como secuencia de bloques
   */
  getBlockSequence() {
    const sequences = [];
    const rootBlocks = this.blocks.filter(b => !b.connectedFrom);

    rootBlocks.forEach(root => {
      const sequence = [];
      let current = root;
      while (current) {
        sequence.push(current);
        current = current.connectedTo
          ? this.blocks.find(b => b.id === current.connectedTo)
          : null;
      }
      sequences.push(sequence);
    });

    return sequences;
  }

  /**
   * Añade bloques desde definiciones generadas por IA
   */
  addBlocksFromAI(blockDefs) {
    let y = 60;
    const x = 80;
    blockDefs.forEach((def, i) => {
      const blockDef = BLOCKS_DEFINITION.find(b => b.id === def.id);
      if (blockDef) {
        const block = this.addBlock(blockDef, x, y + i * 50, def.params);
        if (i > 0) {
          const prevBlock = this.blocks[this.blocks.length - 2];
          if (prevBlock) {
            this.connectBlocks(prevBlock, block);
          }
        }
      }
    });
  }

  resetZoom() {
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.applyTransform();
    this.updateZoomIndicator();
  }
}

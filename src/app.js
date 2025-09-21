/**
 * Main application file for Ditema tsa Dinoko Web Tool
 * Integrates phonetic processing with Excalidraw rendering
 */

import { latinToPhonetic, segmentsToIPA, getSyllableBoundaries } from './phonetics/latin-to-ipa.js';
import { parseSyllables, getCVPattern, getStressPattern } from './phonetics/syllable-parser.js';
import { composeWordGlyphs, calculateWordLayout } from './rendering/glyph-composer.js';

// Application state
let currentLanguage = 'zulu';
let currentElements = [];
let excalidrawAPI = null;

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Ditema tsa Dinoko Web Tool...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize Excalidraw
    initializeExcalidraw();
    
    // Load sample text
    loadSampleText();
    
    console.log('Application initialized successfully');
}

/**
 * Set up event listeners for UI interactions
 */
function setupEventListeners() {
    // Language selection
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            console.log(`Language changed to: ${currentLanguage}`);
            // Re-translate if there's text
            const input = document.getElementById('latin-input');
            if (input && input.value.trim()) {
                translateText();
            }
        });
    }
    
    // Text input
    const textInput = document.getElementById('latin-input');
    if (textInput) {
        textInput.addEventListener('input', debounce(translateText, 500));
    }
    
    // Translate button
    const translateBtn = document.getElementById('translate-btn');
    if (translateBtn) {
        translateBtn.addEventListener('click', translateText);
    }
    
    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }
}

/**
 * Initialize Excalidraw for rendering
 */
async function initializeExcalidraw() {
    const container = document.getElementById('excalidraw-container');
    if (!container) {
        console.error('Excalidraw container not found');
        return;
    }
    
    // For now, create a simple canvas-like interface
    // In a full implementation, you would integrate the actual Excalidraw library
    createSimpleCanvas(container);
}

/**
 * Create a simple canvas for rendering (placeholder for Excalidraw)
 * @param {HTMLElement} container - Container element
 */
function createSimpleCanvas(container) {
    // Clear existing content
    container.innerHTML = '';
    
    // Create SVG canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.style.background = '#fafafa';
    svg.style.border = '1px solid #e2e8f0';
    svg.style.borderRadius = '8px';
    
    container.appendChild(svg);
    
    // Store reference for rendering
    excalidrawAPI = {
        svg: svg,
        updateScene: (elements) => updateSVGScene(svg, elements)
    };
}

/**
 * Update SVG scene with new elements
 * @param {SVGElement} svg - SVG element
 * @param {Array} elements - Array of elements to render
 */
function updateSVGScene(svg, elements) {
    // Clear existing elements
    svg.innerHTML = '';
    
    // Add background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#fafafa');
    svg.appendChild(background);
    
    // Render each element
    elements.forEach(element => {
        const svgElement = convertToSVGElement(element);
        if (svgElement) {
            svg.appendChild(svgElement);
        }
    });
}

/**
 * Convert Excalidraw-style element to SVG element
 * @param {Object} element - Element object
 * @returns {SVGElement} SVG element
 */
function convertToSVGElement(element) {
    let svgElement = null;
    
    switch (element.type) {
        case 'line':
            svgElement = createSVGLine(element);
            break;
        case 'ellipse':
            svgElement = createSVGEllipse(element);
            break;
        case 'rectangle':
            svgElement = createSVGRectangle(element);
            break;
        case 'text':
            svgElement = createSVGText(element);
            break;
        default:
            console.warn(`Unknown element type: ${element.type}`);
    }
    
    return svgElement;
}

/**
 * Create SVG line element
 * @param {Object} element - Line element
 * @returns {SVGElement} SVG line or path
 */
function createSVGLine(element) {
    if (!element.points || element.points.length < 2) {
        return null;
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Convert points to path data
    let pathData = `M ${element.x + element.points[0][0]} ${element.y + element.points[0][1]}`;
    for (let i = 1; i < element.points.length; i++) {
        pathData += ` L ${element.x + element.points[i][0]} ${element.y + element.points[i][1]}`;
    }
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', element.strokeColor || '#374151');
    path.setAttribute('stroke-width', element.strokeWidth || 2);
    path.setAttribute('stroke-dasharray', element.strokeStyle === 'dashed' ? '5,5' : 'none');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', (element.opacity || 100) / 100);
    
    return path;
}

/**
 * Create SVG ellipse element
 * @param {Object} element - Ellipse element
 * @returns {SVGElement} SVG ellipse
 */
function createSVGEllipse(element) {
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    
    ellipse.setAttribute('cx', element.x + element.width / 2);
    ellipse.setAttribute('cy', element.y + element.height / 2);
    ellipse.setAttribute('rx', element.width / 2);
    ellipse.setAttribute('ry', element.height / 2);
    ellipse.setAttribute('stroke', element.strokeColor || '#374151');
    ellipse.setAttribute('stroke-width', element.strokeWidth || 2);
    ellipse.setAttribute('fill', element.backgroundColor || 'transparent');
    ellipse.setAttribute('opacity', (element.opacity || 100) / 100);
    
    return ellipse;
}

/**
 * Create SVG rectangle element
 * @param {Object} element - Rectangle element
 * @returns {SVGElement} SVG rectangle
 */
function createSVGRectangle(element) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    
    rect.setAttribute('x', element.x);
    rect.setAttribute('y', element.y);
    rect.setAttribute('width', element.width);
    rect.setAttribute('height', element.height);
    rect.setAttribute('stroke', element.strokeColor || '#374151');
    rect.setAttribute('stroke-width', element.strokeWidth || 2);
    rect.setAttribute('stroke-dasharray', element.strokeStyle === 'dashed' ? '5,5' : 'none');
    rect.setAttribute('fill', element.backgroundColor || 'transparent');
    rect.setAttribute('opacity', (element.opacity || 100) / 100);
    
    return rect;
}

/**
 * Create SVG text element
 * @param {Object} element - Text element
 * @returns {SVGElement} SVG text
 */
function createSVGText(element) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    
    text.setAttribute('x', element.x + element.width / 2);
    text.setAttribute('y', element.y + element.height / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', element.strokeColor || '#374151');
    text.setAttribute('font-size', element.fontSize || 12);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('opacity', (element.opacity || 100) / 100);
    
    // Handle multi-line text
    const lines = (element.text || '').split('\n');
    if (lines.length > 1) {
        lines.forEach((line, index) => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', element.x + element.width / 2);
            tspan.setAttribute('dy', index === 0 ? 0 : '1.2em');
            tspan.textContent = line;
            text.appendChild(tspan);
        });
    } else {
        text.textContent = element.text || '';
    }
    
    return text;
}

/**
 * Main translation function
 */
async function translateText() {
    const input = document.getElementById('latin-input');
    const phoneticOutput = document.getElementById('phonetic-output');
    
    if (!input || !phoneticOutput) {
        console.error('Required DOM elements not found');
        return;
    }
    
    const text = input.value.trim();
    if (!text) {
        clearOutput();
        return;
    }
    
    try {
        console.log(`Translating: "${text}" in ${currentLanguage}`);
        
        // Step 1: Convert to phonetic segments
        const segments = latinToPhonetic(text, currentLanguage);
        console.log('Phonetic segments:', segments);
        
        // Step 2: Parse into syllables
        const syllables = parseSyllables(segments);
        console.log('Syllables:', syllables);
        
        // Step 3: Display phonetic breakdown
        displayPhoneticBreakdown(segments, syllables, phoneticOutput);
        
        // Step 4: Generate Ditema glyphs
        if (syllables.length > 0) {
            await generateDitemaGlyphs(syllables);
        }
        
    } catch (error) {
        console.error('Translation error:', error);
        phoneticOutput.innerHTML = `<span style="color: #dc2626;">Error: ${error.message}</span>`;
    }
}

/**
 * Display phonetic breakdown in the UI
 * @param {Array} segments - Phonetic segments
 * @param {Array} syllables - Syllable objects
 * @param {HTMLElement} container - Output container
 */
function displayPhoneticBreakdown(segments, syllables, container) {
    if (!container) return;
    
    const ipaText = segmentsToIPA(segments);
    const cvPattern = getCVPattern(syllables);
    const stressPattern = getStressPattern(syllables);
    
    let html = `
        <div class="phonetic-breakdown">
            <div class="phonetic-line">
                <strong>IPA:</strong> [${ipaText}]
            </div>
            <div class="cv-pattern">
                <strong>CV Pattern:</strong> ${cvPattern}
            </div>
            <div class="syllables">
                <strong>Syllables:</strong> 
    `;
    
    syllables.forEach((syllable, index) => {
        const stress = stressPattern[index] > 0 ? 'ˈ' : '';
        html += `<span class="syllable">${stress}${syllable.orthographic || syllable.phonetic}</span>`;
        if (index < syllables.length - 1) html += ' · ';
    });
    
    html += '</div></div>';
    
    container.innerHTML = html;
}

/**
 * Generate Ditema glyphs and render them
 * @param {Array} syllables - Array of syllable objects
 */
async function generateDitemaGlyphs(syllables) {
    if (!excalidrawAPI) {
        console.error('Excalidraw API not initialized');
        return;
    }
    
    try {
        // Calculate layout
        const containerBounds = { width: 800, height: 400 };
        const layout = calculateWordLayout(syllables, containerBounds);
        
        // Generate elements for each syllable
        const allElements = [];
        syllables.forEach((syllable, index) => {
            const position = layout.positions[index];
            const syllableElements = composeWordGlyphs([syllable], position.x, position.y, 0, 60);
            allElements.push(...syllableElements);
        });
        
        // Store current elements
        currentElements = allElements;
        
        // Render to canvas
        excalidrawAPI.updateScene(allElements);
        
        console.log(`Generated ${allElements.length} elements for ${syllables.length} syllables`);
        
    } catch (error) {
        console.error('Glyph generation error:', error);
    }
}

/**
 * Clear all output
 */
function clearAll() {
    const input = document.getElementById('latin-input');
    const phoneticOutput = document.getElementById('phonetic-output');
    
    if (input) input.value = '';
    clearOutput();
}

/**
 * Clear output displays
 */
function clearOutput() {
    const phoneticOutput = document.getElementById('phonetic-output');
    if (phoneticOutput) phoneticOutput.innerHTML = '';
    
    if (excalidrawAPI) {
        excalidrawAPI.updateScene([]);
    }
    
    currentElements = [];
}

/**
 * Load sample text for demonstration
 */
function loadSampleText() {
    const samples = {
        zulu: 'ubuntu',
        xhosa: 'ubuntu', 
        sotho: 'motho',
        tswana: 'motho',
        venda: 'muthu'
    };
    
    const input = document.getElementById('latin-input');
    if (input && !input.value.trim()) {
        input.placeholder = `Try "${samples[currentLanguage] || samples.zulu}" or "sawubona"`;
    }
}

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for potential use by other modules
export { translateText, clearAll, currentLanguage, currentElements };
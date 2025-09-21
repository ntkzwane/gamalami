/**
 * Glyph composition for Ditema tsa Dinoko
 * Combines vowel shapes and consonant marks into syllable blocks
 */

import { generateVowelShape, getVowelAnchorPoints, generateOpenVowelModifications } from './vowel-shapes.js';
import { generateConsonantMarks } from './consonant-marks.js';

/**
 * Compose a complete syllable glyph from phonetic segments
 * @param {Object} syllable - Syllable object from syllable parser
 * @param {number} x - X coordinate for syllable center
 * @param {number} y - Y coordinate for syllable center
 * @param {number} size - Base size for the syllable
 * @returns {Array} Array of Excalidraw elements representing the syllable
 */
export function composeSyllableGlyph(syllable, x, y, size = 80) {
    const elements = [];
    
    if (!syllable || !syllable.nucleus) {
        // Handle syllabic consonants or empty syllables
        if (syllable && syllable.segments.length > 0) {
            return composeSyllabicConsonant(syllable, x, y, size);
        }
        return elements;
    }
    
    // Generate the central vowel shape
    const vowelElement = generateVowelShape(syllable.nucleus, x, y, size);
    elements.push(vowelElement);
    
    // Add open vowel modifications for Sotho-Tswana languages
    if (syllable.nucleus.phonetic === 'ɛ' || syllable.nucleus.phonetic === 'ɔ') {
        const openVowelMods = generateOpenVowelModifications(vowelElement, syllable.nucleus.phonetic);
        elements.push(...openVowelMods);
    }
    
    // Get anchor points for consonant attachment
    const anchorPoints = getVowelAnchorPoints(vowelElement, syllable.nucleus.phonetic);
    
    // Add onset consonants
    if (syllable.onset && syllable.onset.length > 0) {
        syllable.onset.forEach((consonant, index) => {
            const consonantElements = generateConsonantMarks(consonant, vowelElement, anchorPoints, index);
            elements.push(...consonantElements);
        });
    }
    
    // Add coda consonants (rare in Bantu languages, but possible)
    if (syllable.coda && syllable.coda.length > 0) {
        syllable.coda.forEach((consonant, index) => {
            // Position coda consonants differently (e.g., bottom-right)
            const codaAnchorPoints = {
                ...anchorPoints,
                // Shift positions for coda
                top: { x: anchorPoints.right.x, y: anchorPoints.top.y },
                bottom: { x: anchorPoints.right.x, y: anchorPoints.bottom.y }
            };
            const consonantElements = generateConsonantMarks(consonant, vowelElement, codaAnchorPoints, index + 10);
            elements.push(...consonantElements);
        });
    }
    
    // Add syllable boundary markers if needed
    const boundaryElements = generateSyllableBoundary(syllable, x, y, size);
    elements.push(...boundaryElements);
    
    return elements;
}

/**
 * Compose syllabic consonant (consonant acting as syllable nucleus)
 * @param {Object} syllable - Syllable object with syllabic consonant
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} size - Base size
 * @returns {Array} Array of Excalidraw elements
 */
function composeSyllabicConsonant(syllable, x, y, size) {
    const elements = [];
    
    if (!syllable.segments || syllable.segments.length === 0) {
        return elements;
    }
    
    // Find the syllabic consonant
    const syllabicConsonant = syllable.segments.find(seg => 
        seg.type === 'consonant' && ['m', 'n', 'l', 'r', 'ŋ'].includes(seg.phonetic)
    ) || syllable.segments[0];
    
    // Create a special mark for syllabic consonants
    const syllabicElement = {
        id: generateId(),
        type: 'ellipse',
        x: x - size/4,
        y: y - size/4,
        width: size/2,
        height: size/2,
        angle: 0,
        strokeColor: '#7c3aed',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 3,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        ditemaType: 'syllabic_consonant',
        phoneticValue: syllabicConsonant.phonetic,
        orthographicValue: syllabicConsonant.orthographic
    };
    
    elements.push(syllabicElement);
    
    // Add consonant-specific mark inside the circle
    const innerMark = createSyllabicConsonantMark(syllabicConsonant, x, y, size/3);
    if (innerMark) {
        elements.push(innerMark);
    }
    
    return elements;
}

/**
 * Create specific mark for syllabic consonant
 * @param {Object} consonant - Consonant segment
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} size - Mark size
 * @returns {Object} Excalidraw element
 */
function createSyllabicConsonantMark(consonant, x, y, size) {
    const baseConsonant = consonant.phonetic.replace(/[ʰʱʼᵐⁿᵑ]/g, '');
    
    let points = [];
    
    switch (baseConsonant) {
        case 'm':
            // Horizontal line
            points = [[0, 0], [size, 0]];
            break;
        case 'n':
            // Diagonal line
            points = [[0, 0], [size, size]];
            break;
        case 'l':
            // Vertical line
            points = [[0, 0], [0, size]];
            break;
        case 'r':
            // Curved line
            points = [[0, 0], [size/2, -size/3], [size, 0]];
            break;
        case 'ŋ':
            // Hook shape
            points = [[0, 0], [size, 0], [size, size/2]];
            break;
        default:
            points = [[0, 0], [size, 0]];
    }
    
    return {
        id: generateId(),
        type: 'line',
        x: x - size/2,
        y: y - size/2,
        width: size,
        height: size,
        angle: 0,
        strokeColor: '#374151',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        points: points,
        lastCommittedPoint: null,
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: null
    };
}

/**
 * Generate syllable boundary markers
 * @param {Object} syllable - Syllable object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} size - Base size
 * @returns {Array} Array of boundary elements
 */
function generateSyllableBoundary(syllable, x, y, size) {
    const elements = [];
    
    // Add subtle boundary box for complex syllables
    if (syllable.onset.length > 1 || syllable.coda.length > 0) {
        const boundaryBox = {
            id: generateId(),
            type: 'rectangle',
            x: x - size * 0.7,
            y: y - size * 0.7,
            width: size * 1.4,
            height: size * 1.4,
            angle: 0,
            strokeColor: '#e5e7eb',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'dashed',
            roughness: 0,
            opacity: 50,
            ditemaType: 'syllable_boundary'
        };
        
        elements.push(boundaryBox);
    }
    
    return elements;
}

/**
 * Compose multiple syllables into a word
 * @param {Array} syllables - Array of syllable objects
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} spacing - Spacing between syllables
 * @param {number} size - Base size for syllables
 * @returns {Array} Array of all Excalidraw elements for the word
 */
export function composeWordGlyphs(syllables, startX = 100, startY = 200, spacing = 120, size = 80) {
    const allElements = [];
    let currentX = startX;
    
    syllables.forEach((syllable, index) => {
        const syllableElements = composeSyllableGlyph(syllable, currentX, startY, size);
        
        // Add syllable label for debugging/learning
        if (syllableElements.length > 0) {
            const label = createSyllableLabel(syllable, currentX, startY + size + 20);
            syllableElements.push(label);
        }
        
        allElements.push(...syllableElements);
        currentX += spacing;
    });
    
    return allElements;
}

/**
 * Create a text label for syllable identification
 * @param {Object} syllable - Syllable object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} Excalidraw text element
 */
function createSyllableLabel(syllable, x, y) {
    const phoneticText = syllable.phonetic || syllable.segments.map(s => s.phonetic).join('');
    const orthographicText = syllable.orthographic || syllable.segments.map(s => s.orthographic).join('');
    
    return {
        id: generateId(),
        type: 'text',
        x: x - 30,
        y: y,
        width: 60,
        height: 25,
        angle: 0,
        strokeColor: '#6b7280',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 1,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 80,
        text: `${orthographicText}\n[${phoneticText}]`,
        fontSize: 12,
        fontFamily: 1,
        textAlign: 'center',
        verticalAlign: 'top',
        containerId: null,
        originalText: `${orthographicText}\n[${phoneticText}]`,
        ditemaType: 'syllable_label'
    };
}

/**
 * Calculate optimal positioning for word layout
 * @param {Array} syllables - Array of syllable objects
 * @param {Object} containerBounds - Container dimensions {width, height}
 * @returns {Object} Layout information {positions, totalWidth, totalHeight}
 */
export function calculateWordLayout(syllables, containerBounds = {width: 800, height: 400}) {
    const syllableWidth = 120; // Including spacing
    const syllableHeight = 160; // Including label space
    const margin = 40;
    
    const totalWidth = syllables.length * syllableWidth;
    const maxWidth = containerBounds.width - (margin * 2);
    
    let layout = {
        positions: [],
        totalWidth: totalWidth,
        totalHeight: syllableHeight,
        rows: 1
    };
    
    if (totalWidth <= maxWidth) {
        // Single row layout
        const startX = (containerBounds.width - totalWidth) / 2 + syllableWidth / 2;
        const y = containerBounds.height / 2;
        
        syllables.forEach((_, index) => {
            layout.positions.push({
                x: startX + (index * syllableWidth),
                y: y
            });
        });
    } else {
        // Multi-row layout
        const syllablesPerRow = Math.floor(maxWidth / syllableWidth);
        const rows = Math.ceil(syllables.length / syllablesPerRow);
        layout.rows = rows;
        layout.totalHeight = rows * syllableHeight;
        
        const startX = margin + syllableWidth / 2;
        const startY = (containerBounds.height - layout.totalHeight) / 2 + syllableHeight / 2;
        
        syllables.forEach((_, index) => {
            const row = Math.floor(index / syllablesPerRow);
            const col = index % syllablesPerRow;
            
            layout.positions.push({
                x: startX + (col * syllableWidth),
                y: startY + (row * syllableHeight)
            });
        });
    }
    
    return layout;
}

/**
 * Generate unique ID for Excalidraw elements
 * @returns {string} Unique ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
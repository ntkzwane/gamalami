/**
 * Vowel shape generation for Ditema tsa Dinoko
 * Creates triangular shapes representing vowel features
 */

/**
 * Generate Excalidraw elements for vowel shapes
 * @param {Object} vowelSegment - Vowel segment from phonetic analysis
 * @param {number} x - X coordinate for center of shape
 * @param {number} y - Y coordinate for center of shape
 * @param {number} size - Size of the triangle (base width)
 * @returns {Object} Excalidraw element for the vowel
 */
export function generateVowelShape(vowelSegment, x, y, size = 60) {
    const vowel = vowelSegment.phonetic;
    const features = vowelSegment.features;
    
    // Determine triangle orientation based on vowel
    let points = [];
    let rotation = 0;
    
    switch (vowel) {
        case 'i':
            // Upward triangle △
            points = getTrianglePoints(x, y, size, 'up');
            break;
            
        case 'a':
            // Downward triangle ▽
            points = getTrianglePoints(x, y, size, 'down');
            break;
            
        case 'u':
            // Upward chevron (upward-pointing V shape)
            points = getTrianglePoints(x, y, size, 'up-chevron');
            break;
            
        case 'o':
            // Rightward chevron (right-pointing V shape)
            points = getTrianglePoints(x, y, size, 'right-chevron');
            break;
            
        case 'e':
            // Leftward chevron (left-pointing V shape)
            points = getTrianglePoints(x, y, size, 'left-chevron');
            break;
            
        case 'ɛ': // open e
            // Leftward triangle ◁
            points = getTrianglePoints(x, y, size, 'left');
            break;
            
        case 'ɔ': // open o
            // Rightward triangle ▷
            points = getTrianglePoints(x, y, size, 'right');
            break;
            
        default:
            // Default to upward triangle
            points = getTrianglePoints(x, y, size, 'up');
    }
    
    // Create the Excalidraw element
    const element = {
        id: generateId(),
        type: 'line',
        x: Math.min(...points.map(p => p[0])) - 10,
        y: Math.min(...points.map(p => p[1])) - 10,
        width: Math.max(...points.map(p => p[0])) - Math.min(...points.map(p => p[0])) + 20,
        height: Math.max(...points.map(p => p[1])) - Math.min(...points.map(p => p[1])) + 20,
        angle: rotation,
        strokeColor: getVowelColor(vowel),
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 3,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        points: points.map(p => [p[0] - Math.min(...points.map(pt => pt[0])) + 10, 
                                p[1] - Math.min(...points.map(pt => pt[1])) + 10]),
        lastCommittedPoint: null,
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: null,
        // Custom properties for Ditema
        ditemaType: 'vowel',
        phoneticValue: vowel,
        orthographicValue: vowelSegment.orthographic,
        features: features
    };
    
    return element;
}

/**
 * Get triangle points for different orientations
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate  
 * @param {number} size - Size of triangle
 * @param {string} orientation - Orientation ('up', 'down', 'left', 'right', etc.)
 * @returns {Array} Array of [x, y] coordinate pairs
 */
function getTrianglePoints(centerX, centerY, size, orientation) {
    const halfSize = size / 2;
    const height = (size * Math.sqrt(3)) / 2;
    const halfHeight = height / 2;
    
    switch (orientation) {
        case 'up':
            return [
                [centerX, centerY - halfHeight],           // top point
                [centerX - halfSize, centerY + halfHeight], // bottom left
                [centerX + halfSize, centerY + halfHeight], // bottom right
                [centerX, centerY - halfHeight]             // back to start
            ];
            
        case 'down':
            return [
                [centerX, centerY + halfHeight],           // bottom point
                [centerX - halfSize, centerY - halfHeight], // top left
                [centerX + halfSize, centerY - halfHeight], // top right
                [centerX, centerY + halfHeight]             // back to start
            ];
            
        case 'left':
            return [
                [centerX - halfHeight, centerY],           // left point
                [centerX + halfHeight, centerY - halfSize], // top right
                [centerX + halfHeight, centerY + halfSize], // bottom right
                [centerX - halfHeight, centerY]             // back to start
            ];
            
        case 'right':
            return [
                [centerX + halfHeight, centerY],           // right point
                [centerX - halfHeight, centerY - halfSize], // top left
                [centerX - halfHeight, centerY + halfSize], // bottom left
                [centerX + halfHeight, centerY]             // back to start
            ];
            
        case 'up-right':
            // Diagonal triangle pointing up-right
            return [
                [centerX + halfHeight, centerY - halfHeight], // top right
                [centerX - halfSize, centerY],                // left
                [centerX, centerY + halfHeight],               // bottom
                [centerX + halfHeight, centerY - halfHeight]   // back to start
            ];
            
        case 'up-left':
            // Diagonal triangle pointing up-left
            return [
                [centerX - halfHeight, centerY - halfHeight], // top left
                [centerX + halfSize, centerY],                // right
                [centerX, centerY + halfHeight],               // bottom
                [centerX - halfHeight, centerY - halfHeight]   // back to start
            ];
            
        case 'up-chevron':
            // Upward-pointing V shape (chevron) for 'u'
            return [
                [centerX - halfSize, centerY + halfHeight],   // bottom left
                [centerX, centerY - halfHeight],              // top point
                [centerX + halfSize, centerY + halfHeight],   // bottom right
                [centerX - halfSize, centerY + halfHeight]    // back to start
            ];
            
        case 'left-chevron':
            // Left-pointing V shape (chevron) for 'e'
            return [
                [centerX + halfHeight, centerY - halfSize],   // top right
                [centerX - halfHeight, centerY],              // left point
                [centerX + halfHeight, centerY + halfSize],   // bottom right
                [centerX + halfHeight, centerY - halfSize]    // back to start
            ];
            
        case 'right-chevron':
            // Right-pointing V shape (chevron) for 'o'
            return [
                [centerX - halfHeight, centerY - halfSize],   // top left
                [centerX + halfHeight, centerY],              // right point
                [centerX - halfHeight, centerY + halfSize],   // bottom left
                [centerX - halfHeight, centerY - halfSize]    // back to start
            ];
            
        default:
            return getTrianglePoints(centerX, centerY, size, 'up');
    }
}

/**
 * Get color for vowel based on phonetic features
 * @param {string} vowel - IPA vowel symbol
 * @returns {string} Hex color code
 */
function getVowelColor(vowel) {
    // Color coding based on vowel height and backness
    switch (vowel) {
        case 'i': return '#2563eb'; // Blue - high front
        case 'e': return '#059669'; // Green - mid front  
        case 'ɛ': return '#dc2626'; // Red - low-mid front
        case 'a': return '#ea580c'; // Orange - low central
        case 'ɔ': return '#9333ea'; // Purple - low-mid back
        case 'o': return '#7c3aed'; // Violet - mid back
        case 'u': return '#1f2937'; // Dark - high back
        default: return '#374151'; // Gray - default
    }
}

/**
 * Generate modifications for open vowels (Sotho-Tswana languages)
 * @param {Object} vowelElement - Base vowel element
 * @param {string} vowel - IPA vowel symbol
 * @returns {Array} Array of additional elements for modifications
 */
export function generateOpenVowelModifications(vowelElement, vowel) {
    const modifications = [];
    
    if (vowel === 'ɛ' || vowel === 'ɔ') {
        // Add small circle or dot to indicate openness
        const centerX = vowelElement.x + vowelElement.width / 2;
        const centerY = vowelElement.y + vowelElement.height / 2;
        
        const dot = {
            id: generateId(),
            type: 'ellipse',
            x: centerX - 3,
            y: centerY - 3,
            width: 6,
            height: 6,
            angle: 0,
            strokeColor: vowelElement.strokeColor,
            backgroundColor: vowelElement.strokeColor,
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            ditemaType: 'vowel_modification',
            modificationType: 'openness'
        };
        
        modifications.push(dot);
    }
    
    return modifications;
}

/**
 * Calculate vowel positioning within syllable block
 * @param {Object} syllable - Syllable object
 * @param {number} baseX - Base X coordinate
 * @param {number} baseY - Base Y coordinate
 * @returns {Object} Position coordinates {x, y}
 */
export function calculateVowelPosition(syllable, baseX, baseY) {
    // Vowel is always central in the syllable block
    return {
        x: baseX,
        y: baseY
    };
}

/**
 * Get vowel anchor points for consonant attachment
 * @param {Object} vowelElement - Vowel element
 * @param {string} vowel - IPA vowel symbol
 * @returns {Object} Anchor points {top, bottom, left, right}
 */
export function getVowelAnchorPoints(vowelElement, vowel) {
    const centerX = vowelElement.x + vowelElement.width / 2;
    const centerY = vowelElement.y + vowelElement.height / 2;
    const size = Math.min(vowelElement.width, vowelElement.height) - 20; // Account for padding
    
    // Calculate anchor points based on triangle orientation
    switch (vowel) {
        case 'i': // upward triangle
            return {
                top: { x: centerX, y: centerY - size/3 },
                bottom: { x: centerX, y: centerY + size/3 },
                left: { x: centerX - size/3, y: centerY + size/6 },
                right: { x: centerX + size/3, y: centerY + size/6 }
            };
            
        case 'a': // downward triangle
            return {
                top: { x: centerX, y: centerY - size/3 },
                bottom: { x: centerX, y: centerY + size/3 },
                left: { x: centerX - size/3, y: centerY - size/6 },
                right: { x: centerX + size/3, y: centerY - size/6 }
            };
            
        case 'u': // left-pointing triangle
            return {
                top: { x: centerX + size/6, y: centerY - size/3 },
                bottom: { x: centerX + size/6, y: centerY + size/3 },
                left: { x: centerX - size/3, y: centerY },
                right: { x: centerX + size/3, y: centerY }
            };
            
        case 'o': // right-pointing triangle
            return {
                top: { x: centerX - size/6, y: centerY - size/3 },
                bottom: { x: centerX - size/6, y: centerY + size/3 },
                left: { x: centerX - size/3, y: centerY },
                right: { x: centerX + size/3, y: centerY }
            };
            
        default:
            return {
                top: { x: centerX, y: centerY - size/3 },
                bottom: { x: centerX, y: centerY + size/3 },
                left: { x: centerX - size/3, y: centerY },
                right: { x: centerX + size/3, y: centerY }
            };
    }
}

/**
 * Generate unique ID for Excalidraw elements
 * @returns {string} Unique ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
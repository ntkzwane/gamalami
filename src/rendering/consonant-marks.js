/**
 * Consonant mark generation for Ditema tsa Dinoko
 * Creates geometric marks positioned relative to vowel triangles
 */

/**
 * Generate Excalidraw elements for consonant marks
 * @param {Object} consonantSegment - Consonant segment from phonetic analysis
 * @param {Object} vowelElement - Associated vowel element for positioning
 * @param {Object} anchorPoints - Vowel anchor points
 * @param {number} index - Index for multiple consonants
 * @returns {Array} Array of Excalidraw elements for the consonant
 */
export function generateConsonantMarks(consonantSegment, vowelElement, anchorPoints, index = 0) {
    const consonant = consonantSegment.phonetic;
    const features = consonantSegment.features;
    const elements = [];
    
    // Determine mark type and position based on consonant features
    const markInfo = getConsonantMarkInfo(consonant, features);
    const position = getConsonantPosition(features, anchorPoints, index);
    
    // Generate base consonant mark
    const baseElement = createConsonantMark(markInfo, position, consonantSegment);
    elements.push(baseElement);
    
    // Add modifications (voice, aspiration, prenasalization, etc.)
    const modifications = generateConsonantModifications(consonantSegment, position, baseElement);
    elements.push(...modifications);
    
    return elements;
}

/**
 * Get consonant mark information based on phonetic features
 * @param {string} consonant - IPA consonant symbol
 * @param {Object} features - Consonant features
 * @returns {Object} Mark information {type, shape, orientation}
 */
function getConsonantMarkInfo(consonant, features) {
    const baseConsonant = consonant.replace(/[ʰʱʼᵐⁿᵑ]/g, '');
    
    // Default mark info
    let markInfo = {
        type: 'line',
        shape: 'straight',
        orientation: 'horizontal',
        length: 40,
        thickness: 3
    };
    
    // Determine mark type based on manner of articulation
    switch (features.manner) {
        case 'plosive':
            markInfo.shape = 'straight';
            markInfo.type = 'line';
            break;
            
        case 'fricative':
            markInfo.shape = 'curved';
            markInfo.type = 'curve';
            break;
            
        case 'nasal':
            markInfo.shape = 'circle';
            markInfo.type = 'circle';
            break;
            
        case 'approximant':
            markInfo.shape = 'curved';
            markInfo.type = 'curve';
            markInfo.thickness = 2;
            break;
            
        case 'affricate':
            markInfo.shape = 'complex';
            markInfo.type = 'compound';
            break;
            
        case 'click':
            markInfo.shape = 'hourglass';
            markInfo.type = 'special';
            break;
    }
    
    // Adjust for specific consonants
    switch (baseConsonant) {
        case 'w':
            markInfo.shape = 'wave';
            markInfo.orientation = 'curved_connector';
            break;
        case 'l':
            markInfo.shape = 'vertical_line';
            markInfo.orientation = 'vertical';
            break;
        case 'r':
            markInfo.shape = 'curved_vertical';
            markInfo.orientation = 'vertical';
            break;
        case 'j':
            markInfo.shape = 'angled';
            markInfo.orientation = 'diagonal';
            break;
        case 'h':
            markInfo.shape = 'dotted';
            markInfo.type = 'dashed_line';
            break;
    }
    
    return markInfo;
}

/**
 * Determine consonant position relative to vowel
 * @param {Object} features - Consonant features
 * @param {Object} anchorPoints - Vowel anchor points
 * @param {number} index - Index for multiple consonants
 * @returns {Object} Position information
 */
function getConsonantPosition(features, anchorPoints, index) {
    let basePosition = 'top'; // Default position
    
    // Position based on place of articulation
    switch (features.place) {
        case 'bilabial':
        case 'labiodental':
            basePosition = 'top';
            break;
        case 'alveolar':
        case 'postalveolar':
            basePosition = 'middle';
            break;
        case 'velar':
        case 'glottal':
            basePosition = 'bottom';
            break;
        case 'dental':
            basePosition = 'top';
            break;
        case 'lateral':
            basePosition = 'left';
            break;
    }
    
    // Adjust for multiple consonants
    if (index > 0) {
        const positions = ['top', 'middle', 'bottom', 'left', 'right'];
        const nextPosition = positions[(positions.indexOf(basePosition) + index) % positions.length];
        basePosition = nextPosition;
    }
    
    // Get actual coordinates
    let coordinates;
    switch (basePosition) {
        case 'top':
            coordinates = anchorPoints.top;
            break;
        case 'bottom':
            coordinates = anchorPoints.bottom;
            break;
        case 'left':
            coordinates = anchorPoints.left;
            break;
        case 'right':
            coordinates = anchorPoints.right;
            break;
        case 'middle':
        default:
            // Position through the center
            coordinates = {
                x: (anchorPoints.left.x + anchorPoints.right.x) / 2,
                y: (anchorPoints.top.y + anchorPoints.bottom.y) / 2
            };
    }
    
    return {
        position: basePosition,
        coordinates: coordinates,
        anchorPoints: anchorPoints
    };
}

/**
 * Create the base consonant mark element
 * @param {Object} markInfo - Mark information
 * @param {Object} position - Position information
 * @param {Object} consonantSegment - Original consonant segment
 * @returns {Object} Excalidraw element
 */
function createConsonantMark(markInfo, position, consonantSegment) {
    const { coordinates } = position;
    const { type, shape, orientation, length, thickness } = markInfo;
    
    let element;
    
    switch (type) {
        case 'line':
            element = createLineElement(coordinates, orientation, length, thickness, shape);
            break;
        case 'curve':
            element = createCurveElement(coordinates, orientation, length, thickness, shape);
            break;
        case 'circle':
            element = createCircleElement(coordinates, length / 3);
            break;
        case 'special':
            element = createSpecialElement(coordinates, shape, length);
            break;
        case 'compound':
            element = createCompoundElement(coordinates, consonantSegment);
            break;
        default:
            element = createLineElement(coordinates, orientation, length, thickness, shape);
    }
    
    // Add Ditema-specific properties
    element.ditemaType = 'consonant';
    element.phoneticValue = consonantSegment.phonetic;
    element.orthographicValue = consonantSegment.orthographic;
    element.features = consonantSegment.features;
    element.strokeColor = getConsonantColor(consonantSegment.features);
    
    return element;
}

/**
 * Create line element for straight consonant marks
 * @param {Object} coordinates - Center coordinates
 * @param {string} orientation - Line orientation
 * @param {number} length - Line length
 * @param {number} thickness - Line thickness
 * @param {string} shape - Line shape variant
 * @returns {Object} Excalidraw line element
 */
function createLineElement(coordinates, orientation, length, thickness, shape) {
    const { x, y } = coordinates;
    let points = [];
    
    switch (orientation) {
        case 'horizontal':
            points = [
                [0, 0],
                [length, 0]
            ];
            break;
        case 'vertical':
            points = [
                [0, 0],
                [0, length]
            ];
            break;
        case 'diagonal':
            points = [
                [0, 0],
                [length * 0.7, length * 0.7]
            ];
            break;
        default:
            points = [
                [0, 0],
                [length, 0]
            ];
    }
    
    return {
        id: generateId(),
        type: 'line',
        x: x - length / 2,
        y: y - thickness / 2,
        width: length,
        height: Math.max(thickness, 20),
        angle: 0,
        strokeColor: '#374151',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: thickness,
        strokeStyle: shape === 'dotted' ? 'dashed' : 'solid',
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
 * Create curve element for fricative consonant marks
 * @param {Object} coordinates - Center coordinates
 * @param {string} orientation - Curve orientation
 * @param {number} length - Curve length
 * @param {number} thickness - Curve thickness
 * @param {string} shape - Curve shape variant
 * @returns {Object} Excalidraw curve element
 */
function createCurveElement(coordinates, orientation, length, thickness, shape) {
    const { x, y } = coordinates;
    let points = [];
    
    // Create curved path
    const controlOffset = length * 0.3;
    
    switch (shape) {
        case 'wave':
            points = [
                [0, 0],
                [length * 0.25, -controlOffset],
                [length * 0.75, controlOffset],
                [length, 0]
            ];
            break;
        case 'curved_vertical':
            points = [
                [0, 0],
                [controlOffset, length * 0.5],
                [0, length]
            ];
            break;
        default:
            points = [
                [0, 0],
                [length * 0.5, -controlOffset],
                [length, 0]
            ];
    }
    
    return {
        id: generateId(),
        type: 'line',
        x: x - length / 2,
        y: y - Math.max(controlOffset, thickness),
        width: length,
        height: Math.max(controlOffset * 2, thickness * 2, 20),
        angle: 0,
        strokeColor: '#374151',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: thickness,
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
 * Create circle element for nasal consonant marks
 * @param {Object} coordinates - Center coordinates
 * @param {number} radius - Circle radius
 * @returns {Object} Excalidraw circle element
 */
function createCircleElement(coordinates, radius) {
    const { x, y } = coordinates;
    
    return {
        id: generateId(),
        type: 'ellipse',
        x: x - radius,
        y: y - radius,
        width: radius * 2,
        height: radius * 2,
        angle: 0,
        strokeColor: '#374151',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100
    };
}

/**
 * Create special element for clicks and unique consonants
 * @param {Object} coordinates - Center coordinates
 * @param {string} shape - Special shape type
 * @param {number} size - Element size
 * @returns {Object} Excalidraw element
 */
function createSpecialElement(coordinates, shape, size) {
    const { x, y } = coordinates;
    
    if (shape === 'hourglass') {
        // Create hourglass shape for clicks
        const points = [
            [0, 0],
            [size * 0.8, 0],
            [size * 0.2, size * 0.5],
            [size * 0.8, size],
            [0, size],
            [size * 0.6, size * 0.5],
            [0, 0]
        ];
        
        return {
            id: generateId(),
            type: 'line',
            x: x - size * 0.4,
            y: y - size * 0.5,
            width: size * 0.8,
            height: size,
            angle: 0,
            strokeColor: '#dc2626', // Red for clicks
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 3,
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
    
    // Default fallback
    return createCircleElement(coordinates, size / 4);
}

/**
 * Create compound element for affricates
 * @param {Object} coordinates - Center coordinates
 * @param {Object} consonantSegment - Consonant segment
 * @returns {Object} Excalidraw element
 */
function createCompoundElement(coordinates, consonantSegment) {
    // For now, create a combination line + curve
    // This could be expanded to create multiple elements
    return createLineElement(coordinates, 'horizontal', 40, 3, 'straight');
}

/**
 * Generate modification marks for consonant features
 * @param {Object} consonantSegment - Consonant segment
 * @param {Object} position - Position information
 * @param {Object} baseElement - Base consonant element
 * @returns {Array} Array of modification elements
 */
function generateConsonantModifications(consonantSegment, position, baseElement) {
    const modifications = [];
    const features = consonantSegment.features;
    const { coordinates } = position;
    
    // Voice marking
    if (features.voice === 'voiced') {
        const voiceMark = {
            id: generateId(),
            type: 'ellipse',
            x: coordinates.x + 15,
            y: coordinates.y - 3,
            width: 4,
            height: 4,
            angle: 0,
            strokeColor: '#059669',
            backgroundColor: '#059669',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            ditemaType: 'consonant_modification',
            modificationType: 'voice'
        };
        modifications.push(voiceMark);
    }
    
    // Aspiration marking
    if (features.aspiration) {
        const aspirationMark = {
            id: generateId(),
            type: 'line',
            x: coordinates.x + 20,
            y: coordinates.y - 5,
            width: 8,
            height: 10,
            angle: 0,
            strokeColor: '#7c3aed',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'dashed',
            roughness: 0,
            opacity: 100,
            points: [[0, 0], [8, 0]],
            ditemaType: 'consonant_modification',
            modificationType: 'aspiration'
        };
        modifications.push(aspirationMark);
    }
    
    // Prenasalization marking
    if (features.prenasalized || consonantSegment.prenasalized) {
        const prenasalMark = {
            id: generateId(),
            type: 'ellipse',
            x: coordinates.x - 20,
            y: coordinates.y - 4,
            width: 8,
            height: 8,
            angle: 0,
            strokeColor: '#ea580c',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 2,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            ditemaType: 'consonant_modification',
            modificationType: 'prenasalization'
        };
        modifications.push(prenasalMark);
    }
    
    // Ejective marking
    if (features.ejective) {
        const ejectiveMark = {
            id: generateId(),
            type: 'line',
            x: coordinates.x,
            y: coordinates.y - 15,
            width: 6,
            height: 6,
            angle: 0,
            strokeColor: '#dc2626',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 2,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            points: [[3, 0], [3, 6]],
            ditemaType: 'consonant_modification',
            modificationType: 'ejective'
        };
        modifications.push(ejectiveMark);
    }
    
    return modifications;
}

/**
 * Get color for consonant based on features
 * @param {Object} features - Consonant features
 * @returns {string} Hex color code
 */
function getConsonantColor(features) {
    // Color coding based on manner of articulation
    switch (features.manner) {
        case 'plosive': return '#374151'; // Gray
        case 'fricative': return '#059669'; // Green
        case 'nasal': return '#2563eb'; // Blue
        case 'approximant': return '#7c3aed'; // Purple
        case 'affricate': return '#dc2626'; // Red
        case 'click': return '#ea580c'; // Orange
        default: return '#6b7280'; // Light gray
    }
}

/**
 * Generate unique ID for Excalidraw elements
 * @returns {string} Unique ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
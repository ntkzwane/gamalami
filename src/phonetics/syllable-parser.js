/**
 * Syllable parsing for CV structure analysis
 * Handles Bantu language syllable patterns
 */

/**
 * Parse phonetic segments into syllable structures
 * @param {Array} segments - Array of phonetic segments from latin-to-ipa.js
 * @returns {Array} Array of syllable objects with CV structure
 */
export function parseSyllables(segments) {
    if (!segments || segments.length === 0) {
        return [];
    }
    
    const syllables = [];
    let currentSyllable = {
        segments: [],
        structure: '',
        onset: [],
        nucleus: null,
        coda: []
    };
    
    let i = 0;
    
    while (i < segments.length) {
        const segment = segments[i];
        
        if (segment.type === 'vowel') {
            // If we already have a nucleus, start new syllable
            if (currentSyllable.nucleus) {
                // Finish current syllable
                syllables.push(completeSyllable(currentSyllable));
                
                // Start new syllable
                currentSyllable = {
                    segments: [],
                    structure: '',
                    onset: [],
                    nucleus: null,
                    coda: []
                };
            }
            
            // Set this vowel as nucleus
            currentSyllable.nucleus = segment;
            currentSyllable.segments.push(segment);
            currentSyllable.structure += 'V';
            
        } else if (segment.type === 'consonant') {
            currentSyllable.segments.push(segment);
            
            if (!currentSyllable.nucleus) {
                // This consonant is part of onset
                currentSyllable.onset.push(segment);
                currentSyllable.structure += 'C';
            } else {
                // This consonant is part of coda
                currentSyllable.coda.push(segment);
                currentSyllable.structure += 'C';
            }
        } else {
            // Unknown or other segments
            currentSyllable.segments.push(segment);
        }
        
        i++;
    }
    
    // Complete final syllable
    if (currentSyllable.segments.length > 0) {
        syllables.push(completeSyllable(currentSyllable));
    }
    
    // Handle syllabic consonants (m̥, n̥, l̥, r̥)
    return processSyllabicConsonants(syllables);
}

/**
 * Complete syllable object with additional properties
 * @param {Object} syllable - Syllable object to complete
 * @returns {Object} Completed syllable object
 */
function completeSyllable(syllable) {
    // Calculate syllable weight
    syllable.weight = calculateSyllableWeight(syllable);
    
    // Determine syllable type
    syllable.type = determineSyllableType(syllable);
    
    // Get phonetic string
    syllable.phonetic = syllable.segments.map(s => s.phonetic).join('');
    syllable.orthographic = syllable.segments.map(s => s.orthographic).join('');
    
    // Analyze consonant clusters
    if (syllable.onset.length > 1) {
        syllable.onsetCluster = analyzeConsonantCluster(syllable.onset);
    }
    if (syllable.coda.length > 1) {
        syllable.codaCluster = analyzeConsonantCluster(syllable.coda);
    }
    
    return syllable;
}

/**
 * Calculate syllable weight (light/heavy)
 * @param {Object} syllable - Syllable object
 * @returns {string} 'light' or 'heavy'
 */
function calculateSyllableWeight(syllable) {
    // Heavy if:
    // 1. Long vowel
    // 2. Vowel + coda consonant(s)
    // 3. Certain vowel qualities
    
    if (syllable.coda.length > 0) {
        return 'heavy';
    }
    
    if (syllable.nucleus && syllable.nucleus.phonetic.length > 1) {
        return 'heavy';
    }
    
    return 'light';
}

/**
 * Determine syllable type based on structure
 * @param {Object} syllable - Syllable object
 * @returns {string} Syllable type
 */
function determineSyllableType(syllable) {
    const structure = syllable.structure;
    
    if (structure === 'V') return 'V';
    if (structure === 'CV') return 'CV';
    if (structure === 'CCV') return 'CCV';
    if (structure === 'CVC') return 'CVC';
    if (structure === 'CCVC') return 'CCVC';
    if (structure === 'VC') return 'VC';
    if (structure === 'VCC') return 'VCC';
    
    // For complex structures
    if (structure.startsWith('C') && structure.includes('V')) {
        return 'complex_CV';
    }
    
    return 'other';
}

/**
 * Analyze consonant clusters for phonotactic constraints
 * @param {Array} consonants - Array of consonant segments
 * @returns {Object} Cluster analysis
 */
function analyzeConsonantCluster(consonants) {
    const analysis = {
        segments: consonants,
        size: consonants.length,
        types: [],
        features: {},
        valid: true
    };
    
    // Analyze each consonant
    consonants.forEach(consonant => {
        analysis.types.push(consonant.features.manner);
        
        // Count feature types
        Object.keys(consonant.features).forEach(feature => {
            if (!analysis.features[feature]) {
                analysis.features[feature] = [];
            }
            analysis.features[feature].push(consonant.features[feature]);
        });
    });
    
    // Check phonotactic validity for Bantu languages
    analysis.valid = isValidBantuCluster(consonants);
    
    return analysis;
}

/**
 * Check if consonant cluster is valid in Bantu languages
 * @param {Array} consonants - Array of consonant segments
 * @returns {boolean} Whether cluster is phonotactically valid
 */
function isValidBantuCluster(consonants) {
    if (consonants.length === 1) return true;
    
    // Common valid patterns in Bantu languages:
    // 1. Prenasalized consonants (NC)
    // 2. Consonant + glide (Cw, Cy)
    // 3. Some fricative + stop combinations
    
    if (consonants.length === 2) {
        const [c1, c2] = consonants;
        
        // Prenasalized pattern
        if (c1.features.manner === 'nasal' && 
            ['plosive', 'fricative', 'affricate'].includes(c2.features.manner)) {
            return true;
        }
        
        // Consonant + glide
        if (c2.features.manner === 'approximant' && 
            ['w', 'j'].includes(c2.phonetic)) {
            return true;
        }
        
        // Click + aspiration/voice
        if (c1.click && c2.features.manner === 'fricative') {
            return true;
        }
    }
    
    // Most other clusters are invalid in typical Bantu phonotactics
    return false;
}

/**
 * Handle syllabic consonants (consonants that can form syllable nuclei)
 * @param {Array} syllables - Array of syllable objects
 * @returns {Array} Processed syllables with syllabic consonants handled
 */
function processSyllabicConsonants(syllables) {
    return syllables.map(syllable => {
        // Check if syllable has no nucleus but has consonants
        if (!syllable.nucleus && syllable.segments.length > 0) {
            // Look for potential syllabic consonants
            const syllabicConsonants = syllable.segments.filter(segment => 
                segment.type === 'consonant' && 
                ['m', 'n', 'l', 'r', 'ŋ'].includes(segment.phonetic)
            );
            
            if (syllabicConsonants.length > 0) {
                // Make the first one syllabic
                const syllabicConsonant = syllabicConsonants[0];
                syllable.nucleus = {
                    ...syllabicConsonant,
                    syllabic: true,
                    type: 'syllabic_consonant'
                };
                
                syllable.type = 'syllabic_C';
                syllable.structure = syllable.structure.replace('C', 'Ṽ'); // Mark syllabic
            }
        }
        
        return syllable;
    });
}

/**
 * Get CV pattern for a word
 * @param {Array} syllables - Array of syllable objects
 * @returns {string} CV pattern string
 */
export function getCVPattern(syllables) {
    return syllables.map(syl => syl.structure).join('.');
}

/**
 * Get stress pattern (basic implementation for Bantu languages)
 * @param {Array} syllables - Array of syllable objects
 * @returns {Array} Array of stress levels (0=unstressed, 1=primary, 2=secondary)
 */
export function getStressPattern(syllables) {
    // Basic Bantu stress pattern: penultimate stress
    const stress = new Array(syllables.length).fill(0);
    
    if (syllables.length >= 2) {
        stress[syllables.length - 2] = 1; // Penultimate stress
    } else if (syllables.length === 1) {
        stress[0] = 1; // Single syllable gets stress
    }
    
    return stress;
}

/**
 * Validate syllable structure against Bantu phonotactics
 * @param {Object} syllable - Syllable object
 * @returns {Object} Validation result with errors/warnings
 */
export function validateSyllable(syllable) {
    const validation = {
        valid: true,
        errors: [],
        warnings: []
    };
    
    // Check for invalid onset clusters
    if (syllable.onset.length > 2) {
        validation.errors.push('Onset cluster too complex for Bantu languages');
        validation.valid = false;
    }
    
    // Check for invalid coda (most Bantu languages prefer open syllables)
    if (syllable.coda.length > 0) {
        validation.warnings.push('Coda consonants are rare in Bantu languages');
    }
    
    // Check for missing nucleus
    if (!syllable.nucleus) {
        validation.errors.push('Syllable missing nucleus (vowel or syllabic consonant)');
        validation.valid = false;
    }
    
    return validation;
}
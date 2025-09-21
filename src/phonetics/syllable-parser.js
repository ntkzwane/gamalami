/**
 * Syllable parsing for CV structure analysis
 * Handles Bantu language syllable patterns
 */

/**
 * Parse phonetic segments into syllable structures following Bantu phonotactics
 * @param {Array} segments - Array of phonetic segments from latin-to-ipa.js
 * @returns {Array} Array of syllable objects with CV structure
 */
export function parseSyllables(segments) {
    if (!segments || segments.length === 0) {
        return [];
    }
    
    // First, handle prenasalized consonants and complex segments
    const processedSegments = preprocessSegments(segments);
    
    // Find vowel positions to establish syllable nuclei
    const vowelPositions = [];
    processedSegments.forEach((segment, index) => {
        if (segment.type === 'vowel' || segment.syllabic) {
            vowelPositions.push(index);
        }
    });
    
    if (vowelPositions.length === 0) {
        // No vowels found, check for syllabic consonants
        return handleSyllabicConsonantsOnly(processedSegments);
    }
    
    const syllables = [];
    
    for (let i = 0; i < vowelPositions.length; i++) {
        const vowelIndex = vowelPositions[i];
        const nextVowelIndex = vowelPositions[i + 1];
        
        const syllable = {
            segments: [],
            structure: '',
            onset: [],
            nucleus: null,
            coda: []
        };
        
        // Set the vowel as nucleus
        syllable.nucleus = processedSegments[vowelIndex];
        syllable.segments.push(processedSegments[vowelIndex]);
        syllable.structure += 'V';
        
        // Determine onset consonants
        if (i === 0) {
            // First syllable: take all consonants before the first vowel
            for (let j = 0; j < vowelIndex; j++) {
                if (processedSegments[j].type === 'consonant') {
                    syllable.onset.push(processedSegments[j]);
                    syllable.segments.unshift(processedSegments[j]);
                    syllable.structure = 'C' + syllable.structure;
                }
            }
        } else {
            // Handle prenasalized consonants specially - they should be split
            const prenasalizedBetween = [];
            for (let j = vowelPositions[i - 1] + 1; j < vowelIndex; j++) {
                if (processedSegments[j].prenasalized) {
                    prenasalizedBetween.push({ index: j, segment: processedSegments[j] });
                }
            }
            
            // If there's a prenasalized consonant, handle it specially
            if (prenasalizedBetween.length > 0) {
                const prenasalized = prenasalizedBetween[0];
                
                // Add just the consonant part (without nasal) to this syllable's onset
                const consonantPart = prenasalized.segment.phonetic.replace(/[ⁿᵐᵑ]/g, '');
                syllable.onset.push({
                    ...prenasalized.segment,
                    phonetic: consonantPart,
                    orthographic: prenasalized.segment.orthographic.replace(/^n/g, ''), // Remove 'n' prefix
                    prenasalized: false
                });
                syllable.segments.unshift(syllable.onset[0]);
                syllable.structure = 'C' + syllable.structure;
                
                // Add the nasal part to the previous syllable's coda (if it exists)
                if (syllables.length > 0) {
                    const prevSyllable = syllables[syllables.length - 1];
                    const nasalPart = {
                        orthographic: 'n',
                        phonetic: 'n',
                        type: 'consonant',
                        features: { manner: 'nasal', place: 'alveolar', voice: 'voiced' }
                    };
                    prevSyllable.coda.push(nasalPart);
                    prevSyllable.segments.push(nasalPart);
                    prevSyllable.structure += 'C';
                    prevSyllable.orthographic += 'n';
                    prevSyllable.phonetic += 'n';
                }
            } else {
                // Regular onset handling
                const onsetStart = findOnsetStart(processedSegments, vowelPositions[i - 1], vowelIndex);
                
                for (let j = onsetStart; j < vowelIndex; j++) {
                    if (processedSegments[j].type === 'consonant' && !processedSegments[j].prenasalized) {
                        syllable.onset.push(processedSegments[j]);
                        syllable.segments.unshift(processedSegments[j]); // Add to beginning
                        syllable.structure = 'C' + syllable.structure;
                    }
                }
            }
        }
        
        // Determine coda (consonants after this vowel, before next vowel)
        // In Bantu languages, codas are rare, so we're conservative here
        const codaEnd = nextVowelIndex ? findCodaEnd(processedSegments, vowelIndex, nextVowelIndex) : processedSegments.length;
        
        for (let j = vowelIndex + 1; j < codaEnd; j++) {
            if (processedSegments[j].type === 'consonant' && !processedSegments[j].prenasalized) {
                // In Bantu languages, most consonants go with the next syllable
                // Only add to coda if it's clearly syllable-final
                if (!nextVowelIndex || j === processedSegments.length - 1) {
                    syllable.coda.push(processedSegments[j]);
                    syllable.segments.push(processedSegments[j]);
                    syllable.structure += 'C';
                }
            }
        }
        
        syllables.push(completeSyllable(syllable));
    }
    
    return syllables;
}

/**
 * Preprocess segments to handle prenasalized consonants and complex sounds
 * @param {Array} segments - Raw phonetic segments
 * @returns {Array} Processed segments
 */
function preprocessSegments(segments) {
    const processed = [];
    
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        // Handle prenasalized consonants as single units - they are indivisible
        if (segment.prenasalized || segment.isComplex) {
            // Mark as complex so it won't be split in syllable parsing
            segment.indivisible = true;
            processed.push(segment);
        }
        // Handle syllabic consonants
        else if (segment.type === 'consonant' && ['m', 'n', 'l', 'r', 'ŋ'].includes(segment.phonetic)) {
            // Check if this could be syllabic (no adjacent vowels)
            const hasAdjacentVowel = (i > 0 && segments[i-1].type === 'vowel') || 
                                   (i < segments.length - 1 && segments[i+1].type === 'vowel');
            
            if (!hasAdjacentVowel) {
                segment.syllabic = true;
            }
            processed.push(segment);
        }
        else {
            processed.push(segment);
        }
    }
    
    return processed;
}

/**
 * Find where the onset for a syllable should start
 * @param {Array} segments - All segments
 * @param {number} prevVowelIndex - Index of previous vowel
 * @param {number} currentVowelIndex - Index of current vowel
 * @returns {number} Start index for onset
 */
function findOnsetStart(segments, prevVowelIndex, currentVowelIndex) {
    const consonantsBetween = currentVowelIndex - prevVowelIndex - 1;
    
    if (consonantsBetween === 0) {
        return currentVowelIndex; // No consonants between vowels
    } else if (consonantsBetween === 1) {
        return prevVowelIndex + 1; // Single consonant goes with next syllable
    } else {
        // Multiple consonants: check for indivisible units
        let splitPoint = prevVowelIndex + 1;
        
        // Look for indivisible consonants (prenasalized, etc.)
        for (let i = prevVowelIndex + 1; i < currentVowelIndex; i++) {
            const segment = segments[i];
            if (segment.indivisible || segment.prenasalized) {
                // This entire consonant unit goes with the next syllable
                // Don't split it
                splitPoint = i;
                break;
            }
        }
        
        // If no indivisible units found, use traditional splitting
        if (splitPoint === prevVowelIndex + 1) {
            splitPoint = prevVowelIndex + 1 + Math.floor(consonantsBetween / 2);
        }
        
        return splitPoint;
    }
}

/**
 * Find where the coda for a syllable should end
 * @param {Array} segments - All segments
 * @param {number} vowelIndex - Index of current vowel
 * @param {number} nextVowelIndex - Index of next vowel
 * @returns {number} End index for coda
 */
function findCodaEnd(segments, vowelIndex, nextVowelIndex) {
    // In Bantu languages, codas are very rare
    // Most consonants go with the following vowel
    return vowelIndex + 1; // No coda in most cases
}

/**
 * Handle cases where there are only syllabic consonants
 * @param {Array} segments - Processed segments
 * @returns {Array} Array of syllable objects
 */
function handleSyllabicConsonantsOnly(segments) {
    return segments.map(segment => {
        if (segment.type === 'consonant' && ['m', 'n', 'l', 'r', 'ŋ'].includes(segment.phonetic)) {
            return completeSyllable({
                segments: [segment],
                structure: 'Ṽ', // Syllabic consonant
                onset: [],
                nucleus: { ...segment, syllabic: true, type: 'syllabic_consonant' },
                coda: []
            });
        }
        return null;
    }).filter(Boolean);
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
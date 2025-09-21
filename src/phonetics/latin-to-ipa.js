/**
 * Latin orthography to IPA/phonetic conversion
 * Handles language-specific orthographic rules
 */

import { getLanguageRules } from './language-rules.js';

/**
 * Convert Latin orthography to phonetic representation
 * @param {string} word - Input word in Latin alphabet
 * @param {string} language - Target language code
 * @returns {Array} Array of phonetic segments
 */
export function latinToPhonetic(word, language = 'zulu') {
    const rules = getLanguageRules(language);
    const cleanWord = word.toLowerCase().trim();
    
    if (!cleanWord) return [];
    
    const segments = [];
    let i = 0;
    
    while (i < cleanWord.length) {
        // Try to match longest possible sequence first
        let matched = false;
        
        // Check for 3-character sequences first (like 'tsh', 'tyh')
        if (i + 2 < cleanWord.length) {
            const trigraph = cleanWord.substring(i, i + 3);
            if (rules.digraphs && rules.digraphs[trigraph]) {
                segments.push({
                    orthographic: trigraph,
                    phonetic: rules.digraphs[trigraph],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.digraphs[trigraph])
                });
                i += 3;
                matched = true;
            }
        }
        
        // Check for 2-character sequences (digraphs, clicks, prenasalized)
        if (!matched && i + 1 < cleanWord.length) {
            const digraph = cleanWord.substring(i, i + 2);
            
            // Check prenasalized consonants first (priority)
            if (rules.prenasalized && rules.prenasalized[digraph]) {
                segments.push({
                    orthographic: digraph,
                    phonetic: rules.prenasalized[digraph],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.prenasalized[digraph]),
                    prenasalized: true
                });
                i += 2;
                matched = true;
            }
            // Check regular digraphs
            else if (rules.digraphs && rules.digraphs[digraph]) {
                segments.push({
                    orthographic: digraph,
                    phonetic: rules.digraphs[digraph],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.digraphs[digraph])
                });
                i += 2;
                matched = true;
            }
            // Check clicks
            else if (rules.clicks && rules.clicks[digraph]) {
                segments.push({
                    orthographic: digraph,
                    phonetic: rules.clicks[digraph],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.clicks[digraph]),
                    click: true
                });
                i += 2;
                matched = true;
            }
        }
        
        // Check single characters
        if (!matched) {
            const char = cleanWord[i];
            
            // Check vowels
            if (rules.vowels[char]) {
                segments.push({
                    orthographic: char,
                    phonetic: rules.vowels[char],
                    type: 'vowel',
                    features: getVowelFeatures(rules.vowels[char])
                });
                matched = true;
            }
            // Check consonants
            else if (rules.consonants[char]) {
                segments.push({
                    orthographic: char,
                    phonetic: rules.consonants[char],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.consonants[char])
                });
                matched = true;
            }
            // Check clicks (single character)
            else if (rules.clicks && rules.clicks[char]) {
                segments.push({
                    orthographic: char,
                    phonetic: rules.clicks[char],
                    type: 'consonant',
                    features: getConsonantFeatures(rules.clicks[char]),
                    click: true
                });
                matched = true;
            }
            // Unknown character - skip or preserve
            else if (char !== ' ') {
                segments.push({
                    orthographic: char,
                    phonetic: char,
                    type: 'unknown',
                    features: {}
                });
                matched = true;
            }
            
            i++;
        }
    }
    
    return segments;
}

/**
 * Get phonetic features for vowels
 * @param {string} vowel - IPA vowel symbol
 * @returns {Object} Feature object
 */
function getVowelFeatures(vowel) {
    const features = {
        type: 'vowel',
        height: 'mid',
        backness: 'central',
        roundness: 'unrounded'
    };
    
    switch (vowel) {
        case 'i':
            features.height = 'high';
            features.backness = 'front';
            break;
        case 'e':
            features.height = 'mid';
            features.backness = 'front';
            break;
        case 'ɛ': // open e
            features.height = 'low-mid';
            features.backness = 'front';
            break;
        case 'a':
            features.height = 'low';
            features.backness = 'central';
            break;
        case 'ɔ': // open o
            features.height = 'low-mid';
            features.backness = 'back';
            features.roundness = 'rounded';
            break;
        case 'o':
            features.height = 'mid';
            features.backness = 'back';
            features.roundness = 'rounded';
            break;
        case 'u':
            features.height = 'high';
            features.backness = 'back';
            features.roundness = 'rounded';
            break;
    }
    
    return features;
}

/**
 * Get phonetic features for consonants
 * @param {string} consonant - IPA consonant symbol
 * @returns {Object} Feature object
 */
function getConsonantFeatures(consonant) {
    const features = {
        type: 'consonant',
        manner: 'plosive',
        place: 'bilabial',
        voice: 'voiceless'
    };
    
    // Remove diacritics for base analysis
    const baseConsonant = consonant.replace(/[ʰʱʼᵐⁿᵑ]/g, '');
    
    // Determine manner of articulation
    if (['p', 'b', 't', 'd', 'k', 'g', 'ǀ', 'ǃ', 'ǁ'].includes(baseConsonant)) {
        features.manner = 'plosive';
    } else if (['f', 'v', 's', 'z', 'ʃ', 'ʒ', 'x', 'h', 'ɬ', 'ɮ'].includes(baseConsonant)) {
        features.manner = 'fricative';
    } else if (['m', 'n', 'ɲ', 'ŋ'].includes(baseConsonant)) {
        features.manner = 'nasal';
    } else if (['w', 'j', 'r', 'l'].includes(baseConsonant)) {
        features.manner = 'approximant';
    } else if (['tʃ', 'dʒ', 'ts', 'dz', 'tɬ'].includes(baseConsonant)) {
        features.manner = 'affricate';
    }
    
    // Determine place of articulation
    if (['p', 'b', 'm'].includes(baseConsonant)) {
        features.place = 'bilabial';
    } else if (['f', 'v'].includes(baseConsonant)) {
        features.place = 'labiodental';
    } else if (['t', 'd', 'n', 's', 'z', 'l', 'r'].includes(baseConsonant)) {
        features.place = 'alveolar';
    } else if (['ʃ', 'ʒ', 'tʃ', 'dʒ', 'ɲ'].includes(baseConsonant)) {
        features.place = 'postalveolar';
    } else if (['k', 'g', 'ŋ', 'x'].includes(baseConsonant)) {
        features.place = 'velar';
    } else if (['h'].includes(baseConsonant)) {
        features.place = 'glottal';
    }
    
    // Determine voicing
    if (['b', 'd', 'g', 'v', 'z', 'ʒ', 'dʒ', 'dz', 'm', 'n', 'ɲ', 'ŋ', 'w', 'j', 'r', 'l'].includes(baseConsonant)) {
        features.voice = 'voiced';
    }
    
    // Handle clicks
    if (['ǀ', 'ǃ', 'ǁ'].includes(baseConsonant)) {
        features.manner = 'click';
        if (baseConsonant === 'ǀ') features.place = 'dental';
        else if (baseConsonant === 'ǃ') features.place = 'alveolar';
        else if (baseConsonant === 'ǁ') features.place = 'lateral';
    }
    
    // Handle diacritics
    if (consonant.includes('ʰ')) features.aspiration = true;
    if (consonant.includes('ʱ')) features.breathy = true;
    if (consonant.includes('ʼ')) features.ejective = true;
    if (consonant.includes('ᵐ') || consonant.includes('ⁿ') || consonant.includes('ᵑ')) {
        features.prenasalized = true;
    }
    
    return features;
}

/**
 * Convert phonetic segments to readable IPA string
 * @param {Array} segments - Array of phonetic segments
 * @returns {string} IPA representation
 */
export function segmentsToIPA(segments) {
    return segments.map(segment => segment.phonetic).join('');
}

/**
 * Get syllable boundaries for phonetic segments
 * @param {Array} segments - Array of phonetic segments
 * @returns {Array} Array of syllable arrays
 */
export function getSyllableBoundaries(segments) {
    const syllables = [];
    let currentSyllable = [];
    
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        // Add segment to current syllable
        currentSyllable.push(segment);
        
        // If this is a vowel, we might end the syllable
        if (segment.type === 'vowel') {
            // Look ahead to see if there's another vowel
            let nextVowelIndex = -1;
            for (let j = i + 1; j < segments.length; j++) {
                if (segments[j].type === 'vowel') {
                    nextVowelIndex = j;
                    break;
                }
            }
            
            if (nextVowelIndex === -1) {
                // No more vowels, add remaining consonants to this syllable
                for (let j = i + 1; j < segments.length; j++) {
                    currentSyllable.push(segments[j]);
                }
                syllables.push([...currentSyllable]);
                break;
            } else {
                // There's another vowel, distribute consonants
                const consonantsBetween = nextVowelIndex - i - 1;
                
                if (consonantsBetween === 0) {
                    // No consonants between vowels, end syllable here
                    syllables.push([...currentSyllable]);
                    currentSyllable = [];
                } else if (consonantsBetween === 1) {
                    // One consonant - goes with next vowel
                    syllables.push([...currentSyllable]);
                    currentSyllable = [];
                } else {
                    // Multiple consonants - split them
                    const splitPoint = Math.ceil(consonantsBetween / 2);
                    
                    // Add first half to current syllable
                    for (let j = 1; j <= splitPoint; j++) {
                        currentSyllable.push(segments[i + j]);
                    }
                    syllables.push([...currentSyllable]);
                    
                    // Start new syllable with remaining consonants
                    currentSyllable = [];
                    for (let j = splitPoint + 1; j <= consonantsBetween; j++) {
                        currentSyllable.push(segments[i + j]);
                    }
                    
                    // Skip to next vowel
                    i = nextVowelIndex - 1; // -1 because loop will increment
                }
            }
        }
    }
    
    // Add any remaining segments as final syllable
    if (currentSyllable.length > 0) {
        syllables.push(currentSyllable);
    }
    
    return syllables;
}
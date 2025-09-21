/**
 * Language-specific phonological rules and orthography mappings
 * for Southern African Bantu languages
 */

export const LANGUAGE_RULES = {
    zulu: {
        name: 'isiZulu',
        family: 'nguni',
        vowels: {
            'a': 'a',
            'e': 'e', 
            'i': 'i',
            'o': 'o',
            'u': 'u'
        },
        // Consonant mappings with IPA equivalents
        consonants: {
            // Plosives
            'p': 'p',
            'b': 'b', 
            't': 't',
            'd': 'd',
            'k': 'k',
            'g': 'g',
            
            // Fricatives
            'f': 'f',
            'v': 'v',
            's': 's',
            'z': 'z',
            'h': 'h',
            
            // Nasals
            'm': 'm',
            'n': 'n',
            
            // Approximants
            'w': 'w',
            'l': 'l',
            'r': 'r',
            'y': 'j',
            'j': 'j'
        },
        // Digraphs and special combinations
        digraphs: {
            'ng': 'ŋ',
            'th': 'tʰ',
            'kh': 'kʰ',
            'ph': 'pʰ',
            'bh': 'bʱ',
            'dl': 'ɮ',
            'hl': 'ɬ',
            'sh': 'ʃ',
            'ny': 'ɲ'
        },
        // Click consonants
        clicks: {
            'c': 'ǀ',  // dental click
            'q': 'ǃ',  // alveolar click  
            'x': 'ǁ'   // lateral click
        },
        // Prenasalized consonants
        prenasalized: {
            'mb': 'ᵐb',
            'nd': 'ⁿd', 
            'ng': 'ᵑg',
            'nj': 'ⁿdʒ',
            'nk': 'ᵑk',
            'nt': 'ⁿt',
            'mp': 'ᵐp'
        }
    },

    xhosa: {
        name: 'isiXhosa',
        family: 'nguni',
        vowels: {
            'a': 'a',
            'e': 'e',
            'i': 'i', 
            'o': 'o',
            'u': 'u'
        },
        consonants: {
            'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
            'f': 'f', 'v': 'v', 's': 's', 'z': 'z', 'h': 'h',
            'm': 'm', 'n': 'n', 'w': 'w', 'l': 'l', 'r': 'r', 'y': 'j'
        },
        digraphs: {
            'ng': 'ŋ', 'th': 'tʰ', 'kh': 'kʰ', 'ph': 'pʰ', 
            'bh': 'bʱ', 'dl': 'ɮ', 'hl': 'ɬ', 'sh': 'ʃ', 'ny': 'ɲ',
            'tsh': 'tʃ', 'tyh': 'tʃʰ'
        },
        clicks: {
            'c': 'ǀ',   // dental click
            'q': 'ǃ',   // alveolar click
            'x': 'ǁ'    // lateral click
        },
        prenasalized: {
            'mb': 'ᵐb', 'nd': 'ⁿd', 'ng': 'ᵑg', 'nj': 'ⁿdʒ',
            'nk': 'ᵑk', 'nt': 'ⁿt', 'mp': 'ᵐp', 'nc': 'ⁿǀ',
            'nq': 'ⁿǃ', 'nx': 'ⁿǁ'
        }
    },

    sotho: {
        name: 'Sesotho',
        family: 'sotho-tswana',
        vowels: {
            'a': 'a',
            'e': 'ɛ',  // open e
            'i': 'i',
            'o': 'ɔ',  // open o
            'u': 'u'
        },
        consonants: {
            'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
            'f': 'f', 's': 's', 'h': 'h', 'm': 'm', 'n': 'n',
            'w': 'w', 'l': 'l', 'r': 'r', 'j': 'j'
        },
        digraphs: {
            'ng': 'ŋ',
            'th': 'tʰ',
            'kh': 'kʰ', 
            'ph': 'pʰ',
            'sh': 'ʃ',
            'ny': 'ɲ',
            'tl': 'tɬʼ',  // ejective lateral
            'ts': 'tsʼ'   // ejective affricate
        },
        prenasalized: {
            'mp': 'ᵐp',
            'nt': 'ⁿt', 
            'nk': 'ᵑk'
        }
    },

    tswana: {
        name: 'Setswana',
        family: 'sotho-tswana',
        vowels: {
            'a': 'a',
            'e': 'ɛ',
            'i': 'i',
            'o': 'ɔ', 
            'u': 'u'
        },
        consonants: {
            'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
            'f': 'f', 's': 's', 'h': 'h', 'm': 'm', 'n': 'n',
            'w': 'w', 'l': 'l', 'r': 'r', 'j': 'j'
        },
        digraphs: {
            'ng': 'ŋ', 'th': 'tʰ', 'kh': 'kʰ', 'ph': 'pʰ',
            'sh': 'ʃ', 'ny': 'ɲ', 'tl': 'tɬʼ', 'ts': 'tsʼ'
        },
        prenasalized: {
            'mp': 'ᵐp', 'nt': 'ⁿt', 'nk': 'ᵑk'
        }
    },

    venda: {
        name: 'TshiVenda',
        family: 'venda',
        vowels: {
            'a': 'a',
            'e': 'e',
            'i': 'i',
            'o': 'o',
            'u': 'u'
        },
        consonants: {
            'p': 'p', 'b': 'b', 't': 't', 'd': 'd', 'k': 'k', 'g': 'g',
            'f': 'f', 'v': 'v', 's': 's', 'z': 'z', 'h': 'h',
            'm': 'm', 'n': 'n', 'w': 'w', 'l': 'l', 'r': 'r'
        },
        digraphs: {
            'ng': 'ŋ', 'th': 'tʰ', 'kh': 'kʰ', 'ph': 'pʰ',
            'sh': 'ʃ', 'zh': 'ʒ', 'ny': 'ɲ', 'fh': 'fʱ',
            'vh': 'vʱ', 'dz': 'dz', 'ts': 'ts'
        },
        prenasalized: {
            'mb': 'ᵐb', 'nd': 'ⁿd', 'ng': 'ᵑg', 'nj': 'ⁿdʒ',
            'nk': 'ᵑk', 'nt': 'ⁿt', 'mp': 'ᵐp'
        }
    }
};

/**
 * Get language rules for a specific language
 */
export function getLanguageRules(language) {
    return LANGUAGE_RULES[language] || LANGUAGE_RULES.zulu;
}

/**
 * Check if a language supports clicks
 */
export function hasClicks(language) {
    const rules = getLanguageRules(language);
    return rules.family === 'nguni';
}

/**
 * Check if a language uses open vowels
 */
export function hasOpenVowels(language) {
    const rules = getLanguageRules(language);
    return rules.family === 'sotho-tswana';
}

/**
 * Get all possible consonant combinations for a language
 */
export function getAllConsonants(language) {
    const rules = getLanguageRules(language);
    const allConsonants = { ...rules.consonants };
    
    // Add digraphs
    Object.assign(allConsonants, rules.digraphs);
    
    // Add clicks if supported
    if (rules.clicks) {
        Object.assign(allConsonants, rules.clicks);
    }
    
    // Add prenasalized
    if (rules.prenasalized) {
        Object.assign(allConsonants, rules.prenasalized);
    }
    
    return allConsonants;
}
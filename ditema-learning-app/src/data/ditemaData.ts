import { Language, PhoneticRules, VowelMap, ConsonantMap, DigraphMap } from '../types/ditema';

// Ditema tsa Dinoko Vowel System
// Based on the four-directional triangle system
export const ditemaVowels: VowelMap = {
  'i': {
    symbol: '△',
    triangle: 'up',
    ipa: 'i',
    description: 'High front unrounded vowel'
  },
  'a': {
    symbol: '▽',
    triangle: 'down', 
    ipa: 'a',
    description: 'Low central vowel'
  },
  'u': {
    symbol: '◁',
    triangle: 'left',
    ipa: 'u',
    description: 'High back rounded vowel'
  },
  'o': {
    symbol: '▷',
    triangle: 'right',
    ipa: 'o',
    description: 'Mid back rounded vowel'
  },
  'e': {
    symbol: '◤',
    triangle: 'up',
    ipa: 'e',
    description: 'Mid front unrounded vowel'
  },
  'ɛ': {
    symbol: '◥',
    triangle: 'down',
    ipa: 'ɛ',
    description: 'Open-mid front unrounded vowel'
  },
  'ɔ': {
    symbol: '◣',
    triangle: 'right',
    ipa: 'ɔ',
    description: 'Open-mid back rounded vowel'
  }
};

// Basic consonant system for Ditema
export const ditemaConsonants: ConsonantMap = {
  'm': {
    symbol: '○',
    mark: { type: 'circle', position: 'inside', size: 'medium' },
    ipa: 'm',
    description: 'Bilabial nasal',
    category: 'nasal'
  },
  'n': {
    symbol: '●',
    mark: { type: 'dot', position: 'inside', size: 'small' },
    ipa: 'n',
    description: 'Alveolar nasal',
    category: 'nasal'
  },
  'p': {
    symbol: '◯',
    mark: { type: 'circle', position: 'edge', size: 'small' },
    ipa: 'p',
    description: 'Bilabial plosive',
    category: 'plosive'
  },
  't': {
    symbol: '·',
    mark: { type: 'dot', position: 'edge', size: 'small' },
    ipa: 't',
    description: 'Alveolar plosive',
    category: 'plosive'
  },
  'k': {
    symbol: '○',
    mark: { type: 'circle', position: 'outside', size: 'small' },
    ipa: 'k',
    description: 'Velar plosive',
    category: 'plosive'
  },
  'b': {
    symbol: '◉',
    mark: { type: 'circle', position: 'inside', size: 'large' },
    ipa: 'b',
    description: 'Bilabial voiced plosive',
    category: 'plosive'
  },
  'd': {
    symbol: '●',
    mark: { type: 'dot', position: 'inside', size: 'large' },
    ipa: 'd',
    description: 'Alveolar voiced plosive',
    category: 'plosive'
  },
  'g': {
    symbol: '◉',
    mark: { type: 'circle', position: 'outside', size: 'large' },
    ipa: 'g',
    description: 'Velar voiced plosive',
    category: 'plosive'
  },
  's': {
    symbol: '—',
    mark: { type: 'line', position: 'edge', size: 'medium' },
    ipa: 's',
    description: 'Alveolar fricative',
    category: 'fricative'
  },
  'h': {
    symbol: '~',
    mark: { type: 'curve', position: 'outside', size: 'medium' },
    ipa: 'h',
    description: 'Glottal fricative',
    category: 'fricative'
  },
  'l': {
    symbol: '|',
    mark: { type: 'line', position: 'inside', size: 'medium' },
    ipa: 'l',
    description: 'Alveolar lateral approximant',
    category: 'liquid'
  },
  'r': {
    symbol: '~',
    mark: { type: 'curve', position: 'inside', size: 'small' },
    ipa: 'r',
    description: 'Alveolar trill',
    category: 'liquid'
  }
};

// Digraphs common in Southern African languages
export const ditemaDigraphs: DigraphMap = {
  'ng': {
    symbol: '◎',
    mark: { type: 'circle', position: 'inside', size: 'large' },
    ipa: 'ŋ',
    description: 'Velar nasal',
    category: 'nasal'
  },
  'th': {
    symbol: '⊡',
    mark: { type: 'dot', position: 'edge', size: 'large' },
    ipa: 'tʰ',
    description: 'Aspirated alveolar plosive',
    category: 'plosive'
  },
  'ph': {
    symbol: '⊚',
    mark: { type: 'circle', position: 'edge', size: 'large' },
    ipa: 'pʰ',
    description: 'Aspirated bilabial plosive',
    category: 'plosive'
  },
  'kh': {
    symbol: '⊛',
    mark: { type: 'circle', position: 'outside', size: 'large' },
    ipa: 'kʰ',
    description: 'Aspirated velar plosive',
    category: 'plosive'
  },
  'hl': {
    symbol: '⊢',
    mark: { type: 'line', position: 'edge', size: 'large' },
    ipa: 'ɬ',
    description: 'Voiceless alveolar lateral fricative',
    category: 'fricative'
  },
  'dl': {
    symbol: '⊣',
    mark: { type: 'line', position: 'inside', size: 'large' },
    ipa: 'ɮ',
    description: 'Voiced alveolar lateral fricative',
    category: 'fricative'
  }
};

// Click consonants for languages like isiZulu
export const clickConsonants: ConsonantMap = {
  'c': { // Dental click
    symbol: '⊕',
    mark: { type: 'circle', position: 'inside', size: 'medium' },
    ipa: 'ǀ',
    description: 'Dental click',
    category: 'click'
  },
  'q': { // Velar click
    symbol: '⊗',
    mark: { type: 'circle', position: 'outside', size: 'medium' },
    ipa: 'ǂ',
    description: 'Palatal click',
    category: 'click'
  },
  'x': { // Lateral click
    symbol: '⊖',
    mark: { type: 'circle', position: 'edge', size: 'medium' },
    ipa: 'ǁ',
    description: 'Lateral click',
    category: 'click'
  }
};

// Language-specific phonetic rules
export const isiZuluRules: PhoneticRules = {
  vowels: ditemaVowels,
  consonants: { ...ditemaConsonants, ...clickConsonants },
  digraphs: ditemaDigraphs,
  specialRules: [
    {
      pattern: 'ng',
      replacement: 'ŋ',
      description: 'Velar nasal in syllable-final position'
    },
    {
      pattern: 'hl',
      replacement: 'ɬ',
      description: 'Voiceless lateral fricative'
    }
  ]
};

export const sesothoRules: PhoneticRules = {
  vowels: ditemaVowels,
  consonants: ditemaConsonants,
  digraphs: ditemaDigraphs,
  specialRules: [
    {
      pattern: 'th',
      replacement: 'tʰ',
      description: 'Aspirated alveolar plosive'
    },
    {
      pattern: 'ph',
      replacement: 'pʰ',
      description: 'Aspirated bilabial plosive'
    }
  ]
};

export const isiXhosaRules: PhoneticRules = {
  vowels: ditemaVowels,
  consonants: { ...ditemaConsonants, ...clickConsonants },
  digraphs: ditemaDigraphs,
  specialRules: [
    {
      pattern: 'hl',
      replacement: 'ɬ',
      description: 'Voiceless lateral fricative'
    },
    {
      pattern: 'dl',
      replacement: 'ɮ',
      description: 'Voiced lateral fricative'
    }
  ]
};

// Supported languages
export const supportedLanguages: Language[] = [
  {
    id: 'isizulu',
    name: 'isiZulu',
    nativeName: 'isiZulu',
    code: 'zu',
    phoneticRules: isiZuluRules
  },
  {
    id: 'sesotho',
    name: 'Sesotho',
    nativeName: 'Sesotho',
    code: 'st',
    phoneticRules: sesothoRules
  },
  {
    id: 'isixhosa',
    name: 'isiXhosa',
    nativeName: 'isiXhosa',
    code: 'xh',
    phoneticRules: isiXhosaRules
  },
  {
    id: 'setswana',
    name: 'Setswana',
    nativeName: 'Setswana',
    code: 'tn',
    phoneticRules: sesothoRules // Similar to Sesotho
  }
];

// Sample words for learning
export const sampleWords = [
  {
    latin: 'ama',
    syllables: ['a', 'ma'],
    meaning: 'mothers',
    difficulty: 1,
    culturalContext: 'A respectful term for mothers in the community'
  },
  {
    latin: 'ubuntu',
    syllables: ['u', 'bu', 'n', 'tu'],
    meaning: 'humanity, compassion',
    difficulty: 3,
    culturalContext: 'A fundamental concept in African philosophy meaning "I am because we are"'
  },
  {
    latin: 'inkosi',
    syllables: ['i', 'n', 'ko', 'si'],
    meaning: 'king, chief',
    difficulty: 2,
    culturalContext: 'Traditional leadership title'
  },
  {
    latin: 'umama',
    syllables: ['u', 'ma', 'ma'],
    meaning: 'my mother',
    difficulty: 2,
    culturalContext: 'Endearing term for one\'s mother'
  }
];
# Ditema tsa Dinoko / Isibheqe Sohlamvu Web Tool

A web application that translates Latin alphabet text to Ditema tsa Dinoko script, a featural syllabary for Southern African Bantu languages. The script uses geometric shapes to represent phonetic features, with triangles for vowels and various marks for consonants.

## Features

### Supported Languages
- **isiZulu** (Nguni family) - includes clicks and prenasalized consonants
- **isiXhosa** (Nguni family) - includes clicks and complex consonant clusters  
- **Sesotho** (Sotho-Tswana family) - uses open vowels (ɛ, ɔ) and ejectives
- **Setswana** (Sotho-Tswana family) - similar to Sesotho with dialectal variations
- **TshiVenda** (Venda family) - unique consonants like "fh" and "vh"

### Core Functionality
- **Phonetic Conversion**: Converts Latin orthography to IPA representation
- **Syllable Analysis**: Breaks words into CV syllable structures
- **Geometric Rendering**: Creates Ditema script using SVG shapes
- **Language-Specific Rules**: Handles different orthographic conventions

## Ditema tsa Dinoko Script System

### Vowel System (Onkamisa)
The script uses triangular shapes for vowels based on articulatory features:

- **i** → △ (upward triangle) - high front vowel
- **a** → ▽ (downward triangle) - low central vowel  
- **u** → ◁ (left-pointing triangle) - high back vowel
- **o** → ▷ (right-pointing triangle) - mid back vowel
- **e** → varies by language group
- **ɛ/ɔ** → modified triangles for open vowels (Sotho-Tswana)

### Consonant System (Ongwaqa)
Consonants are represented by geometric marks positioned relative to vowel triangles:

#### By Manner of Articulation:
- **Plosives** (p, t, k, b, d, g) → straight lines
- **Fricatives** (f, s, x, v, z, h) → curved lines
- **Nasals** (m, n, ng) → circles
- **Approximants** (w, l, r, y) → specialized curved marks
- **Clicks** (c, q, x) → hourglass shapes (Nguni languages only)

#### By Place of Articulation:
- **Bilabial/Labiodental** → positioned above vowel triangle
- **Alveolar/Postalveolar** → positioned through vowel triangle
- **Velar/Glottal** → positioned below vowel triangle

### Articulatory Modifications
- **Voice marking** → small dot or additional mark
- **Prenasalization** → small circle prefix (nt, nk, mb, etc.)
- **Aspiration** → dashed line element (ph, th, kh)
- **Ejectives** → vertical mark (Sotho-Tswana languages)

## Usage

### Basic Translation
1. Select your target language from the dropdown
2. Type text in the Latin alphabet input field
3. View the phonetic breakdown showing IPA transcription and syllable structure
4. See the generated Ditema script in the visual canvas

### Example Words
- **ubuntu** (isiZulu) → "humanity, interconnectedness"
- **motho** (Sesotho) → "person, human being"  
- **sawubona** (isiZulu) → "hello, we see you"

### Language-Specific Features
- **Nguni languages**: Support for clicks (c, q, x) and extensive prenasalization
- **Sotho-Tswana languages**: Open vowel distinctions and ejective consonants
- **TshiVenda**: Unique aspirated fricatives (fh, vh) and specific phonological rules

## Technical Implementation

### Architecture
```
src/
├── phonetics/
│   ├── language-rules.js     # Language-specific mappings
│   ├── latin-to-ipa.js      # Orthography to IPA conversion
│   └── syllable-parser.js   # CV structure analysis
├── rendering/
│   ├── vowel-shapes.js      # Triangle generation for vowels
│   ├── consonant-marks.js   # Geometric marks for consonants
│   └── glyph-composer.js    # Syllable block composition
└── app.js                   # Main application logic
```

### Key Algorithms
1. **Orthographic Parsing**: Handles digraphs, trigraphs, and special combinations
2. **Syllable Boundary Detection**: Identifies CV patterns following Bantu phonotactics
3. **Feature Mapping**: Converts phonetic features to geometric properties
4. **Spatial Positioning**: Places consonant marks relative to vowel triangles

## Development

### Running Locally
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### File Structure
- `index.html` - Main HTML structure
- `styles.css` - Responsive CSS styling  
- `src/` - JavaScript modules
- `package.json` - Project configuration

### Browser Support
- Modern browsers with ES6+ support
- SVG rendering capabilities
- Responsive design for mobile devices

## Educational Value

This tool serves as both a practical translator and educational resource for:
- **Linguistics students** studying featural writing systems
- **Language learners** exploring Southern African languages
- **Researchers** investigating phonetic-to-graphic mappings
- **Cultural preservation** efforts for indigenous scripts

## Future Enhancements

### Phase 2 Features
- Full Excalidraw integration for interactive editing
- Audio pronunciation guides
- Comparative analysis between languages
- Export capabilities (PNG, SVG, PDF)

### Advanced Features  
- Morphological analysis for complex words
- Tone marking system integration
- Historical orthography variants
- Collaborative editing capabilities

## References

- Ditema tsa Dinoko keyboard specification
- International Phonetic Alphabet (IPA) standards
- Southern African language phonological studies
- Featural writing system research

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines on:
- Adding new language support
- Improving phonetic accuracy
- Enhancing visual rendering
- Bug fixes and optimizations
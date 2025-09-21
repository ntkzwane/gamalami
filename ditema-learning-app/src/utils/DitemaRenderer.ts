import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Language, Syllable, Word, DitemaElement, Position } from '../types/ditema';

export class DitemaRenderer {
  private language: Language;
  private canvasWidth: number = 800;
  private canvasHeight: number = 600;
  private elementSpacing: number = 100;

  constructor(language: Language) {
    this.language = language;
  }

  /**
   * Convert Latin text to phonetic representation
   */
  latinToPhonetic(text: string): string {
    let phonetic = text.toLowerCase();
    
    // Apply language-specific rules
    for (const rule of this.language.phoneticRules.specialRules) {
      phonetic = phonetic.replace(new RegExp(rule.pattern, 'g'), rule.replacement);
    }

    return phonetic;
  }

  /**
   * Parse text into syllables
   */
  parseSyllables(text: string): Syllable[] {
    const phonetic = this.latinToPhonetic(text);
    const syllables: Syllable[] = [];
    
    // Simple syllable parsing - in practice, this would be more sophisticated
    let i = 0;
    while (i < phonetic.length) {
      const syllable: Syllable = { vowel: this.language.phoneticRules.vowels['a'] }; // default
      
      // Check for consonant
      if (i < phonetic.length && this.isConsonant(phonetic[i])) {
        const consonantKey = this.findConsonantKey(phonetic[i]);
        if (consonantKey) {
          syllable.consonant = this.language.phoneticRules.consonants[consonantKey] ||
                              this.language.phoneticRules.digraphs[consonantKey];
        }
        i++;
      }
      
      // Find vowel
      if (i < phonetic.length && this.isVowel(phonetic[i])) {
        const vowelKey = this.findVowelKey(phonetic[i]);
        if (vowelKey) {
          syllable.vowel = this.language.phoneticRules.vowels[vowelKey];
        }
        i++;
      }
      
      syllables.push(syllable);
    }
    
    return syllables;
  }

  /**
   * Render syllables as Excalidraw elements
   */
  renderSyllables(syllables: Syllable[]): ExcalidrawElement[] {
    const elements: ExcalidrawElement[] = [];
    
    syllables.forEach((syllable, index) => {
      const position: Position = {
        x: index * this.elementSpacing + 100,
        y: this.canvasHeight / 2
      };
      
      // Render vowel triangle
      const triangleElement = this.createTriangleElement(syllable.vowel.symbol, position);
      elements.push(triangleElement);
      
      // Render consonant mark if present
      if (syllable.consonant) {
        const consonantElement = this.createConsonantElement(
          syllable.consonant, 
          position,
          syllable.vowel.triangle
        );
        elements.push(consonantElement);
      }
    });
    
    return elements;
  }

  /**
   * Render a complete word
   */
  renderWord(word: Word): ExcalidrawElement[] {
    return this.renderSyllables(word.syllables);
  }

  /**
   * Create triangle element for vowel
   */
  private createTriangleElement(symbol: string, position: Position): ExcalidrawElement {
    const trianglePoints = this.getTrianglePoints(symbol, position);
    
    return {
      id: `triangle-${Date.now()}`,
      type: 'freedraw',
      x: position.x - 25,
      y: position.y - 25,
      width: 50,
      height: 50,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'hachure',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      points: trianglePoints,
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      boundElements: [],
      updated: 1,
      link: null,
      locked: false
    };
  }

  /**
   * Create consonant mark element
   */
  private createConsonantElement(
    consonant: any, 
    basePosition: Position, 
    triangleDirection: string
  ): ExcalidrawElement {
    const position = this.getConsonantPosition(basePosition, consonant.mark, triangleDirection);
    
    return {
      id: `consonant-${Date.now()}`,
      type: 'ellipse',
      x: position.x,
      y: position.y,
      width: consonant.mark.size === 'small' ? 10 : consonant.mark.size === 'medium' ? 20 : 30,
      height: consonant.mark.size === 'small' ? 10 : consonant.mark.size === 'medium' ? 20 : 30,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: consonant.mark.type === 'dot' ? '#1e1e1e' : 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      points: [],
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      boundElements: [],
      updated: 1,
      link: null,
      locked: false
    };
  }

  /**
   * Get triangle points based on direction
   */
  private getTrianglePoints(symbol: string, position: Position): number[][] {
    const size = 25;
    
    switch (symbol) {
      case '△': // up
        return [
          [position.x, position.y - size],
          [position.x - size, position.y + size],
          [position.x + size, position.y + size],
          [position.x, position.y - size]
        ];
      case '▽': // down
        return [
          [position.x, position.y + size],
          [position.x - size, position.y - size],
          [position.x + size, position.y - size],
          [position.x, position.y + size]
        ];
      case '◁': // left
        return [
          [position.x - size, position.y],
          [position.x + size, position.y - size],
          [position.x + size, position.y + size],
          [position.x - size, position.y]
        ];
      case '▷': // right
        return [
          [position.x + size, position.y],
          [position.x - size, position.y - size],
          [position.x - size, position.y + size],
          [position.x + size, position.y]
        ];
      default:
        return [
          [position.x, position.y - size],
          [position.x - size, position.y + size],
          [position.x + size, position.y + size],
          [position.x, position.y - size]
        ];
    }
  }

  /**
   * Get consonant position relative to triangle
   */
  private getConsonantPosition(
    basePosition: Position, 
    mark: any, 
    triangleDirection: string
  ): Position {
    let offsetX = 0;
    let offsetY = 0;
    
    switch (mark.position) {
      case 'inside':
        offsetX = 0;
        offsetY = 0;
        break;
      case 'edge':
        offsetX = mark.type === 'circle' ? 15 : 0;
        offsetY = mark.type === 'dot' ? 15 : 0;
        break;
      case 'outside':
        offsetX = 30;
        offsetY = 0;
        break;
    }
    
    return {
      x: basePosition.x + offsetX,
      y: basePosition.y + offsetY
    };
  }

  /**
   * Helper methods
   */
  private isConsonant(char: string): boolean {
    return Object.keys(this.language.phoneticRules.consonants).includes(char) ||
           Object.keys(this.language.phoneticRules.digraphs).includes(char);
  }

  private isVowel(char: string): boolean {
    return Object.keys(this.language.phoneticRules.vowels).includes(char);
  }

  private findConsonantKey(char: string): string | null {
    for (const key of Object.keys(this.language.phoneticRules.consonants)) {
      if (this.language.phoneticRules.consonants[key].ipa === char) {
        return key;
      }
    }
    for (const key of Object.keys(this.language.phoneticRules.digraphs)) {
      if (this.language.phoneticRules.digraphs[key].ipa === char) {
        return key;
      }
    }
    return char;
  }

  private findVowelKey(char: string): string | null {
    for (const key of Object.keys(this.language.phoneticRules.vowels)) {
      if (this.language.phoneticRules.vowels[key].ipa === char) {
        return key;
      }
    }
    return char;
  }

  /**
   * Update language
   */
  setLanguage(language: Language): void {
    this.language = language;
  }

  /**
   * Set canvas dimensions
   */
  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}
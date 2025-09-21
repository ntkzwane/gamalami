import { AudioFile } from '../types/ditema';

export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private audioCache: Map<string, AudioBuffer> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Play a phoneme sound
   */
  async playPhoneme(phoneme: string, language: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAudioContext();
    }

    // For now, we'll use Web Speech API as a fallback
    // In a real implementation, you would load actual audio files
    this.playWithSpeechSynthesis(phoneme, language);
  }

  /**
   * Play a syllable sound
   */
  async playSyllable(syllable: string, language: string): Promise<void> {
    this.playWithSpeechSynthesis(syllable, language);
  }

  /**
   * Play a word sound
   */
  async playWord(word: string, language: string): Promise<void> {
    this.playWithSpeechSynthesis(word, language);
  }

  /**
   * Play a phrase or sentence
   */
  async playPhrase(phrase: string, language: string): Promise<void> {
    this.playWithSpeechSynthesis(phrase, language);
  }

  /**
   * Generate synthetic audio for phonemes
   */
  private async generatePhonemeAudio(phoneme: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      // Create a simple tone based on the phoneme
      const frequency = this.getPhonemeFrequency(phoneme);
      const duration = 0.3; // 300ms
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);

      // Generate a simple sine wave
      for (let i = 0; i < frameCount; i++) {
        const time = i / sampleRate;
        const envelope = Math.exp(-time * 3); // Simple decay envelope
        channelData[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3;
      }

      return audioBuffer;
    } catch (error) {
      console.error('Error generating phoneme audio:', error);
      return null;
    }
  }

  /**
   * Get frequency for a phoneme (simplified mapping)
   */
  private getPhonemeFrequency(phoneme: string): number {
    const frequencyMap: { [key: string]: number } = {
      'a': 220, // A3
      'i': 330, // E4
      'u': 165, // E3
      'o': 247, // B3
      'e': 294, // D4
      'ɛ': 262, // C4
      'ɔ': 196, // G3
      'm': 110, // A2
      'n': 123, // B2
      'p': 82,  // E2
      't': 98,  // G2
      'k': 73,  // D2
      'b': 110, // A2
      'd': 123, // B2
      'g': 98,  // G2
      's': 659, // E5
      'h': 330, // E4
      'l': 220, // A3
      'r': 247, // B3
    };

    return frequencyMap[phoneme] || 220;
  }

  /**
   * Play audio using Web Speech API as fallback
   */
  private playWithSpeechSynthesis(text: string, language: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map language codes to speech synthesis voices
      const languageMap: { [key: string]: string } = {
        'zu': 'zu-ZA', // isiZulu
        'st': 'st-ZA', // Sesotho
        'xh': 'xh-ZA', // isiXhosa
        'tn': 'tn-ZA', // Setswana
      };

      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const targetVoice = voices.find(voice => 
        voice.lang.startsWith(languageMap[language] || 'en')
      );
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  }

  /**
   * Preload audio files for better performance
   */
  async preloadAudio(audioFiles: AudioFile[]): Promise<void> {
    for (const audioFile of audioFiles) {
      try {
        const response = await fetch(audioFile.url);
        const arrayBuffer = await response.arrayBuffer();
        
        if (this.audioContext) {
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.audioCache.set(audioFile.id, audioBuffer);
        }
      } catch (error) {
        console.warn(`Failed to preload audio file ${audioFile.id}:`, error);
      }
    }
  }

  /**
   * Play preloaded audio file
   */
  async playAudioFile(audioId: string): Promise<void> {
    const audioBuffer = this.audioCache.get(audioId);
    if (!audioBuffer || !this.audioContext) {
      console.warn(`Audio file ${audioId} not found or audio context not available`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio file:', error);
    }
  }

  /**
   * Stop all audio playback
   */
  stopAllAudio(): void {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Check if audio is supported
   */
  isAudioSupported(): boolean {
    return this.isInitialized || 'speechSynthesis' in window;
  }

  /**
   * Get available voices for a language
   */
  getAvailableVoices(language: string): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) return [];
    
    const voices = speechSynthesis.getVoices();
    const languageMap: { [key: string]: string } = {
      'zu': 'zu-ZA',
      'st': 'st-ZA', 
      'xh': 'xh-ZA',
      'tn': 'tn-ZA',
    };

    const targetLang = languageMap[language] || 'en-US';
    return voices.filter(voice => voice.lang.startsWith(targetLang));
  }
}

// Create a singleton instance
export const audioSystem = new AudioSystem();
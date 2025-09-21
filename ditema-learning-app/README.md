# Ditema tsa Dinoko Learning Web Application

An interactive web application for learning the Ditema tsa Dinoko script using React and Excalidraw. This progressive learning system combines gamification elements with cultural education to make the beautiful Southern African writing system accessible to modern learners.

## 🌟 Features

### Core Learning Modules

1. **Shape Recognition** - Master vowel triangles and basic consonant marks
2. **Syllable Building** - Combine consonants with vowels using drag-and-drop
3. **Word Construction** - Build complete words from syllables with live rendering
4. **Reading Practice** - Read Ditema text fluently with cultural context

### Technical Features

- **Multi-language Support** - isiZulu, Sesotho, isiXhosa, Setswana
- **Interactive Excalidraw Integration** - Real-time Ditema script rendering
- **Progressive Learning System** - Structured modules with difficulty progression
- **Gamification Elements** - Points, streaks, badges, and achievements
- **Cultural Integration** - Educational content about traditional arts and language
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Toggle between light and dark themes
- **Accessibility Features** - Screen reader compatible with keyboard navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ditema-learning-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📚 About Ditema tsa Dinoko

Ditema tsa Dinoko is a writing system developed to represent Southern African languages using geometric shapes inspired by traditional litema (wall paintings) and beadwork patterns. The script uses:

- **Vowel Triangles** - Four directional triangles (△ ▽ ◁ ▷) for different vowel sounds
- **Consonant Marks** - Various geometric marks positioned relative to vowel triangles
- **Syllabic Structure** - Combines consonants and vowels to form syllables
- **Cultural Significance** - Connects learners to traditional Southern African arts

## 🏗️ Architecture

### Core Components

```
App
├── LanguageSelector (Choose learning language)
├── ProgressTracker (Track learning progress)
├── ModuleSelector (Navigate between modules)
└── CurrentModule (Active learning content)
    ├── ShapeRecognition
    ├── SyllableBuilding
    ├── WordConstruction
    └── ReadingPractice
```

### Key Classes

- **DitemaRenderer** - Converts Latin text to Ditema symbols and renders with Excalidraw
- **AppContext** - Manages global application state
- **PhoneticRules** - Language-specific phonetic mappings

## 🎯 Learning Objectives

### Module 1: Shape Recognition
- Identify vowel triangles and their sounds
- Recognize consonant marks and their positions
- Build foundation for syllable construction

### Module 2: Syllable Building
- Understand consonant-vowel combinations
- Practice drag-and-drop interactions
- Learn syllable construction rules

### Module 3: Word Construction
- Build complete words from syllables
- Learn vocabulary with cultural context
- Practice with progressive difficulty

### Module 4: Reading Practice
- Read Ditema text fluently
- Connect symbols to meanings
- Engage with cultural stories and proverbs

## 🎮 Gamification Elements

- **Points System** - Earn points for correct answers
- **Streaks** - Consecutive correct answers multiply points
- **Achievements** - Unlock badges for milestones
- **Progress Tracking** - Visual progress indicators
- **Cultural Knowledge** - Special achievements for cultural learning

## 🌍 Supported Languages

- **isiZulu** - Including click consonants
- **Sesotho** - With aspirated consonants
- **isiXhosa** - Including lateral fricatives
- **Setswana** - Similar to Sesotho

## 🎨 Design Philosophy

The application follows these design principles:

- **Cultural Respect** - Honors the traditional origins of the script
- **Accessibility First** - Ensures learning is available to everyone
- **Progressive Disclosure** - Introduces complexity gradually
- **Visual Learning** - Emphasizes visual and interactive elements
- **Cultural Context** - Integrates traditional knowledge and values

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Excalidraw** - Interactive drawing and rendering
- **React Router** - Client-side routing
- **Styled Components** - Component-based styling
- **Framer Motion** - Smooth animations

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## ♿ Accessibility Features

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Compatible** - ARIA labels and semantic HTML
- **High Contrast Support** - Dark mode for better visibility
- **Focus Management** - Clear focus indicators
- **Alternative Text** - Descriptive text for visual elements

## 🚀 Deployment

The application can be deployed to any static hosting service:

### Vercel (Recommended)
```bash
npm run build
# Deploy the build folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the build folder to Netlify
```

### Traditional Hosting
```bash
npm run build
# Upload the build folder contents to your web server
```

## 🤝 Contributing

We welcome contributions to improve the Ditema learning experience:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for new features
- Include cultural context in educational content
- Test on multiple devices and browsers
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ditema tsa Dinoko Script** - Created by the Southern African linguistic community
- **Traditional Artists** - Inspiration from litema and beadwork patterns
- **Language Communities** - For sharing their beautiful languages
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support

For questions, suggestions, or support:

- Create an issue in the GitHub repository
- Contact the development team
- Join the community discussions

## 🔮 Future Enhancements

- **Audio System** - Native speaker pronunciation
- **Advanced Exercises** - Complex sentence construction
- **Community Features** - User-generated content
- **Teacher Dashboard** - Classroom management tools
- **Offline Mode** - Learn without internet connection
- **More Languages** - Additional Southern African languages

---

**Made with ❤️ for the preservation and celebration of Southern African languages and cultures.**
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LanguageSelector from './components/LanguageSelector';
import ModuleSelector from './components/ModuleSelector';
import ShapeRecognition from './components/modules/ShapeRecognition';
import SyllableBuilding from './components/modules/SyllableBuilding';
import WordConstruction from './components/modules/WordConstruction';
import ReadingPractice from './components/modules/ReadingPractice';
import ProgressTracker from './components/ProgressTracker';
import Header from './components/Header';
import { useApp } from './context/AppContext';
import './App.css';

function AppContent() {
  const { state } = useApp();

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              !state.selectedLanguage ? (
                <LanguageSelector />
              ) : (
                <ModuleSelector />
              )
            } 
          />
          <Route 
            path="/shape-recognition" 
            element={
              state.selectedLanguage ? (
                <ShapeRecognition />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/syllable-building" 
            element={
              state.selectedLanguage ? (
                <SyllableBuilding />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/word-construction" 
            element={
              state.selectedLanguage ? (
                <WordConstruction />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/reading-practice" 
            element={
              state.selectedLanguage ? (
                <ReadingPractice />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </main>
      {state.userProgress && <ProgressTracker />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;

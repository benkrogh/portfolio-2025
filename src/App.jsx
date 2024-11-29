import React from '/node_modules/.vite/deps/react.js?v=hash';
import BlogIndex from './components/BlogIndex.jsx';
import DesignPrinciples from './components/DesignPrinciples.tsx';
import MusicPlayer from './components/MusicPlayer.jsx';

function App() {
  return (
    <div>
      <BlogIndex />
      <DesignPrinciples />
      <MusicPlayer />
    </div>
  )
}

export default App
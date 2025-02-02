// Create and inject video player controls
function createControlsOverlay() {
    const controlsHTML = `
        <div id="video-enhancer-controls" class="video-enhancer-controls">
            <button data-action="speed-down">🐌</button>
            <button data-action="speed-up">🏃</button>
            <button data-action="volume-down">🔉</button>
            <button data-action="volume-up">🔊</button>
            <button data-action="bass-toggle">🎵</button>
            <button data-action="voice-toggle">🗣️</button>
        </div>
    `;
    
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
        .video-enhancer-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
        }
        .video-enhancer-controls button {
            margin: 0 5px;
            padding: 5px 10px;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 3px;
            cursor: pointer;
        }
        .video-enhancer-controls button:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    
    // Create and append controls
    const controls = document.createElement('div');
    controls.innerHTML = controlsHTML;
    document.body.appendChild(controls.firstElementChild);
    
    return document.getElementById('video-enhancer-controls');
}
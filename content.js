// Wait until the video element is available
function applyEnhancements() {
    let video = document.querySelector("video");
    if (!video) {
        setTimeout(applyEnhancements, 500); // Retry if video isn't found yet
        return;
    }

    // Ensure video controls remain visible
    video.controls = true;

    // Web Audio API for Volume Boost
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioCtx.createMediaElementSource(video);
    let gainNode = audioCtx.createGain();
    let bassFilter = audioCtx.createBiquadFilter();
    let voiceFilter = audioCtx.createBiquadFilter();

    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = 100;
    bassFilter.gain.value = 0;

    voiceFilter.type = "highshelf";
    voiceFilter.frequency.value = 3000;
    voiceFilter.gain.value = 0;

    source.connect(gainNode);
    gainNode.connect(bassFilter);
    bassFilter.connect(voiceFilter);
    voiceFilter.connect(audioCtx.destination);

    // Function to load and apply settings
    function loadAndApplySettings() {
        chrome.storage.sync.get(["speed", "volume", "bass", "voice"], function(data) {
            if (data.speed) video.playbackRate = parseFloat(data.speed);
            if (data.volume) gainNode.gain.value = parseFloat(data.volume) / 100;
            if (data.bass !== undefined) bassFilter.gain.value = data.bass ? 15 : 0;
            if (data.voice !== undefined) voiceFilter.gain.value = data.voice ? 10 : 0;
        });
    }

    // Listen for messages from popup.js
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "applySettings") {
            video.playbackRate = parseFloat(request.speed);
            gainNode.gain.value = parseFloat(request.volume) / 100;
            bassFilter.gain.value = request.bass ? 15 : 0;
            voiceFilter.gain.value = request.voice ? 10 : 0;
        }
    });

    // Handle player control clicks
    controlsContainer.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        switch(action) {
            case 'speed-down':
                video.playbackRate = Math.max(0.5, video.playbackRate - 0.25);
                break;
            case 'speed-up':
                video.playbackRate = Math.min(4, video.playbackRate + 0.25);
                break;
            case 'volume-down':
                gainNode.gain.value = Math.max(0.1, gainNode.gain.value - 0.1);
                break;
            case 'volume-up':
                gainNode.gain.value = Math.min(7, gainNode.gain.value + 0.1);
                break;
            case 'bass-toggle':
                bassFilter.gain.value = bassFilter.gain.value ? 0 : 15;
                break;
            case 'voice-toggle':
                voiceFilter.gain.value = voiceFilter.gain.value ? 0 : 10;
                break;
        }
    });

    // Apply settings when video source changes (for playlists)
    video.addEventListener('loadeddata', loadAndApplySettings);
    
    loadAndApplySettings();
    console.log("Video Enhancer Applied!");
}

// Run the function to apply enhancements
applyEnhancements();

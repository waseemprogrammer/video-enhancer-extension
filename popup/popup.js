document.addEventListener("DOMContentLoaded", function () {
    let speedSlider = document.getElementById("speedSlider");
    let volumeSlider = document.getElementById("volumeSlider");
    let bassBoost = document.getElementById("bassBoost");
    let voiceBoost = document.getElementById("voiceBoost");
    let saveBtn = document.getElementById("saveSettings");
    let resetBtn = document.getElementById("resetSettings");
    let playerControlsBtn = document.getElementById("playerControls");

    // Load saved settings
    chrome.storage.sync.get(["speed", "volume", "bass", "voice"], function (data) {
        speedSlider.value = data.speed || 1;
        volumeSlider.value = data.volume || 100;
        bassBoost.checked = data.bass !== undefined ? data.bass : true;
        voiceBoost.checked = data.voice || false;
        document.getElementById("speedValue").textContent = `${speedSlider.value}x`;
        document.getElementById("volumeValue").textContent = `${volumeSlider.value}%`;
    });

    // Function to send settings to content.js
    function applySettings() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "applySettings",
                speed: speedSlider.value,
                volume: volumeSlider.value,
                bass: bassBoost.checked,
                voice: voiceBoost.checked
            });
        });
    }

    // Function to save settings
    function saveSettings() {
        chrome.storage.sync.set({
            speed: speedSlider.value,
            volume: volumeSlider.value,
            bass: bassBoost.checked,
            voice: voiceBoost.checked
        });
    }

    // Apply settings on slider/input change
    speedSlider.addEventListener("input", function() {
        document.getElementById("speedValue").textContent = `${speedSlider.value}x`;
        applySettings();
        saveSettings();
    });
    volumeSlider.addEventListener("input", function() {
        document.getElementById("volumeValue").textContent = `${volumeSlider.value}%`;
        applySettings();
        saveSettings();
    });
    bassBoost.addEventListener("change", function() {
        applySettings();
        saveSettings();
    });
    voiceBoost.addEventListener("change", function() {
         applySettings();
        saveSettings();
    });
    saveBtn.addEventListener("click", applySettings);
});

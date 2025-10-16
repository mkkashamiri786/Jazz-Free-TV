// Global variables
let video = document.getElementById('videoplayer');
let hls, currentChannel = null;
const channelInfo = document.getElementById('channelInfo');
const playerContainer = document.getElementById('playerContainer');
const playerSpacer = document.getElementById('playerSpacer');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorOverlay = document.getElementById('errorOverlay');
const errorMessage = document.getElementById('errorMessage');
const currentChannelDisplay = document.getElementById('currentChannelDisplay');
const currentChannelName = document.getElementById('currentChannelName');
let retryCount = 0;
const maxRetries = 3;
let channelDisplayTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Add scroll event listener for sticky player
  window.addEventListener('scroll', handleScroll);
  
  // Update channel count
  updateChannelCount();
});

// Handle scroll for sticky player
function handleScroll() {
  const scrollPosition = window.scrollY;
  const playerHeight = playerContainer.offsetHeight;
  
  // Add sticky class when scrolled past the player
  if (scrollPosition > playerHeight) {
    playerContainer.classList.add('sticky');
    playerSpacer.classList.add('active');
  } else {
    playerContainer.classList.remove('sticky');
    playerSpacer.classList.remove('active');
  }
}

// Update channel count display
function updateChannelCount() {
  const channelCount = document.querySelectorAll('.channel-item').length;
  const countElement = document.getElementById('channelCount');
  if (countElement) {
    countElement.textContent = channelCount + '+';
  }
}

// Show loading overlay
function showLoading() {
  loadingOverlay.style.display = 'flex';
  hideError();
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.style.display = 'none';
}

// Show error overlay with message
function showError(message) {
  errorMessage.textContent = message;
  errorOverlay.style.display = 'flex';
}

// Hide error overlay
function hideError() {
  errorOverlay.style.display = 'none';
}

// Change channel function
function changeChannel(channel, el, channelName) {
  // Update channel buttons
  document.querySelectorAll('.channel-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Update grid items
  document.querySelectorAll('.channel-item').forEach(c => c.classList.remove('active'));
  if(el) el.classList.add('active');

  // Show current channel display
  currentChannelName.textContent = channelName;
  currentChannelDisplay.classList.remove('hidden');
  
  // Set timeout to hide channel display after 5 seconds
  if (channelDisplayTimeout) {
    clearTimeout(channelDisplayTimeout);
  }
  channelDisplayTimeout = setTimeout(() => {
    currentChannelDisplay.classList.add('hidden');
  }, 5000);

  // build URL
  let src = channel.startsWith('http') ? 
    (channel.endsWith('.m3u8') ? channel : channel + '/playlist.m3u8') :
    `https://cdn07isb.tamashaweb.com:8087/jazzauth/${channel}/playlist.m3u8`;
  currentChannel = src;

  // destroy old hls
  if(hls){ hls.destroy(); hls=null; }

  showLoading();
  retryCount = 0;

  if(Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      hideLoading();
      // Remove auto-play here - video will not play automatically
      // User must click the play button to start playback
    });
    
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error("Error loading channel:", channelName);
        handleErrorWithRetry();
      }
    });
  } else if(video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    video.addEventListener('loadedmetadata', () => {
      hideLoading();
    });
    // Remove auto-play for Safari as well
  } else {
    alert("Your browser does not support HLS playback.");
  }
}

// Handle errors with retry logic
function handleErrorWithRetry() {
  if (retryCount < maxRetries) {
    retryCount++;
    console.log(`Stream error. Retrying... (Attempt ${retryCount} of ${maxRetries})`);
    showError(`Stream Error! Retrying... (Attempt ${retryCount} of ${maxRetries})`);
    setTimeout(function() {
      if (hls) {
        hls.startLoad();
      }
    }, 2000);
  } else {
    console.error("Maximum retry attempts reached. Stream cannot be loaded.");
    showError("Maximum retry attempts reached. Stream cannot be loaded.");
  }
}

// Retry stream function
function retryStream() {
  retryCount = 0;
  hideError();
  if (hls) {
    hls.startLoad();
  }
}

// Play video function
function playVideo() {
  if (video.paused) {
    video.play().catch(e => {
      console.log("Play prevented:", e);
    });
  }
}

// Seek function with visual feedback
function seek(sec){ 
  video.currentTime += sec; 
  
  // Show visual feedback for seeking
  const indicator = document.createElement('div');
  indicator.style.position = 'absolute';
  indicator.style.bottom = '50%';
  indicator.style.left = '50%';
  indicator.style.transform = 'translate(-50%, -50%)';
  indicator.style.background = 'rgba(0, 0, 0, 0.7)';
  indicator.style.color = 'white';
  indicator.style.padding = '10px 15px';
  indicator.style.borderRadius = '5px';
  indicator.style.zIndex = '100';
  indicator.innerText = sec > 0 ? `+${sec} seconds` : `${sec} seconds`;
  
  document.querySelector('.player-wrap').appendChild(indicator);
  
  setTimeout(() => {
    indicator.remove();
  }, 1000);
}

// Request fullscreen
function requestFS(){ 
  if(video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

// Search channels function
function searchChannels(){
  let q = document.getElementById('searchbar').value.toLowerCase();
  document.querySelectorAll('.channel-item').forEach(i => {
    i.style.display = i.innerText.toLowerCase().includes(q) ? 'block' : 'none';
  });
  
  // Update channel count after search
  updateChannelCount();
}

// Filter by category function
function filterByCategory(category) {
  // Update active category button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  const channelItems = document.querySelectorAll('.channel-item');
  
  channelItems.forEach(item => {
    if (category === 'all') {
      item.style.display = "block";
    } else {
      if (item.dataset.category === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    }
  });
  
  // Update channel count after filtering
  updateChannelCount();
}

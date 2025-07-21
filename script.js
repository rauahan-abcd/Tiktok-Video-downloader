// ✅ Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(() => {
      console.log("✅ Service Worker Registered");
    }).catch(err => {
      console.error("Service Worker registration failed:", err);
    });
  });
}

// ✅ Handle Download
async function startDownload() {
  const url = document.getElementById("url").value.trim();
  const result = document.getElementById("result");

  if (!url) {
    alert("Please enter a TikTok video URL.");
    return;
  }

  // Show loading spinner
  result.innerHTML = `<div class="loader"></div> <span style="margin-left: 10px;">Processing...</span>`;

  try {
    const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data && data.data && data.data.play) {
      const downloadLink = data.data.play;

      // Show download link
      result.innerHTML = `
        <a href="${downloadLink}" download="tiktok_video.mp4" style="color:#00cc88; font-weight:bold;">
          ✅ Click here if download doesn't start
        </a>
      `;

      // Save to local history
      saveToHistory(url, downloadLink);
      loadHistory();

      // Auto-start download after short delay
      setTimeout(() => {
        window.location.href = downloadLink;
      }, 1000);

    } else {
      throw new Error("Invalid or unsupported TikTok video URL.");
    }

  } catch (e) {
    result.innerHTML = `<div style="color:red;">❌ Error: ${e.message}</div>`;
  }
}

// ✅ Save Download History to localStorage
function saveToHistory(inputUrl, downloadUrl) {
  let history = JSON.parse(localStorage.getItem("tiktokHistory")) || [];
  history.unshift({
    inputUrl,
    downloadUrl,
    date: new Date().toISOString()
  });
  // Keep only latest 10 entries
  localStorage.setItem("tiktokHistory", JSON.stringify(history.slice(0, 10)));
}

// ✅ Load and Display History
function loadHistory() {
  const list = document.getElementById("history-list");
  const history = JSON.parse(localStorage.getItem("tiktokHistory")) || [];

  if (list) {
    list.innerHTML = history.map(item => `
      <li>
        <a href="${item.downloadUrl}" target="_blank">🔗 ${new URL(item.inputUrl).hostname + item.inputUrl.slice(-8)}</a>
        <small>(${new Date(item.date).toLocaleString()})</small>
      </li>
    `).join('');
  }
}

// ✅ Load history on page load
loadHistory();
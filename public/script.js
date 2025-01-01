document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("downloadForm");
  const statusEl = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Download wird vorbereitet...";

    const videoUrl = document.getElementById("videoUrl").value;

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        statusEl.textContent = `Fehler: ${error}`;
        return;
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      statusEl.textContent = "Download abgeschlossen.";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Es gab ein Problem beim Download.";
    }
  });
});

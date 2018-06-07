function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module)
    return;
  if (!gameInstance.title) {
    gameInstance.title = document.createElement("div");
    gameInstance.title.innerText = "XPloria";
    gameInstance.title.id = "game-title";
    gameInstance.container.appendChild(gameInstance.title);
  }
  if (!gameInstance.subtitle) {
    gameInstance.subtitle = document.createElement("div");
    gameInstance.subtitle.innerText = "v" + BUILD_ASSETS_VERSION;
    gameInstance.subtitle.id = "game-subtitle";
    gameInstance.title.appendChild(gameInstance.subtitle);
  }
  if (!gameInstance.progress) {    
    gameInstance.progress = document.createElement("div");
    gameInstance.progress.className = "progress " + gameInstance.Module.splashScreenStyle;
    gameInstance.progress.empty = document.createElement("div");
    gameInstance.progress.empty.className = "empty";
    gameInstance.progress.appendChild(gameInstance.progress.empty);
    gameInstance.progress.full = document.createElement("div");
    gameInstance.progress.full.className = "full";
    gameInstance.progress.appendChild(gameInstance.progress.full);
    gameInstance.progress.percent = document.createElement("div");
    gameInstance.progress.percent.id = "loading-percent";
    gameInstance.progress.percent.innerText = "0%";
    gameInstance.progress.appendChild(gameInstance.progress.percent);
    gameInstance.container.appendChild(gameInstance.progress);
  }
  gameInstance.progress.full.style.width = (100 * progress) + "%";
  gameInstance.progress.empty.style.width = (100 * (1 - progress)) + "%";
  if (progress == 1)
    gameInstance.title.style.display = gameInstance.progress.style.display = "none";
}
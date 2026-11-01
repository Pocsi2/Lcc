(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const startAtPageTop = () => {
    if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo(0, 0);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(startAtPageTop), { once: true });
  } else {
    requestAnimationFrame(startAtPageTop);
  }

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
      navigation.classList.toggle("is-open", !open);
    });
    navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      navigation.classList.remove("is-open");
    }));
  }

  const flowsPanel = document.querySelector("#flujos");
  const flowsToggles = [...document.querySelectorAll(".flows-toggle")];
  const setFlowsOpen = open => {
    if (!flowsPanel) return;
    flowsPanel.hidden = !open;
    flowsToggles.forEach(button => {
      button.setAttribute("aria-expanded", String(open));
      const icon = button.querySelector("span");
      if (icon) icon.textContent = open ? "−" : "＋";
    });
  };
  flowsToggles.forEach(button => button.addEventListener("click", () => {
    const open = flowsPanel?.hidden ?? true;
    setFlowsOpen(open);
    if (open) flowsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  navigation?.querySelector('a[href="#flujos"]')?.addEventListener("click", event => {
    event.preventDefault();
    setFlowsOpen(true);
    flowsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const film = document.querySelector(".film-frame iframe");
  const audioGate = document.querySelector(".audio-gate");
  const audioGateContinue = audioGate?.querySelector(".audio-gate-continue");
  let filmPlayer = null;
  let audioAccepted = false;
  audioGate?.addEventListener("cancel", event => event.preventDefault());
  audioGateContinue?.addEventListener("click", () => {
    if (!filmPlayer) return;
    audioAccepted = true;
    filmPlayer.setVolume(100);
    filmPlayer.unMute();
    filmPlayer.playVideo();
    audioGate?.close();
  });
  if (film) {
    const apiScript = document.createElement("script");
    apiScript.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => {
      const mainUrl = new URL(film.src);
      mainUrl.searchParams.set("origin", window.location.origin);
      mainUrl.searchParams.set("autoplay", "1");
      mainUrl.searchParams.set("mute", "0");
      mainUrl.searchParams.set("start", "0");
      film.src = mainUrl.toString();
      new YT.Player(film, {
        events: {
          onReady: event => {
            filmPlayer = event.target;
            if (audioGateContinue) audioGateContinue.disabled = false;
            event.target.unMute();
            event.target.setVolume(100);
            event.target.seekTo(0, true);
            event.target.playVideo();
          },
          onAutoplayBlocked: () => {
            if (!audioAccepted && audioGate && !audioGate.open) audioGate.showModal();
          },
        }
      });
    };
    document.head.append(apiScript);
  }

  const cinema = document.querySelector(".cinema-modal");
  const cinemaFrame = cinema?.querySelector(".cinema-screen iframe");
  const cinemaTitle = cinema?.querySelector(".cinema-title");
  const cinemaIndex = cinema?.querySelector(".cinema-index");
  const cinemaClose = cinema?.querySelector(".cinema-close");
  const cards = [...document.querySelectorAll(".film-card")];
  cards.forEach((card, index) => {
    const trigger = card.querySelector(".film-hit-area");
    const source = card.querySelector("iframe");
    if (!trigger || !source || !cinema || !cinemaFrame) return;
    trigger.addEventListener("click", () => {
      const videoUrl = new URL(source.src);
      videoUrl.searchParams.set("autoplay", "1");
      videoUrl.searchParams.set("controls", "1");
      videoUrl.searchParams.set("mute", "0");
      videoUrl.searchParams.set("playsinline", "1");
      videoUrl.searchParams.set("rel", "0");
      cinemaFrame.src = videoUrl.toString();
      cinemaFrame.title = source.title;
      if (cinemaTitle) cinemaTitle.textContent = source.title;
      if (cinemaIndex) cinemaIndex.textContent = String(index + 1).padStart(2, "0");
      if (!cinema.open) cinema.showModal();
      cinemaClose?.focus();
    });
  });
  cinemaClose?.addEventListener("click", () => cinema?.close());
  cinema?.addEventListener("click", event => {
    if (event.target === cinema) cinema.close();
  });
  cinema?.addEventListener("close", () => {
    if (cinemaFrame) cinemaFrame.src = "about:blank";
  });
})();

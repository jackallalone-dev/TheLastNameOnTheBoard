const ROUNDS = [
  {
    category: "World-Changing Scientists",
    names: ["CURIE", "DARWIN", "EINSTEIN", "FARADAY", "HOPPER", "NEWTON", "TESLA", "TURING"],
    clues: [
      { answer: "NEWTON", text: "I described the three laws of motion and universal gravitation." },
      { answer: "CURIE", text: "I became the first person to win Nobel Prizes in two different scientific fields." },
      { answer: "DARWIN", text: "My work on natural selection transformed biology." },
      { answer: "TESLA", text: "I became famous for my work with alternating-current electrical systems." },
      { answer: "HOPPER", text: "I was a computer pioneer and helped popularize the idea of machine-independent programming languages." },
      { answer: "FARADAY", text: "My experiments linked electricity and magnetism, including electromagnetic induction." },
      { answer: "TURING", text: "My work shaped computer science, and I helped break wartime codes at Bletchley Park." }
    ],
    survivor: "EINSTEIN",
    finalText: "The last name on the board should belong to the physicist associated with relativity and E = mc²."
  },
  {
    category: "Classic Literature",
    names: ["AUSTEN", "DICKENS", "HEMINGWAY", "HOMER", "ORWELL", "SHAKESPEARE", "SHELLEY", "TOLKIEN"],
    clues: [
      { answer: "AUSTEN", text: "I wrote Pride and Prejudice." },
      { answer: "ORWELL", text: "I wrote Nineteen Eighty-Four and Animal Farm." },
      { answer: "SHELLEY", text: "I wrote Frankenstein." },
      { answer: "DICKENS", text: "I wrote Great Expectations and A Christmas Carol." },
      { answer: "HEMINGWAY", text: "I wrote The Old Man and the Sea." },
      { answer: "HOMER", text: "Tradition credits me with the Iliad and the Odyssey." },
      { answer: "TOLKIEN", text: "I created Middle-earth and wrote The Lord of the Rings." }
    ],
    survivor: "SHAKESPEARE",
    finalText: "The last name on the board should belong to the playwright behind Hamlet, Macbeth, and Romeo and Juliet."
  },
  {
    category: "Inventors & Innovators",
    names: ["BELL", "BENZ", "DAGUERRE", "EDISON", "FULTON", "GUTENBERG", "MORSE", "WRIGHT"],
    clues: [
      { answer: "GUTENBERG", text: "I introduced movable-type printing to Europe on a transformative scale." },
      { answer: "BELL", text: "I am closely associated with the development and patenting of the telephone." },
      { answer: "MORSE", text: "A famous dot-and-dash communication code bears my name." },
      { answer: "DAGUERRE", text: "An early practical photographic process was named after me." },
      { answer: "BENZ", text: "I built a pioneering practical automobile powered by an internal-combustion engine." },
      { answer: "FULTON", text: "I helped make commercial steamboat travel successful in the United States." },
      { answer: "EDISON", text: "I developed commercially practical systems for electric light and held a huge number of patents." }
    ],
    survivor: "WRIGHT",
    finalText: "The last name on the board should belong to the brothers credited with the first successful powered airplane flight."
  },
  {
    category: "Artists Who Changed The Canvas",
    names: ["DALI", "DEGAS", "KAHLO", "MATISSE", "MONET", "PICASSO", "REMBRANDT", "VAN GOGH"],
    clues: [
      { answer: "MONET", text: "My painting Impression, Sunrise helped give Impressionism its name." },
      { answer: "DALI", text: "Melting clocks became one of the most famous images associated with my Surrealist work." },
      { answer: "KAHLO", text: "I am known for intensely personal self-portraits rooted in Mexican identity and experience." },
      { answer: "DEGAS", text: "I repeatedly painted and sculpted dancers and scenes from the ballet." },
      { answer: "MATISSE", text: "I was a leading figure of Fauvism and later made celebrated paper cut-outs." },
      { answer: "REMBRANDT", text: "The Night Watch is one of my best-known paintings." },
      { answer: "PICASSO", text: "I co-founded Cubism and painted Guernica." }
    ],
    survivor: "VAN GOGH",
    finalText: "The last name on the board should belong to the artist who painted The Starry Night."
  }
];

const els = {
  board: document.querySelector("#board"),
  startBtn: document.querySelector("#startBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  score: document.querySelector("#score"),
  streak: document.querySelector("#streak"),
  lives: document.querySelector("#lives"),
  bestScore: document.querySelector("#bestScore"),
  roundLabel: document.querySelector("#roundLabel"),
  categoryTitle: document.querySelector("#categoryTitle"),
  remainingCount: document.querySelector("#remainingCount"),
  clueText: document.querySelector("#clueText"),
  clueHint: document.querySelector("#clueHint"),
  howToBtn: document.querySelector("#howToBtn"),
  howToDialog: document.querySelector("#howToDialog"),
  resultDialog: document.querySelector("#resultDialog"),
  resultEyebrow: document.querySelector("#resultEyebrow"),
  resultIcon: document.querySelector("#resultIcon"),
  resultTitle: document.querySelector("#resultTitle"),
  resultCopy: document.querySelector("#resultCopy"),
  finalScore: document.querySelector("#finalScore"),
  playAgainBtn: document.querySelector("#playAgainBtn")
};

let state = null;

function freshState() {
  return {
    roundIndex: 0,
    clueIndex: 0,
    score: 0,
    streak: 0,
    lives: 3,
    activeNames: [],
    locked: false,
    started: false,
    finalPhase: false
  };
}

function bestScore() {
  return Number(localStorage.getItem("lastNameBoardBest") || 0);
}

function setBestScore(value) {
  if (value > bestScore()) localStorage.setItem("lastNameBoardBest", String(value));
}

function renderHud() {
  els.score.textContent = state.score.toLocaleString();
  els.streak.textContent = state.streak;
  els.lives.textContent = [0, 1, 2].map(i => i < state.lives ? "●" : "○").join(" ");
  els.lives.setAttribute("aria-label", `${state.lives} ${state.lives === 1 ? "life" : "lives"}`);
  els.bestScore.textContent = bestScore().toLocaleString();
}

function setupRound() {
  const round = ROUNDS[state.roundIndex];
  state.clueIndex = 0;
  state.finalPhase = false;
  state.activeNames = shuffle([...round.names]);
  els.roundLabel.textContent = `Round ${state.roundIndex + 1} of ${ROUNDS.length}`;
  els.categoryTitle.textContent = round.category;
  els.remainingCount.textContent = state.activeNames.length;
  renderBoard();
  showClue();
}

function renderBoard() {
  els.board.innerHTML = "";
  state.activeNames.forEach(name => {
    const button = document.createElement("button");
    button.className = "name-tile";
    button.type = "button";
    button.textContent = name;
    button.dataset.name = name;
    button.addEventListener("click", () => handleGuess(button, name));
    els.board.appendChild(button);
  });
}

function showClue() {
  const round = ROUNDS[state.roundIndex];
  state.locked = false;
  els.nextBtn.classList.add("hidden");

  if (state.clueIndex < round.clues.length) {
    state.finalPhase = false;
    const clue = round.clues[state.clueIndex];
    els.clueText.textContent = clue.text;
    els.clueHint.textContent = `Eliminate 1 name · Clue ${state.clueIndex + 1} of ${round.clues.length}`;
  } else {
    state.finalPhase = true;
    els.clueText.textContent = round.finalText;
    els.clueHint.textContent = "Final check: tap the one remaining name.";
    const finalTile = els.board.querySelector(".name-tile");
    if (finalTile) finalTile.classList.add("survivor");
  }
}

function handleGuess(button, name) {
  if (!state.started || state.locked) return;
  const round = ROUNDS[state.roundIndex];
  const expected = state.finalPhase ? round.survivor : round.clues[state.clueIndex].answer;

  if (name === expected) {
    state.locked = true;
    state.streak += 1;
    const streakBonus = Math.min(state.streak - 1, 10) * 15;
    const points = (state.finalPhase ? 350 : 100) + streakBonus;
    state.score += points;
    renderHud();

    if (state.finalPhase) {
      button.classList.add("survivor");
      button.textContent = `${name} ✓`;
      els.clueHint.textContent = `Correct! +${points} points`;
      setTimeout(completeRound, 650);
      return;
    }

    button.classList.add("correct");
    button.disabled = true;
    els.clueHint.textContent = `Correct! +${points} points`;
    setTimeout(() => {
      state.activeNames = state.activeNames.filter(item => item !== name);
      button.remove();
      els.remainingCount.textContent = state.activeNames.length;
      state.clueIndex += 1;
      els.nextBtn.classList.remove("hidden");
      els.nextBtn.focus();
    }, 500);
  } else {
    state.lives -= 1;
    state.streak = 0;
    button.classList.remove("wrong");
    void button.offsetWidth;
    button.classList.add("wrong");
    renderHud();
    els.clueHint.textContent = state.lives > 0 ? "Not that one. Try again." : "No lives left.";
    if (state.lives <= 0) endGame(false);
  }
}

function nextClue() {
  if (!state.started) return;
  showClue();
}

function completeRound() {
  const roundBonus = 500 + (state.lives * 100);
  state.score += roundBonus;
  setBestScore(state.score);
  renderHud();

  if (state.roundIndex >= ROUNDS.length - 1) {
    endGame(true);
    return;
  }

  state.roundIndex += 1;
  state.lives = Math.min(3, state.lives + 1);
  setupRound();
  els.clueHint.textContent = `Round bonus +${roundBonus}. One life restored.`;
}

function startGame() {
  state = freshState();
  state.started = true;
  els.startBtn.classList.add("hidden");
  renderHud();
  setupRound();
}

function endGame(won) {
  state.started = false;
  setBestScore(state.score);
  renderHud();
  els.finalScore.textContent = state.score.toLocaleString();

  if (won) {
    els.resultEyebrow.textContent = "Perfect finish";
    els.resultIcon.textContent = "🏆";
    els.resultTitle.textContent = "You owned the board.";
    els.resultCopy.textContent = "Every category came down to the right final name.";
  } else {
    els.resultEyebrow.textContent = "Game over";
    els.resultIcon.textContent = "✦";
    els.resultTitle.textContent = "The board wins this one.";
    els.resultCopy.textContent = "Build a streak, protect your lives, and take another run.";
  }

  els.resultDialog.showModal();
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

els.startBtn.addEventListener("click", startGame);
els.nextBtn.addEventListener("click", nextClue);
els.playAgainBtn.addEventListener("click", () => {
  els.resultDialog.close();
  startGame();
});
els.howToBtn.addEventListener("click", () => els.howToDialog.showModal());

state = freshState();
els.bestScore.textContent = bestScore().toLocaleString();
els.categoryTitle.textContent = "Four boards. One survivor.";
els.remainingCount.textContent = "8";
ROUNDS[0].names.forEach(name => {
  const button = document.createElement("button");
  button.className = "name-tile";
  button.type = "button";
  button.textContent = name;
  button.disabled = true;
  els.board.appendChild(button);
});

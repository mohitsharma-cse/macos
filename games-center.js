const duelGames = [
  ['rps', 'Rock Paper Scissors', 'Arcade', ['Rock', 'Paper', 'Scissors'], ['🪨', '📄', '✂️']],
  ['elementduel', 'Element Duel', 'Arcade', ['Fire', 'Water', 'Leaf'], ['🔥', '💧', '🍃']],
  ['ninjaduel', 'Ninja Duel', 'Action', ['Sword', 'Shield', 'Star'], ['🗡️', '🛡️', '⭐']],
  ['pirateduel', 'Pirate Duel', 'Action', ['Map', 'Ship', 'Hook'], ['🗺️', '🚢', '🪝']],
  ['spaceclash', 'Space Clash', 'Sci-Fi', ['Laser', 'Drone', 'Shield'], ['🔫', '🛸', '🛡️']],
  ['monstermatch', 'Monster Match', 'Fantasy', ['Claw', 'Spell', 'Scale'], ['🐾', '✨', '🛡️']],
  ['colorduel', 'Color Duel', 'Puzzle', ['Red', 'Blue', 'Green'], ['🟥', '🟦', '🟩']],
  ['wizardwars', 'Wizard Wars', 'Fantasy', ['Ice', 'Storm', 'Flame'], ['🧊', '⚡', '🔥']]
].map(([id, name, category, choices, icons]) => ({ id, name, category, engine: 'duel', choices, icons }));

const guessGames = [
  ['numberhunt', 'Number Hunt', 'Puzzle', 50],
  ['treasureguess', 'Treasure Guess', 'Arcade', 75],
  ['codecracker', 'Code Cracker', 'Puzzle', 99],
  ['orbitguess', 'Orbit Guess', 'Sci-Fi', 120],
  ['dungeonguess', 'Dungeon Guess', 'Fantasy', 80],
  ['pixelguess', 'Pixel Guess', 'Retro', 64],
  ['meteorcount', 'Meteor Count', 'Sci-Fi', 150],
  ['goalguess', 'Goal Guess', 'Sports', 30]
].map(([id, name, category, max]) => ({ id, name, category, engine: 'guess', max }));

const mathGames = [
  ['quickmath', 'Quick Math', 'Puzzle', 10],
  ['sumdash', 'Sum Dash', 'Arcade', 12],
  ['multiplyrush', 'Multiply Rush', 'Arcade', 15],
  ['fractionflip', 'Fraction Flip', 'Puzzle', 9],
  ['algebraflick', 'Algebra Flick', 'Puzzle', 18],
  ['speedcount', 'Speed Count', 'Retro', 8],
  ['coincalc', 'Coin Calc', 'Casual', 20],
  ['matrixmind', 'Sci-Fi Math', 'Sci-Fi', 24]
].map(([id, name, category, difficulty]) => ({ id, name, category, engine: 'math', difficulty }));

const wordGames = [
  ['wordscramble', 'Word Scramble', 'Word', ['apple','design','nebula','window','rocket']],
  ['codewords', 'Code Words', 'Word', ['python','script','backend','deploy','binary']],
  ['spacewords', 'Space Words', 'Sci-Fi', ['planet','orbit','cosmos','galaxy','rocket']],
  ['fantasywords', 'Fantasy Words', 'Fantasy', ['wizard','dragon','potion','castle','quest']],
  ['sportwords', 'Sport Words', 'Sports', ['soccer','cricket','tennis','boxing','runner']],
  ['foodshuffle', 'Food Shuffle', 'Casual', ['burger','pasta','coffee','donut','taco']],
  ['musicmix', 'Music Mix', 'Creative', ['guitar','piano','rhythm','chorus','studio']],
  ['webtwist', 'Web Twist', 'Developer', ['browser','server','launch','render','socket']]
].map(([id, name, category, words]) => ({ id, name, category, engine: 'word', words }));

const reflexGames = [
  ['taplight', 'Tap Light', 'Reflex', 'Tap when the light turns green.'],
  ['reactionpulse', 'Reaction Pulse', 'Reflex', 'Wait for pulse and click fast.'],
  ['speedtap', 'Speed Tap', 'Reflex', 'Tap as soon as the signal appears.'],
  ['alertclick', 'Alert Click', 'Reflex', 'React instantly to the alert.'],
  ['boosttap', 'Boost Tap', 'Reflex', 'Hold steady, then strike.'],
  ['snapclick', 'Snap Click', 'Reflex', 'Snap to the target when it lights up.'],
  ['focushit', 'Focus Hit', 'Reflex', 'Stay calm and tap on cue.'],
  ['lightningtap', 'Lightning Tap', 'Reflex', 'Fastest tap wins the round.']
].map(([id, name, category, prompt]) => ({ id, name, category, engine: 'reflex', prompt }));

const quizGames = [
  ['techquiz', 'Tech Quiz', 'Quiz', [{q:'HTML stands for?', a:['HyperText Markup Language','HighText Machine Language','Home Tool Markup Language'], c:0},{q:'CSS is mainly used for?', a:['Styling','Database','Hosting'], c:0}]],
  ['spacequiz', 'Space Quiz', 'Quiz', [{q:'The red planet is?', a:['Mars','Venus','Saturn'], c:0},{q:'Earth has how many moons?', a:['1','2','3'], c:0}]],
  ['moviequiz', 'Movie Quiz', 'Quiz', [{q:'A movie script is called?', a:['Screenplay','Backlog','Matrix'], c:0},{q:'A movie trailer is?', a:['Promo clip','Camera lens','Subtitle'], c:0}]],
  ['musicquiz', 'Music Quiz', 'Quiz', [{q:'A song speed is called?', a:['Tempo','Theme','Scale'], c:0},{q:'A piano has?', a:['Keys','Strings only','Drums'], c:0}]],
  ['designquiz', 'Design Quiz', 'Quiz', [{q:'Spacing creates?', a:['Rhythm','Noise','Latency'], c:0},{q:'Contrast helps?', a:['Hierarchy','Compression','Deploys'], c:0}]],
  ['sportsquiz', 'Sports Quiz', 'Quiz', [{q:'A football game starts with?', a:['Kickoff','Serve','Tipoff'], c:0},{q:'Tennis uses?', a:['Racket','Bat','Glove'], c:0}]],
  ['foodquiz', 'Food Quiz', 'Quiz', [{q:'Sushi is commonly made with?', a:['Rice','Bread','Cheese'], c:0},{q:'Espresso is?', a:['Coffee','Soup','Soda'], c:0}]],
  ['webquiz', 'Web Quiz', 'Quiz', [{q:'A backend handles?', a:['Server logic','Wallpaper only','Fonts only'], c:0},{q:'An API exchanges?', a:['Data','Paint','Gravity'], c:0}]]
].map(([id, name, category, questions]) => ({ id, name, category, engine: 'quiz', questions }));

const baseGames = [
  { id: 'tictactoehub', name: 'Tic-Tac-Toe', category: 'Board', engine: 'ttt' },
  { id: 'memoryhub', name: 'Memory Match', category: 'Board', engine: 'memory' }
];

const GAME_LIBRARY = [...baseGames, ...duelGames, ...guessGames, ...mathGames, ...wordGames, ...reflexGames, ...quizGames];

const GAME_STATE = {
  selectedId: GAME_LIBRARY[0].id,
  scores: JSON.parse(localStorage.getItem('nebula_game_scores') || '{}'),
  duelScore: 0,
  guessTarget: null,
  guessAttempts: 0,
  mathQuestion: null,
  mathScore: 0,
  wordAnswer: '',
  reflexReadyAt: null,
  reflexTimer: null,
  quizIndex: 0,
  quizScore: 0,
  quizDone: false,
  tttBoard: Array(9).fill(''),
  tttTurn: 'X',
  memoryDeck: [],
  memoryOpen: []
};

function gamesSaveScores() {
  localStorage.setItem('nebula_game_scores', JSON.stringify(GAME_STATE.scores));
}

function gamesTrackPlay(gameId) {
  if (window.nebulaSession && Array.isArray(window.nebulaSession.gamesPlayed) && !window.nebulaSession.gamesPlayed.includes(gameId)) {
    window.nebulaSession.gamesPlayed.push(gameId);
  }
}

function currentGame() {
  return GAME_LIBRARY.find(game => game.id === GAME_STATE.selectedId) || GAME_LIBRARY[0];
}

function renderGamesSidebar() {
  const game = currentGame();
  const groups = [...new Set(GAME_LIBRARY.map(entry => entry.category))];
  return `
    <div style="width:320px;border-right:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);display:flex;flex-direction:column;">
      <div style="padding:18px 18px 12px;">
        <div style="font-size:28px;font-weight:700;">Game Center</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:6px;">${GAME_LIBRARY.length} playable games in one arcade hub.</div>
      </div>
      <div style="padding:0 18px 18px;">
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:14px;">
          <div style="font-size:12px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.08em;">Now playing</div>
          <div style="font-size:20px;font-weight:700;margin-top:8px;">${game.name}</div>
          <div style="font-size:12px;color:#93c5fd;margin-top:6px;">Best: ${GAME_STATE.scores[game.id] ?? 'No score yet'}</div>
        </div>
      </div>
      <div style="flex:1;overflow:auto;padding:0 18px 18px;">
        ${groups.map(group => `
          <div style="margin-bottom:18px;">
            <div style="font-size:12px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">${group}</div>
            <div style="display:grid;gap:8px;">
              ${GAME_LIBRARY.filter(entry => entry.category === group).map(entry => `
                <button onclick="gamesSelect('${entry.id}')" style="text-align:left;background:${entry.id===game.id?'rgba(59,130,246,0.22)':'rgba(255,255,255,0.04)'};border:1px solid ${entry.id===game.id?'rgba(96,165,250,0.65)':'rgba(255,255,255,0.06)'};color:white;padding:11px 12px;border-radius:14px;cursor:pointer;">
                  <div style="font-size:14px;font-weight:600;">${entry.name}</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px;">${entry.engine.toUpperCase()} mode</div>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderGamesStage() {
  const game = currentGame();
  if (game.engine === 'duel') return renderDuelGame(game);
  if (game.engine === 'guess') return renderGuessGame(game);
  if (game.engine === 'math') return renderMathGame(game);
  if (game.engine === 'word') return renderWordGame(game);
  if (game.engine === 'reflex') return renderReflexGame(game);
  if (game.engine === 'quiz') return renderQuizGame(game);
  if (game.engine === 'memory') return renderMemoryGame(game);
  return renderTttGame(game);
}

window.initGamesCenter = function() {
  gamesRenderShell();
  gamesSelect(GAME_STATE.selectedId);
};

function gamesRenderShell() {
  const root = document.getElementById('games-center-root');
  if (!root) return;
  root.innerHTML = renderGamesSidebar() + `<div id="games-stage" style="flex:1;display:flex;flex-direction:column;"></div>`;
  renderGamesStageIntoDom();
}

function renderGamesStageIntoDom() {
  const stage = document.getElementById('games-stage');
  if (!stage) return;
  stage.innerHTML = renderGamesStage();
}

window.gamesSelect = function(gameId) {
  GAME_STATE.selectedId = gameId;
  gamesTrackPlay(gameId);
  resetGameForSelection(currentGame());
  gamesRenderShell();
};

function resetGameForSelection(game) {
  if (game.engine === 'guess') {
    GAME_STATE.guessTarget = Math.floor(Math.random() * game.max) + 1;
    GAME_STATE.guessAttempts = 0;
  }
  if (game.engine === 'math') {
    GAME_STATE.mathScore = 0;
    GAME_STATE.mathQuestion = buildMathQuestion(game.difficulty);
  }
  if (game.engine === 'word') {
    const answer = game.words[Math.floor(Math.random() * game.words.length)];
    GAME_STATE.wordAnswer = answer;
  }
  if (game.engine === 'reflex') {
    GAME_STATE.reflexReadyAt = null;
    clearTimeout(GAME_STATE.reflexTimer);
    GAME_STATE.reflexTimer = null;
  }
  if (game.engine === 'quiz') {
    GAME_STATE.quizIndex = 0;
    GAME_STATE.quizScore = 0;
    GAME_STATE.quizDone = false;
  }
  if (game.engine === 'ttt') {
    GAME_STATE.tttBoard = Array(9).fill('');
    GAME_STATE.tttTurn = 'X';
  }
  if (game.engine === 'memory') {
    const symbols = ['🍎','🍋','🍇','🍒','🍓','🥝','🍍','🍉'];
    GAME_STATE.memoryDeck = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map(symbol => ({ symbol, matched: false }));
    GAME_STATE.memoryOpen = [];
  }
}

function stageFrame(game, subtitle, body) {
  const best = GAME_STATE.scores[game.id] ?? 'No score yet';
  return `
    <div style="padding:22px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <div style="font-size:34px;font-weight:800;letter-spacing:-0.03em;">${game.name}</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.58);margin-top:6px;">${subtitle}</div>
      </div>
      <div style="font-size:12px;color:#93c5fd;">Best: ${best}</div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:24px;">${body}</div>
  `;
}

function renderDuelGame(game) {
  return stageFrame(game, 'Choose your move and beat the CPU.', `
    <div style="width:min(760px,100%);display:grid;gap:18px;">
      <div id="games-duel-result" style="text-align:center;font-size:20px;font-weight:700;">Pick your move</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        ${game.choices.map((choice, index) => `<button onclick="gamesPlayDuel(${index})" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:22px;color:white;padding:26px 18px;cursor:pointer;"><div style="font-size:42px;">${game.icons[index]}</div><div style="margin-top:10px;font-size:16px;font-weight:700;">${choice}</div></button>`).join('')}
      </div>
    </div>
  `);
}

function renderGuessGame(game) {
  return stageFrame(game, `Guess the hidden number between 1 and ${game.max}.`, `
    <div style="width:min(520px,100%);display:grid;gap:16px;text-align:center;">
      <div id="games-guess-result" style="font-size:18px;font-weight:700;">Take your first guess</div>
      <input id="games-guess-input" type="number" min="1" max="${game.max}" style="padding:16px 18px;border-radius:18px;border:none;background:rgba(255,255,255,0.08);color:white;font-size:18px;text-align:center;">
      <button onclick="gamesSubmitGuess()" style="background:#0a84ff;border:none;color:white;padding:14px 18px;border-radius:18px;font-size:16px;font-weight:700;cursor:pointer;">Guess</button>
    </div>
  `);
}

function renderMathGame(game) {
  const q = GAME_STATE.mathQuestion || buildMathQuestion(game.difficulty);
  GAME_STATE.mathQuestion = q;
  return stageFrame(game, 'Solve fast and build your score streak.', `
    <div style="width:min(640px,100%);display:grid;gap:18px;text-align:center;">
      <div style="font-size:18px;color:rgba(255,255,255,0.6);">Score: ${GAME_STATE.mathScore}</div>
      <div style="font-size:48px;font-weight:800;">${q.text}</div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
        ${q.options.map(value => `<button onclick="gamesAnswerMath(${value})" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:18px;color:white;padding:20px;font-size:26px;font-weight:700;cursor:pointer;">${value}</button>`).join('')}
      </div>
    </div>
  `);
}

function renderWordGame(game) {
  const scrambled = GAME_STATE.wordAnswer.split('').sort(() => Math.random() - 0.5).join('');
  return stageFrame(game, 'Unscramble the word to win the round.', `
    <div style="width:min(560px,100%);display:grid;gap:18px;text-align:center;">
      <div style="font-size:14px;color:rgba(255,255,255,0.6);">Scrambled word</div>
      <div style="font-size:42px;font-weight:800;letter-spacing:0.08em;">${scrambled}</div>
      <input id="games-word-input" type="text" style="padding:16px 18px;border-radius:18px;border:none;background:rgba(255,255,255,0.08);color:white;font-size:18px;text-align:center;text-transform:lowercase;">
      <button onclick="gamesSubmitWord()" style="background:#0a84ff;border:none;color:white;padding:14px 18px;border-radius:18px;font-size:16px;font-weight:700;cursor:pointer;">Submit</button>
      <div id="games-word-result" style="font-size:16px;font-weight:700;"></div>
    </div>
  `);
}

function renderReflexGame(game) {
  return stageFrame(game, game.prompt, `
    <div style="width:min(540px,100%);display:grid;gap:18px;text-align:center;">
      <div id="games-reflex-result" style="font-size:18px;font-weight:700;">Press start and wait for green.</div>
      <button id="games-reflex-btn" onclick="gamesStartReflex()" style="padding:28px 20px;border:none;border-radius:26px;background:rgba(255,255,255,0.08);color:white;font-size:24px;font-weight:800;cursor:pointer;">Start</button>
    </div>
  `);
}

function renderQuizGame(game) {
  const q = game.questions[GAME_STATE.quizIndex];
  if (GAME_STATE.quizDone) {
    return stageFrame(game, 'Round complete.', `<div style="text-align:center;"><div style="font-size:24px;font-weight:800;">Final Score: ${GAME_STATE.quizScore}/${game.questions.length}</div><button onclick="gamesRestartQuiz()" style="margin-top:16px;background:#0a84ff;border:none;color:white;padding:14px 18px;border-radius:18px;font-size:16px;font-weight:700;cursor:pointer;">Restart</button></div>`);
  }
  return stageFrame(game, `Question ${GAME_STATE.quizIndex + 1} of ${game.questions.length}`, `
    <div style="width:min(700px,100%);display:grid;gap:18px;">
      <div style="font-size:34px;font-weight:800;text-align:center;">${q.q}</div>
      <div style="display:grid;gap:12px;">
        ${q.a.map((answer, index) => `<button onclick="gamesAnswerQuiz(${index})" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:18px;color:white;padding:16px 18px;font-size:17px;font-weight:700;cursor:pointer;text-align:left;">${answer}</button>`).join('')}
      </div>
    </div>
  `);
}

function renderTttGame(game) {
  return stageFrame(game, `Current turn: ${GAME_STATE.tttTurn}`, `
    <div style="display:grid;grid-template-columns:repeat(3,100px);gap:12px;">
      ${GAME_STATE.tttBoard.map((cell, index) => `<button onclick="gamesPlayTtt(${index})" style="width:100px;height:100px;border:none;border-radius:24px;background:rgba(255,255,255,0.08);color:white;font-size:40px;font-weight:800;cursor:pointer;">${cell}</button>`).join('')}
    </div>
  `);
}

function renderMemoryGame(game) {
  return stageFrame(game, 'Match all pairs to clear the board.', `
    <div style="width:min(640px,100%);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
      ${GAME_STATE.memoryDeck.map((card, index) => `<button onclick="gamesFlipMemory(${index})" style="min-height:88px;border:none;border-radius:18px;background:${card.matched || GAME_STATE.memoryOpen.includes(index) ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.08)'};color:white;font-size:28px;cursor:pointer;">${card.matched || GAME_STATE.memoryOpen.includes(index) ? card.symbol : '•'}</button>`).join('')}
    </div>
  `);
}

function buildMathQuestion(difficulty) {
  const a = Math.ceil(Math.random() * difficulty);
  const b = Math.ceil(Math.random() * difficulty);
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  const options = [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5);
  return { text: `${a} ${op} ${b}`, answer, options };
}

window.gamesPlayDuel = function(index) {
  const game = currentGame();
  const cpu = Math.floor(Math.random() * game.choices.length);
  const result = document.getElementById('games-duel-result');
  let message = `You chose ${game.choices[index]}, CPU chose ${game.choices[cpu]}.`;
  if (index === cpu) message += ' Draw.';
  else if ((index - cpu + game.choices.length) % game.choices.length === 1) {
    message += ' You win.';
    GAME_STATE.duelScore += 1;
    GAME_STATE.scores[game.id] = Math.max(GAME_STATE.scores[game.id] || 0, GAME_STATE.duelScore);
    gamesSaveScores();
  } else {
    message += ' CPU wins.';
    GAME_STATE.duelScore = 0;
  }
  if (result) result.textContent = message;
};

window.gamesSubmitGuess = function() {
  const game = currentGame();
  const input = document.getElementById('games-guess-input');
  const result = document.getElementById('games-guess-result');
  if (!input || !result) return;
  const guess = Number(input.value);
  GAME_STATE.guessAttempts += 1;
  if (guess === GAME_STATE.guessTarget) {
    result.textContent = `Correct in ${GAME_STATE.guessAttempts} guesses.`;
    const best = GAME_STATE.scores[game.id];
    GAME_STATE.scores[game.id] = best ? Math.min(best, GAME_STATE.guessAttempts) : GAME_STATE.guessAttempts;
    gamesSaveScores();
  } else if (guess < GAME_STATE.guessTarget) {
    result.textContent = 'Too low. Try higher.';
  } else {
    result.textContent = 'Too high. Try lower.';
  }
};

window.gamesAnswerMath = function(value) {
  const game = currentGame();
  if (value === GAME_STATE.mathQuestion.answer) {
    GAME_STATE.mathScore += 1;
    GAME_STATE.scores[game.id] = Math.max(GAME_STATE.scores[game.id] || 0, GAME_STATE.mathScore);
    gamesSaveScores();
  } else {
    GAME_STATE.mathScore = 0;
  }
  GAME_STATE.mathQuestion = buildMathQuestion(game.difficulty);
  renderGamesStageIntoDom();
};

window.gamesSubmitWord = function() {
  const game = currentGame();
  const input = document.getElementById('games-word-input');
  const result = document.getElementById('games-word-result');
  if (!input || !result) return;
  if (input.value.trim().toLowerCase() === GAME_STATE.wordAnswer) {
    result.textContent = 'Correct!';
    GAME_STATE.scores[game.id] = (GAME_STATE.scores[game.id] || 0) + 1;
    gamesSaveScores();
  } else {
    result.textContent = `Not quite. Answer: ${GAME_STATE.wordAnswer}`;
  }
  const words = game.words;
  GAME_STATE.wordAnswer = words[Math.floor(Math.random() * words.length)];
  setTimeout(renderGamesStageIntoDom, 500);
};

window.gamesStartReflex = function() {
  const button = document.getElementById('games-reflex-btn');
  const result = document.getElementById('games-reflex-result');
  if (!button || !result) return;
  result.textContent = 'Wait for green...';
  button.textContent = 'Waiting';
  button.style.background = 'rgba(255,255,255,0.08)';
  GAME_STATE.reflexReadyAt = null;
  clearTimeout(GAME_STATE.reflexTimer);
  GAME_STATE.reflexTimer = setTimeout(() => {
    GAME_STATE.reflexReadyAt = performance.now();
    button.textContent = 'TAP!';
    button.style.background = '#22c55e';
    button.onclick = window.gamesHitReflex;
  }, 800 + Math.random() * 1800);
};

window.gamesHitReflex = function() {
  const button = document.getElementById('games-reflex-btn');
  const result = document.getElementById('games-reflex-result');
  const game = currentGame();
  if (!GAME_STATE.reflexReadyAt || !button || !result) return;
  const reaction = Math.round(performance.now() - GAME_STATE.reflexReadyAt);
  result.textContent = `Reaction time: ${reaction} ms`;
  const best = GAME_STATE.scores[game.id];
  GAME_STATE.scores[game.id] = best ? Math.min(best, reaction) : reaction;
  gamesSaveScores();
  button.textContent = 'Start Again';
  button.style.background = '#0a84ff';
  button.onclick = window.gamesStartReflex;
  GAME_STATE.reflexReadyAt = null;
};

window.gamesAnswerQuiz = function(index) {
  const game = currentGame();
  const question = game.questions[GAME_STATE.quizIndex];
  if (index === question.c) GAME_STATE.quizScore += 1;
  GAME_STATE.quizIndex += 1;
  if (GAME_STATE.quizIndex >= game.questions.length) {
    GAME_STATE.quizDone = true;
    GAME_STATE.scores[game.id] = Math.max(GAME_STATE.scores[game.id] || 0, GAME_STATE.quizScore);
    gamesSaveScores();
  }
  renderGamesStageIntoDom();
};

window.gamesRestartQuiz = function() {
  GAME_STATE.quizIndex = 0;
  GAME_STATE.quizScore = 0;
  GAME_STATE.quizDone = false;
  renderGamesStageIntoDom();
};

window.gamesPlayTtt = function(index) {
  if (GAME_STATE.tttBoard[index]) return;
  GAME_STATE.tttBoard[index] = GAME_STATE.tttTurn;
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = lines.find(line => line.every(i => GAME_STATE.tttBoard[i] && GAME_STATE.tttBoard[i] === GAME_STATE.tttBoard[line[0]]));
  if (winner) {
    GAME_STATE.scores[currentGame().id] = (GAME_STATE.scores[currentGame().id] || 0) + 1;
    gamesSaveScores();
    alert(`Winner: ${GAME_STATE.tttTurn}`);
    resetGameForSelection(currentGame());
  } else if (GAME_STATE.tttBoard.every(Boolean)) {
    alert('Draw game');
    resetGameForSelection(currentGame());
  } else {
    GAME_STATE.tttTurn = GAME_STATE.tttTurn === 'X' ? 'O' : 'X';
  }
  renderGamesStageIntoDom();
};

window.gamesFlipMemory = function(index) {
  const card = GAME_STATE.memoryDeck[index];
  if (!card || card.matched || GAME_STATE.memoryOpen.includes(index) || GAME_STATE.memoryOpen.length === 2) return;
  GAME_STATE.memoryOpen.push(index);
  renderGamesStageIntoDom();
  if (GAME_STATE.memoryOpen.length === 2) {
    const [a, b] = GAME_STATE.memoryOpen;
    if (GAME_STATE.memoryDeck[a].symbol === GAME_STATE.memoryDeck[b].symbol) {
      GAME_STATE.memoryDeck[a].matched = true;
      GAME_STATE.memoryDeck[b].matched = true;
      GAME_STATE.memoryOpen = [];
      if (GAME_STATE.memoryDeck.every(entry => entry.matched)) {
        GAME_STATE.scores[currentGame().id] = (GAME_STATE.scores[currentGame().id] || 0) + 1;
        gamesSaveScores();
      }
      setTimeout(renderGamesStageIntoDom, 120);
    } else {
      setTimeout(() => {
        GAME_STATE.memoryOpen = [];
        renderGamesStageIntoDom();
      }, 650);
    }
  }
};

// mmogame.js with extensive English debug messages

const mmogame = (function () {
  let ws = null;
  let playerId = null;
  let currentPlayer = null;
  let myHand = [];

  // Callback references
  let renderHandCallback = null;
  let renderDiscardCallback = null;
  let updateInfoCallback = null;
  let showResultsCallback = null;

  /**
   * Connect to the WebSocket server.
   * @param {string} url The ws:// or wss:// URL
   */
  function connect(url = 'wss://ws.rereadgames.de') {
    console.debug('[mmogame] Initializing connection to', url);
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.debug('[mmogame] WebSocket connection opened');
    };

    ws.onmessage = event => {
      console.debug('[mmogame] Received message:', event.data);
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (err) {
        console.error('[mmogame] Error parsing message', err);
        return;
      }

      switch (msg.type) {
        case 'start':
          console.debug('[mmogame] Start message:', msg);
          playerId = msg.playerId;
          myHand = msg.hand;
          if (renderHandCallback) {
            console.debug('[mmogame] Calling renderHandCallback with', myHand);
            renderHandCallback(myHand);
          }
          break;

        case 'state':
          console.debug('[mmogame] New game state:', msg.state);
          currentPlayer = msg.state.currentPlayer;
          if (renderDiscardCallback) {
            console.debug('[mmogame] Calling renderDiscardCallback');
            renderDiscardCallback(msg.state.discardPile);
          }
          if (updateInfoCallback) {
            updateInfoCallback({
              deckSize: msg.state.deckSize,
              discardSize: msg.state.discardPile.length,
              currentPlayer: currentPlayer
            });
          }
          break;

        case 'draw':
          console.debug('[mmogame] Draw response for player', playerId, ':', msg.card);
          myHand.push(msg.card);
          if (renderHandCallback) {
            renderHandCallback(myHand);
          }
          break;

        case 'gameover':
          console.debug('[mmogame] Game over. Results:', msg.results);
          if (showResultsCallback) {
            showResultsCallback(msg.results);
          }
          break;

        case 'error':
          console.warn('[mmogame] Error from server:', msg.error);
          break;

        default:
          console.warn('[mmogame] Unknown message type:', msg.type);
      }
    };

    ws.onerror = err => {
      console.error('[mmogame] WebSocket error:', err);
    };

    ws.onclose = ev => {
      console.debug('[mmogame] Connection closed:', ev.code, ev.reason);
    };
  }

  /** Sends an action to the server. */
  function sendAction(actionObj) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('[mmogame] Cannot send action, WebSocket not open:', actionObj);
      return;
    }
    const payload = JSON.stringify(actionObj);
    console.debug('[mmogame] Sending action:', payload);
    ws.send(payload);
  }

  // Player actions
  function drawFromDeck() {
    console.debug('[mmogame] drawFromDeck() called, playerId=', playerId, 'currentPlayer=', currentPlayer);
    if (playerId === currentPlayer) {
      sendAction({ action: 'draw', source: 'deck' });
    } else {
      console.debug('[mmogame] Not your turn, drawFromDeck ignored');
    }
  }

  function drawFromDiscard(cardId) {
    console.debug('[mmogame] drawFromDiscard() with cardId=', cardId);
    if (playerId === currentPlayer) {
      sendAction({ action: 'draw', source: 'discard', cardId });
    } else {
      console.debug('[mmogame] Not your turn, drawFromDiscard ignored');
    }
  }

  function discard(cardId) {
    console.debug('[mmogame] discard() with cardId=', cardId);
    if (playerId === currentPlayer) {
      sendAction({ action: 'discard', cardId });
      // Optimistic update of the local hand
      myHand = myHand.filter(c => c.id !== cardId);
      if (renderHandCallback) {
        renderHandCallback(myHand);
      }
    } else {
      console.debug('[mmogame] Not your turn, discard ignored');
    }
  }

  // Registration of callback functions
  function onRenderHand(cb) {
    console.debug('[mmogame] renderHandCallback registered');
    renderHandCallback = cb;
  }

  function onRenderDiscard(cb) {
    console.debug('[mmogame] renderDiscardCallback registered');
    renderDiscardCallback = cb;
  }

  function onUpdateInfo(cb) {
    console.debug('[mmogame] updateInfoCallback registered');
    updateInfoCallback = cb;
  }

  function onShowResults(cb) {
    console.debug('[mmogame] showResultsCallback registered');
    showResultsCallback = cb;
  }

  // Public API
  return {
    connect,
    drawFromDeck,
    drawFromDiscard,
    discard,
    onRenderHand,
    onRenderDiscard,
    onUpdateInfo,
    onShowResults
  };
})();

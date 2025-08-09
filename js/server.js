// server.js with extensive English log messages and port 9080

const WebSocket = require('ws');
const deckData = require('./deck.js');
const Hand = require('./hand.js');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class Game {
  constructor() {
    console.log('[Game] New game instance created');
    deckData.enableRereadgamesEditionExt();
    this.deck = Object.values(deckData.cards);
    shuffle(this.deck);
    console.log('[Game] Deck has ' + this.deck.length + ' cards');
    this.discard = [];
    this.players = [];
    this.current = 0;
  }

  addPlayer(ws) {
    const hand = new Hand();
    for (let i = 0; i < 7; i++) {
      hand.addCard(this.deck.pop());
    }
    const player = { id: this.players.length, ws, hand };
    this.players.push(player);
    console.log(`[Game] Added player ${player.id} (total players: ${this.players.length})`);
    return player;
  }

  get currentPlayer() {
    return this.players[this.current];
  }

  next() {
    this.current = (this.current + 1) % this.players.length;
    console.log(`[Game] Next player is now: ${this.current}`);
  }

  draw(player, source, cardId) {
    if (source === 'discard') {
      const index = this.discard.findIndex(c => c.id === cardId);
      if (index === -1) {
        console.warn(`[Game] Card with ID ${cardId} not found in discard pile`);
        return null;
      }
      const [card] = this.discard.splice(index, 1);
      console.log(`[Game] Player ${player.id} draws ${card.name} (${card.id}) from discard pile`);
      return card;
    }
    const card = this.deck.pop();
    if (card) {
      console.log(`[Game] Player ${player.id} draws ${card.name} (${card.id}) from the deck`);
    } else {
      console.log(`[Game] Player ${player.id} tried to draw a card, but the deck is empty`);
    }
    return card;
  }

  discardCard(player, cardId) {
    const card = player.hand.getCardById(cardId);
    if (!card) {
      console.warn(`[Game] Player ${player.id} attempted to discard unknown card ${cardId}`);
      return false;
    }
    player.hand.removeCard(cardId);
    this.discard.push(card.card);
    console.log(`[Game] Player ${player.id} discards ${card.card.name} (${card.card.id})`);
    return true;
  }

  toPublic() {
    return {
      deckSize: this.deck.length,
      discardPile: this.discard.slice(),
      currentPlayer: this.current
    };
  }
}

const wss = new WebSocket.Server({ port: 9080 }, () => {
  console.log('[Server] WebSocket server started on port 9080');
});
let game = null;

wss.on('connection', ws => {
  console.log('[Server] New client connected');

  if (!game) {
    console.log('[Server] No active game found – creating a new game');
    game = new Game();
  }
  const player = game.addPlayer(ws);

  const handPayload = player.hand.cards().map(cih => ({
    id: cih.card.id,
    name: cih.card.name,
    suit: cih.card.suit,
    strength: cih.card.strength
  }));
  ws.send(JSON.stringify({
    type: 'start',
    playerId: player.id,
    hand: handPayload
  }));
  console.log(`[Server] Sent initial hand to player ${player.id}`, handPayload);

  ws.on('message', data => {
    console.log(`[Server] Received message from player ${player.id}:`, data);

    let msg;
    try {
      msg = JSON.parse(data);
    } catch (err) {
      console.warn('[Server] Invalid JSON received:', err);
      return;
    }

    if (game.currentPlayer.id !== player.id) {
      console.warn(`[Server] Player ${player.id} attempted an action out of turn`);
      ws.send(JSON.stringify({ type: 'error', error: 'Not your turn' }));
      return;
    }

    if (msg.action === 'draw') {
      const card = game.draw(player, msg.source, msg.cardId);
      if (card) {
        player.hand.addCard(card);
        ws.send(JSON.stringify({ type: 'draw', card }));
      }
      broadcast(game);
      return;
    }

    if (msg.action === 'discard') {
      if (game.discardCard(player, msg.cardId)) {
        game.next();
        if (game.discard.length >= 12) {
          endGame();
        } else {
          broadcast(game);
        }
      }
      return;
    }

    console.warn('[Server] Unknown action received:', msg.action);
  });

  ws.on('close', () => {
    console.log(`[Server] Connection with player ${player.id} closed`);
    // Here you could remove the player from the game
  });
});

function broadcast(gameInstance) {
  const state = gameInstance.toPublic();
  console.log('[Server] Broadcasting new state to all players:', state);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'state', state }));
    }
  });
}

function endGame() {
  console.log('[Server] End of game reached. Calculating final scores.');
  const results = game.players.map(p => ({
    id: p.id,
    score: p.hand.score(game.discard)
  }));
  console.log('[Server] Final scores:', results);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'gameover', results }));
    }
  });
  game = null;
}

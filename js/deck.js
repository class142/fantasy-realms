var base = {
  'FR01': {
    id: 'FR01',
    suit: 'land',
    name: 'Mountain',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Smoke') && hand.contains('Wildfire') ? 50 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'flood';
    },
    relatedSuits: ['flood'],
    relatedCards: ['Smoke', 'Wildfire']
  },
  'FR02': {
    id: 'FR02',
    suit: 'land',
    name: 'Cavern',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Dwarvish Infantry') || hand.contains('Dragon') ? 25 : 0;
    },
    clearsPenalty: function (card) {
      return card.suit === 'weather' || isPhoenix(card);
    },
    relatedSuits: ['weather'],
    relatedCards: ['Dwarvish Infantry', 'Dragon']
  },
  'FR03': {
    id: 'FR03',
    suit: 'land',
    name: 'Bell Tower',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('wizard') ? 15 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR04': {
    id: 'FR04',
    suit: 'land',
    name: 'Forest',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 12 * hand.countSuit('beast') + (hand.contains('Elven Archers') ? 12 : 0);
    },
    relatedSuits: ['beast'],
    relatedCards: ['Elven Archers']
  },
  'FR05': {
    id: 'FR05',
    suit: 'land',
    name: 'Earth Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('land', this.id);
    },
    relatedSuits: ['land'],
    relatedCards: []
  },
  'FR06': {
    id: 'FR06',
    suit: 'flood',
    name: 'Fountain of Life',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'weapon' || card.suit === 'flood' || card.suit === 'flame' || card.suit === 'land' || card.suit === 'weather' || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['weapon', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'FR07': {
    id: 'FR07',
    suit: 'flood',
    name: 'Swamp',
    strength: 18,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      return -3 * penaltyCards;
    },
    relatedSuits: ['army', 'flame'],
    relatedCards: []
  },
  'FR08': {
    id: 'FR08',
    suit: 'flood',
    name: 'Great Flood',
    strength: 32,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || isPhoenix(card);
    },
    relatedSuits: ['army', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'FR09': {
    id: 'FR09',
    suit: 'flood',
    name: 'Island',
    strength: 14,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: ['flood', 'flame'],
    relatedCards: []
  },
  'FR10': {
    id: 'FR10',
    suit: 'flood',
    name: 'Water Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('flood', this.id);
    },
    relatedSuits: ['flood'],
    relatedCards: []
  },
  'FR11': {
    id: 'FR11',
    suit: 'weather',
    name: 'Rainstorm',
    strength: 8,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('flood');
    },
    blanks: function (card, hand) {
      return card.suit === 'flame' && card.name !== 'Lightning';
    },
    relatedSuits: ['flood', 'flame'],
    relatedCards: ['Lightning']
  },
  'FR12': {
    id: 'FR12',
    suit: 'weather',
    name: 'Blizzard',
    strength: 30,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('beast') + hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      if (!isLeaderClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('leader')
      }
      return -5 * penaltyCards;
    },
    blanks: function (card, hand) {
      return card.suit === 'flood';
    },
    relatedSuits: ['leader', 'beast', 'flame', 'army', 'flood'],
    relatedCards: []
  },
  'FR13': {
    id: 'FR13',
    suit: 'weather',
    name: 'Smoke',
    strength: 27,
    bonus: false,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flame');
    },
    relatedSuits: ['flame'],
    relatedCards: []
  },
  'FR14': {
    id: 'FR14',
    suit: 'weather',
    name: 'Whirlwind',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Rainstorm') && (hand.contains('Blizzard') || hand.contains('Great Flood')) ? 40 : 0;
    },
    relatedSuits: ['Rainstorm'],
    relatedCards: ['Blizzard', 'Great Flood']
  },
  'FR15': {
    id: 'FR15',
    suit: 'weather',
    name: 'Air Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('weather', this.id);
    },
    relatedSuits: ['weather'],
    relatedCards: []
  },
  'FR16': {
    id: 'FR16',
    suit: 'flame',
    name: 'Wildfire',
    strength: 40,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return !(card.suit === 'flame' || card.suit === 'wizard' || card.suit === 'weather' ||
        card.suit === 'weapon' || card.suit === 'artifact' || card.suit === 'wild' || card.name === 'Mountain' ||
        card.name === 'Great Flood' || card.name === 'Island' || card.name === 'Unicorn' || card.name === 'Dragon' ||
        isPhoenix(card));
    },
    relatedSuits: allSuits(),
    relatedCards: ['Mountain', 'Great Flood', 'Island', 'Unicorn', 'Dragon', 'River']
  },
  'FR17': {
    id: 'FR17',
    suit: 'flame',
    name: 'Candle',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Book of Changes') && hand.contains('Bell Tower') && hand.containsSuit('wizard') ? 100 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: ['Book of Changes', 'Bell Tower']
  },
  'FR18': {
    id: 'FR18',
    suit: 'flame',
    name: 'Forge',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 9 * (hand.countSuit('weapon') + hand.countSuit('artifact'));
    },
    relatedSuits: ['weapon', 'artifact'],
    relatedCards: []
  },
  'FR19': {
    id: 'FR19',
    suit: 'flame',
    name: 'Lightning',
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Rainstorm') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Rainstorm']
  },
  'FR20': {
    id: 'FR20',
    suit: 'flame',
    name: 'Fire Elemental',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 15 * hand.countSuitExcluding('flame', this.id);
    },
    relatedSuits: ['flame'],
    relatedCards: []
  },
  'FR21': {
    id: 'FR21',
    suit: 'army',
    name: 'Knights',
    strength: 20,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      if (!isLeaderClearedFromPenalty(this, hand)) {
        return hand.containsSuit('leader') ? 0 : -8;
      }
      return 0;
    },
    relatedSuits: ['leader'],
    relatedCards: []
  },
  'FR22': {
    id: 'FR22',
    suit: 'army',
    name: 'Elven Archers',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('weather') ? 0 : 5;
    },
    relatedSuits: ['weather'],
    relatedCards: []
  },
  'FR23': {
    id: 'FR23',
    suit: 'army',
    name: 'Light Cavalry',
    strength: 17,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      return -2 * hand.countSuit('land');
    },
    relatedSuits: ['land'],
    relatedCards: []

  },
  'FR24': {
    id: 'FR24',
    suit: 'army',
    name: 'Dwarvish Infantry',
    strength: 15,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      if (!isArmyClearedFromPenalty(this, hand)) {
        return -2 * hand.countSuitExcluding('army', this.id);
      }
      return 0;
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'FR25': {
    id: 'FR25',
    suit: 'army',
    name: 'Rangers',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('land');
    },
    relatedSuits: ['land', 'army'],
    relatedCards: []
  },
  'FR26': {
    id: 'FR26',
    suit: 'wizard',
    name: 'Collector',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bySuit = {};
      if (hand.containsId(PHOENIX_PROMO, true)) {
        var phoenix = hand.getCardById(PHOENIX_PROMO);
        bySuit['flame'] = {};
        bySuit['flame'][phoenix.name] = phoenix;
        bySuit['weather'] = {};
        bySuit['weather'][phoenix.name] = phoenix;
        bySuit[phoenix.suit] = {};
        bySuit[phoenix.suit][phoenix.name] = phoenix;
      }
      for (const card of hand.nonBlankedCards()) {
        if (card.id !== PHOENIX_PROMO) {
          if (card.id === PHOENIX) {
            if (bySuit['flame'] === undefined) {
              bySuit['flame'] = {};
            }
            bySuit['flame'][card.name] = card;
            if (bySuit['weather'] === undefined) {
              bySuit['weather'] = {};
            }
            bySuit['weather'][card.name] = card;
          }
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
      }
      var bonus = 0;
      for (const suit of Object.values(bySuit)) {
        var count = Object.keys(suit).length;
        if (count === 3) {
          bonus += 10;
        } else if (count === 4) {
          bonus += 40;
        } else if (count >= 5) {
          bonus += 100;
        }
      }
      return bonus;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR27': {
    id: 'FR27',
    suit: 'wizard',
    name: 'Beastmaster',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 9 * hand.countSuit('beast');
    },
    clearsPenalty: function (card) {
      return card.suit === 'beast';
    },
    relatedSuits: ['beast'],
    relatedCards: []
  },
  'FR28': {
    id: 'FR28',
    suit: 'wizard',
    name: 'Necromancer',
    strength: 3,
    bonus: true,
    penalty: false,
    relatedSuits: ['army', 'leader', 'wizard', 'beast'],
    relatedCards: [],
    extraCard: true
  },
  'FR29': {
    id: 'FR29',
    suit: 'wizard',
    name: 'Warlock Lord',
    strength: 25,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      var leaderCount = !isLeaderClearedFromPenalty(this, hand) ? 0 : hand.countSuit('leader');
      return -10 * (leaderCount + hand.countSuitExcluding('wizard', this.id));
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'FR30': {
    id: 'FR30',
    suit: 'wizard',
    name: 'Enchantress',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 5 * (hand.countSuit('land') + hand.countSuit('weather') + hand.countSuit('flood') + hand.countSuit('flame'));
    },
    relatedSuits: ['land', 'weather', 'flood', 'flame'],
    relatedCards: []
  },
  'FR31': {
    id: 'FR31',
    suit: 'leader',
    name: 'King',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Queen') ? 20 : 5) * hand.countSuit('army');
    },
    relatedSuits: ['army'],
    relatedCards: ['Queen']
  },
  'FR32': {
    id: 'FR32',
    suit: 'leader',
    name: 'Queen',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('King') ? 20 : 5) * hand.countSuit('army');
    },
    relatedSuits: ['army'],
    relatedCards: ['King']
  },
  'FR33': {
    id: 'FR33',
    suit: 'leader',
    name: 'Princess',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 8 * (hand.countSuit('army') + hand.countSuit('wizard') + hand.countSuitExcluding('leader', this.id));
    },
    relatedSuits: ['army', 'wizard', 'leader'],
    relatedCards: []
  },
  'FR34': {
    id: 'FR34',
    suit: 'leader',
    name: 'Warlord',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'army') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'FR35': {
    id: 'FR35',
    suit: 'leader',
    name: 'Empress',
    strength: 15,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('army');
    },
    penaltyScore: function (hand) {
      if (!isLeaderClearedFromPenalty(this, hand)) {
        return -5 * hand.countSuitExcluding('leader', this.id);
      }
      return 0;
    },
    relatedSuits: ['army', 'leader'],
    relatedCards: []
  },
  'FR36': {
    id: 'FR36',
    suit: 'beast',
    name: 'Unicorn',
    strength: 9,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Princess') ? 30 : (hand.contains('Empress') || hand.contains('Queen') || hand.contains('Enchantress')) ? 15 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
  },
  'FR37': {
    id: 'FR37',
    suit: 'beast',
    name: 'Basilisk',
    strength: 35,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'leader' && !isLeaderClearedFromPenalty(this, hand)) ||
        (card.suit === 'beast' && !isBeastClearedFromPenalty(this, hand) && card.id !== this.id && card.id !== PHOENIX);
    },
    relatedSuits: ['army', 'leader', 'beast'],
    relatedCards: []
  },
  'FR38': {
    id: 'FR38',
    suit: 'beast',
    name: 'Warhorse',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') || hand.containsSuit('wizard') ? 14 : 0;
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'FR39': {
    id: 'FR39',
    suit: 'beast',
    name: 'Dragon',
    strength: 30,
    bonus: false,
    penalty: true,
    penaltyScore: function (hand) {
      return hand.containsSuit('wizard') ? 0 : -40;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR40': {
    id: 'FR40',
    suit: 'beast',
    name: 'Hydra',
    strength: 12,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Swamp') ? 28 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Swamp']
  },
  'FR41': {
    id: 'FR41',
    suit: 'weapon',
    name: 'Warship',
    strength: 23,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flood');
    },
    relatedSuits: ['army', 'flood'],
    relatedCards: []
  },
  'FR42': {
    id: 'FR42',
    suit: 'weapon',
    name: 'Magic Wand',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('wizard') ? 25 : 0;
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'FR43': {
    id: 'FR43',
    suit: 'weapon',
    name: 'Sword of Keth',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Shield of Keth') ? 40 : 10) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Shield of Keth']
  },
  'FR44': {
    id: 'FR44',
    suit: 'weapon',
    name: 'Elven Longbow',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.contains('Elven Archers') || hand.contains('Warlord') || hand.contains('Beastmaster') ? 30 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Elven Archers', 'Warlord', 'Beastmaster']
  },
  'FR45': {
    id: 'FR45',
    suit: 'weapon',
    name: 'War Dirigible',
    strength: 35,
    bonus: false,
    penalty: true,
    blankedIf: function (hand) {
      return (!hand.containsSuit('army') && !isArmyClearedFromPenalty(this, hand)) || hand.containsSuitExcluding('weather', PHOENIX);
    },
    relatedSuits: ['army', 'weather'],
    relatedCards: []
  },
  'FR46': {
    id: 'FR46',
    suit: 'artifact',
    name: 'Shield of Keth',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Sword of Keth') ? 40 : 15) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Sword of Keth']
  },
  'FR47': {
    id: 'FR47',
    suit: 'artifact',
    name: 'Gem of Order',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = 0;
      var runFound = false;
      do {
        var run = [];
        for (var i = 0; i < strengths.length; i++) {
          var strength = strengths[i];
          if (run.length !== 0 && (strength === run[run.length - 1] + 1)) {
            run.push(strength);
          } else if (run.length < 3 && !run.includes(strength)) {
            run = [strength];
          }
        }
        if (run.length < 3) {
          runFound = false;
        } else {
          runFound = true;
          for (var i = 0; i < run.length; i++) {
            strengths.splice(strengths.indexOf(run[i]), 1);
          }
          if (run.length === 3) {
            bonus += 10;
          } else if (run.length === 4) {
            bonus += 30;
          } else if (run.length === 5) {
            bonus += 60;
          } else if (run.length === 6) {
            bonus += 100;
          } else if (run.length >= 7) {
            bonus += 150;
          }
        }
      } while (runFound);
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR48': {
    id: 'FR48',
    suit: 'artifact',
    name: 'World Tree',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (suits.includes('weather') || suits.includes('flame')) {
            return 0;
          }
          suits.push('weather');
          suits.push('flame');
        }
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 50;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'FR49': {
    id: 'FR49',
    suit: 'artifact',
    name: 'Book of Changes',
    strength: 3,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
    relatedCards: []
  },
  'FR50': {
    id: 'FR50',
    suit: 'artifact',
    name: 'Protection Rune',
    strength: 1,
    bonus: true,
    penalty: false,
    clearsPenalty: function (card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR51': {
    id: 'FR51',
    suit: 'wild',
    name: 'Shapeshifter',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['artifact', 'leader', 'wizard', 'weapon', 'beast'].sort(),
    relatedCards: []
  },
  'FR52': {
    id: 'FR52',
    suit: 'wild',
    name: 'Mirage',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['army', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: []
  },
  'FR53': {
    id: 'FR53',
    suit: 'wild',
    name: 'Doppelgänger',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: [],
    relatedCards: []
  },
  'FR54': {
    id: 'FR54',
    suit: 'wizard',
    name: 'Jester',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var oddCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.strength % 2 === 1) {
          oddCount++;
        }
      }
      if (oddCount === hand.size()) {
        return 50;
      } else {
        return (oddCount - 1) * 3;
      }
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR55': {
    id: 'FR55',
    suit: 'beast',
    altSuits: ['flame', 'weather'],
    name: 'Phoenix',
    strength: 14,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return hand.containsSuit('flood');
    },
    relatedSuits: [],
    relatedCards: []
  },
  'FR55P': {
    id: 'FR55P',
    suit: 'beast',
    altSuits: ['flame', 'weather'],
    name: 'Phoenix (Promo)',
    strength: 14,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return hand.containsSuit('flood');
    },
    relatedSuits: [],
    relatedCards: []
  },
};

var cursedHoard = {
  'CH01': {
    id: 'CH01',
    suit: 'building',
    name: 'Dungeon',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('undead') ? 10 + (hand.countSuit('undead') - 1) * 5 : 0) +
        (hand.containsSuit('beast') ? 10 + (hand.countSuit('beast') - 1) * 5 : 0) +
        (hand.containsSuit('artifact') ? 10 + (hand.countSuit('artifact') - 1) * 5 : 0) +
        (hand.countCardName('Necromancer') * 5) +
        (hand.countCardName('Warlock Lord') * 5) +
        (hand.countCardName('Demon') * 5);
    },
    relatedSuits: ['undead', 'beast', 'artifact'],
    relatedCards: ['Necromancer', 'Warlock Lord', 'Demon']
  },
  'CH02': {
    id: 'CH02',
    suit: 'building',
    name: 'Castle',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('leader') ? 10 : 0) +
        (hand.containsSuit('army') ? 10 : 0) +
        (hand.containsSuit('land') ? 10 : 0) +
        (hand.containsSuitExcluding('building', this.id) ? 10 + (hand.countSuitExcluding('building', this.id) - 1) * 5 : 0);
    },
    relatedSuits: ['leader', 'army', 'land', 'building'],
    relatedCards: []
  },
  'CH03': {
    id: 'CH03',
    suit: 'building',
    name: 'Crypt',
    strength: 21,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'undead') {
          total += card.strength;
        }
      }
      return total;
    },
    blanks: function (card, hand) {
      return card.suit === 'leader' && !isLeaderClearedFromPenalty(this, hand);
    },
    relatedSuits: ['undead', 'leader'],
    relatedCards: []
  },
  'CH04': {
    id: 'CH04',
    suit: 'building',
    name: 'Chapel',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      if (hand.countSuit('leader') + hand.countSuit('wizard') + hand.countSuit('outsider') + hand.countSuit('undead') === 2) {
        return 40;
      } else {
        return 0;
      }
    },
    relatedSuits: ['leader', 'wizard', 'outsider', 'undead'],
    relatedCards: []
  },
  'CH05': {
    id: 'CH05',
    suit: 'land',
    name: 'Garden',
    strength: 11,
    bonus: true,
    penalty: true,
    bonusScore: function (hand) {
      return 11 * (hand.countSuit('leader') + hand.countSuit('beast'));
    },
    blankedIf: function (hand) {
      return hand.containsSuit('undead') || hand.contains('Necromancer') || hand.contains('Demon');
    },
    relatedSuits: ['leader', 'beast', 'undead'],
    relatedCards: ['Necromancer', 'Demon']
  },
  'CH06': {
    id: 'CH06',
    suit: 'outsider',
    name: 'Genie',
    strength: -50,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * (playerCount - 1);
    },
    relatedSuits: [],
    relatedCards: ['Leprechaun'],
    extraCard: true,
    referencesPlayerCount: true
  },
  'CH07': {
    id: 'CH07',
    suit: 'outsider',
    name: 'Judge',
    strength: 11,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var bonus = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.penalty && !card.penaltyCleared) {
          bonus += 10;
        }
      }
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'CH08': {
    id: 'CH08',
    suit: 'outsider',
    name: 'Angel',
    strength: 16,
    bonus: true,
    action: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'CH09': {
    id: 'CH09',
    suit: 'outsider',
    name: 'Leprechaun',
    strength: 20,
    bonus: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: [],
    extraCard: true
  },
  'CH10': {
    id: 'CH10',
    suit: 'outsider',
    name: 'Demon',
    strength: 45,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return card.suit !== 'outsider' && hand.countSuit(card.suit) === 1 && card.id !== PHOENIX;
    },
    relatedSuits: ['outsider'],
    relatedCards: []
  },
  'CH11': {
    id: 'CH11',
    suit: 'undead',
    name: 'Dark Queen',
    strength: 10,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return (5 * (discard.countSuit('land') + discard.countSuit('flood') + discard.countSuit('flame') + discard.countSuit('weather')))
        + (discard.contains('Unicorn') ? 5 : 0);
    },
    relatedSuits: ['land', 'flood', 'flame', 'weather'],
    relatedCards: ['Unicorn'],
    referencesDiscardArea: true
  },
  'CH12': {
    id: 'CH12',
    suit: 'undead',
    name: 'Ghoul',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 4 * (discard.countSuit('wizard') + discard.countSuit('leader') + discard.countSuit('army') + discard.countSuit('beast') + discard.countSuit('undead'));
    },
    relatedSuits: ['wizard', 'leader', 'army', 'beast', 'undead'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH13': {
    id: 'CH13',
    suit: 'undead',
    name: 'Specter',
    strength: 12,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 6 * (discard.countSuit('wizard') + discard.countSuit('artifact') + discard.countSuit('outsider'));
    },
    relatedSuits: ['wizard', 'artifact', 'outsider'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH14': {
    id: 'CH14',
    suit: 'undead',
    name: 'Lich',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Necromancer') ? 10 : 0) + 10 * hand.countSuitExcluding('undead', this.id);
    },
    relatedSuits: ['undead'],
    relatedCards: ['Necromancer']
  },
  'CH15': {
    id: 'CH15',
    suit: 'undead',
    name: 'Death Knight',
    strength: 14,
    bonus: true,
    penalty: false,
    bonusScore: function (hand, discard) {
      return 7 * (discard.countSuit('weapon') + discard.countSuit('army'));
    },
    relatedSuits: ['weapon', 'army'],
    relatedCards: [],
    referencesDiscardArea: true
  },
  'CH16': {
    id: 'CH16',
    suit: 'building',
    name: 'Bell Tower',
    replaces: 'FR03',
    strength: 8,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.containsSuit('wizard') || hand.containsSuit('undead')) ? 15 : 0;
    },
    relatedSuits: ['wizard', 'undead'],
    relatedCards: []
  },
  'CH17': {
    id: 'CH17',
    suit: 'flood',
    name: 'Fountain of Life',
    replaces: 'FR06',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'building' || card.suit === 'weapon' || card.suit === 'flood' || card.suit === 'flame' || card.suit === 'land' || card.suit === 'weather' || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['building', 'weapon', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'CH18': {
    id: 'CH18',
    suit: 'flood',
    name: 'Great Flood',
    replaces: 'FR08',
    strength: 32,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'building') ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || card.name === 'Phoenix';
    },
    relatedSuits: ['army', 'building', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'CH19': {
    id: 'CH19',
    suit: 'army',
    name: 'Rangers',
    replaces: 'FR25',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return 10 * (hand.countSuit('land') + hand.countSuit('building'));
    },
    relatedSuits: ['land', 'building', 'army'],
    relatedCards: []
  },
  'CH20': {
    id: 'CH20',
    suit: 'wizard',
    name: 'Necromancer',
    replaces: 'FR28',
    strength: 3,
    bonus: true,
    penalty: false,
    relatedSuits: ['army', 'leader', 'wizard', 'beast', 'undead'],
    relatedCards: [],
    extraCard: true
  },
  'CH21': {
    id: 'CH21',
    suit: 'artifact',
    name: 'World Tree',
    replaces: 'FR48',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = [];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (suits.includes('weather') || suits.includes('flame')) {
            return 0;
          }
          suits.push('weather');
          suits.push('flame');
        }
        if (suits.includes(card.suit)) {
          return 0;
        }
        suits.push(card.suit);
      }
      return 70;
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'CH22': {
    id: 'CH22',
    suit: 'wild',
    name: 'Shapeshifter',
    replaces: 'FR51',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['artifact', 'leader', 'wizard', 'weapon', 'beast', 'undead'].sort(),
    relatedCards: []
  },
  'CH23': {
    id: 'CH23',
    suit: 'wild',
    name: 'Mirage',
    replaces: 'FR52',
    strength: 0,
    bonus: true,
    penalty: false,
    impersonator: true,
    action: true,
    relatedSuits: ['army', 'building', 'land', 'weather', 'flood', 'flame'].sort(),
    relatedCards: []
  }
};

var cursedItems = {
  'CH24': {
    id: 'CH24',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Spyglass',
    timing: 'any-time',
    bonus: true,
    penalty: true,
    penaltyScore: function () {
      return playerCount === 2 ? -9 : 0;
    },
    strength: -1,
    referencesPlayerCount: true
  },
  'CH25': {
    id: 'CH25',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Sarcophagus',
    timing: 'replace-turn',
    bonus: true,
    strength: 5
  },
  'CH26': {
    id: 'CH26',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Blindfold',
    timing: 'replace-turn',
    bonus: true,
    strength: 5
  },
  'CH27': {
    id: 'CH27',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Book of Prophecy',
    timing: 'any-time',
    bonus: true,
    strength: -1
  },
  'CH28': {
    id: 'CH28',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Crystal Ball',
    timing: 'any-time',
    bonus: true,
    strength: -1
  },
  'CH29': {
    id: 'CH29',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Market Wagon',
    timing: 'replace-turn',
    bonus: true,
    strength: -2
  },
  'CH30': {
    id: 'CH30',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Backpack',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH31': {
    id: 'CH31',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Shovel',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH32': {
    id: 'CH32',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Sealed Vault',
    timing: 'any-time',
    bonus: true,
    strength: -4
  },
  'CH33': {
    id: 'CH33',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Crystal Lens',
    timing: 'any-time',
    bonus: true,
    strength: -2
  },
  'CH34': {
    id: 'CH34',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Larcenous Gloves',
    timing: 'any-time',
    bonus: true,
    strength: -3
  },
  'CH35': {
    id: 'CH35',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Junkyard Map',
    timing: 'any-time',
    bonus: true,
    strength: -3
  },
  'CH36': {
    id: 'CH36',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Winged Boots',
    timing: 'any-time',
    bonus: true,
    strength: -4
  },
  'CH37': {
    id: 'CH37',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Staff of Transmutation',
    timing: 'replace-turn',
    bonus: true,
    strength: -4
  },
  'CH38': {
    id: 'CH38',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Rake',
    timing: 'replace-turn',
    bonus: true,
    strength: -4
  },
  'CH39': {
    id: 'CH39',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Treasure Chest',
    timing: 'any-time',
    bonus: true,
    bonusScore: function (hand) {
      return hand.faceDownCursedItems().length > 3 ? 25 : 0;
    },
    strength: -5
  },
  'CH40': {
    id: 'CH40',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Fishhook',
    timing: 'replace-turn',
    bonus: true,
    strength: -6
  },
  'CH41': {
    id: 'CH41',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Repair Kit',
    timing: 'copy',
    bonus: true,
    strength: -6
  },
  'CH42': {
    id: 'CH42',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Hourglass',
    timing: 'after-turn',
    bonus: true,
    strength: -7
  },
  'CH43': {
    id: 'CH43',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Gold Mirror',
    timing: 'any-time',
    bonus: true,
    strength: -8
  },
  'CH44': {
    id: 'CH44',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Cauldron',
    timing: 'replace-turn',
    bonus: true,
    strength: -9
  },
  'CH45': {
    id: 'CH45',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Lantern',
    timing: 'replace-turn',
    bonus: true,
    strength: -10
  },
  'CH46': {
    id: 'CH46',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Portal',
    timing: 'any-time',
    bonus: true,
    strength: -20,
    extraCard: true
  },
  'CH47': {
    id: 'CH47',
    suit: 'cursed-item',
    cursedItem: true,
    name: 'Wishing Ring',
    timing: 'any-time',
    bonus: true,
    strength: -30
  }
}

var rrgItems = {
  'RG01': {
    id: 'RG01',
    suit: 'flood',
    name: 'River',
    strength: 15,
    bonus: true,
    penalty: false,
    action: true,
    bonusScore: function (hand) {
      return 0;
    },
    relatedSuits: ['flood', 'fire'],
    relatedCards: ['Bridge']
  },
  'RG02': {
    id: 'RG02',
    suit: 'flood',
    name: 'Bridge',
    strength: 13,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = strengths[strengths.length - 1] - strengths[0];
      if (hand.containsId("RG01")) {
        bonus += 20;
      }
      return bonus;
    },
    relatedSuits: ['flood'],
    relatedCards: ['River']
  },
  'RG03': {
    id: 'RG03',
    suit: 'wizard',
    name: 'Juggler',
    strength: 3,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var oddCards = hand.nonBlankedCards().map(card => card.strength).filter(function (a) { return (a % 2) - 1 == 0; });
      if (oddCards.length >= 7) {
        return 57;
      }
      return (oddCards.length - 1) * 3; //without itself
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG04': {
    id: 'RG04',
    suit: 'weapon',
    name: 'Trebuchet',
    strength: 32,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('army');
    },
    bonusScore: function (hand) {
      return 0; //TODO
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'RG05': {
    id: 'RG05',
    suit: 'beast',
    altSuits: ['flame'],
    name: 'Phoenix',
    replaces: ['FR55', 'FR55P'],
    unselectable: true,
    strength: 20,
    bonus: true,
    penalty: true,
    penaltyScore: function (hand) {
      return hand.containsSuit('flood') ? -8 : 0;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG06': {
    id: 'RG06',
    suit: 'weapon',
    name: 'Wand',
    replaces: 'FR42',
    strength: 1,
    action: true,
    bonus: true,
    bonusScore: function(hand) {
      return hand.containsSuit('wizard') ? 25 : 0;
    },
    penalty: false,
    relatedSuits: ['wizard'], //TODO --> Magier
    relatedCards: []
  },
  'RG07': {
    id: 'RG07',
    suit: 'army',
    name: 'Monster hunter',
    strength: 10,
    bonus: true,
    bonusScore: function(hand) {
      var beastsInList = 0;
      for (const beast of ['Basilisk', 'Dragon', 'Unicorn', 'Hydra', 'Phoenix']) {
        beastsInList += (hand.contains(beast) ? 1 : 0)
      }
      return beastsInList == 1 ? 25 : 0;
    },
    penalty: false,
    blankedIf: function(hand) {
      return false //TODO hand.containsId("[BÄNDIGER_ID]")
    },
    relatedSuits: ['beast'],
    relatedCards: []
  },
  'RG08': {
    id: 'RG08',
    suit: 'army',
    name: 'Dwarfes',
    replaces: 'FR24',
    strength: 15,
    bonus: false,
    penalty: true,
    penaltyScore: function(hand) {
      return -3 * hand.countSuitExcluding('army', this.id);
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'RG09': {
    id: 'RG09',
    suit: 'army',
    name: 'Elves',
    replaces: 'FR22',
    strength: 9,
    bonus: true,
    bonusScore: function(hand) {
      var bonus = 0;
      if (hand.containsId('[MOND_ID]')) {
        bonus += 15;
      }
      if (hand.contains('Forest')) {
        bonus += 25;
      }
      return bonus;
    },
    penalty: false,
    relatedSuits: [],
    relatedCards: ['Forest'] //TODO: Mond
  },
  'RG10': {
    id: 'RG10',
    suit: 'army',
    name: 'Guard',
    strength: 11,
    bonus: true,
    penalty: false,
    relatedSuits: ['leader'],
    relatedCards: []
  },
  'RG11': {
    id: 'RG11',
    suit: 'army',
    name: 'Scout',
    replaces: 'FR25',
    strength: 6,
    bonus: true,
    bonusScore: function(hand) {
      return 10 * hand.countSuit('land');
    },
    penalty: false,
    relatedSuits: ['land', 'flame', 'flood', 'weather'],
    relatedCards: []
  },
  'RG12': {
    id: 'RG12',
    suit: 'army',
    name: 'Knight',
    replaces: 'FR21',
    strength: 24,
    bonus: true,
    bonusScore: ()=>0,
    penalty: true,
    penaltyScore: function(hand) {
      return hand.countSuit('leader') < 1 ? -10 : 0;
    },
    action: true,
    relatedSuits: ['land', 'flame', 'flood', 'weather'],
    relatedCards: []
  },
  'RG13': {
    id: 'RG13',
    suit: 'leader',
    name: 'Field mistress',
    replaces: 'FR34',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var total = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'army') {
          total += card.strength;
        }
      }
      return total;
    },
    relatedSuits: ['army'],
    relatedCards: []
  },
  'RG14': {
    id: 'RG14',
    suit: 'leader',
    name: 'King',
    replaces: 'FR31',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('Queen') ? 30 : 6) * (hand.countSuit('artifact')+hand.countSuit('land'));
    },
    relatedSuits: ['army'],
    relatedCards: ['Queen']
  },
  'RG15': {
    id: 'RG15',
    suit: 'leader',
    name: 'Queen',
    replaces: 'FR32',
    strength: 7,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return (hand.contains('King') ? 30 : 6) * (hand.countSuit('army')+hand.countSuit('weapon'));
    },
    relatedSuits: ['army'],
    relatedCards: ['King']
  },
  'RG16': {
    id: 'RG16',
    suit: 'leader',
    name: 'Scholar',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var quoteCount = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.id == this.id) {
          continue;
        }
        var cardName = jQuery.i18n.prop(card.id + '.name');
        for (const card2 of hand.nonBlankedCards()) {
          if (card2.id === card.id || card2.id === this.id) {
            continue;
          }
          if (card2.bonus) {
            var card2Bonus = jQuery.i18n.prop(card2.id + '.bonus');
            quoteCount += countInstances(card2Bonus, cardName);
          }
          if (card2.penalty) {
            var card2Penalty = jQuery.i18n.prop(card2.id + '.penalty');
            quoteCount += countInstances(card2Penalty, cardName);
          }
        }
      }
      return quoteCount * 12;
    },
    relatedSuits: ['army'],
    relatedCards: ['Queen']
  },
  'RG17': {
    id: 'RG17',
    suit: 'leader',
    name: 'Empress',
    strength: 15,
    bonus: true,
    bonusScore: function (hand) {
      return 10 * hand.countSuit('army');
    },
    penalty: true,
    penaltyScore: function(hand) {
      return -8 * hand.countSuitExcluding('leader', this.id)
    },
    relatedSuits: ['army'],
    relatedCards: ['King']
  },
  'RG18': {
    id: 'RG18',
    suit: 'beast',
    name: 'Hydra',
    replaces: 'FR40',
    strength: 9,
    bonus: true,
    bonusScore: function (hand) {
      if (hand.containsSuit('weapon')) {
        return 9 * Math.pow(2, hand.countSuit('weapon')) - 9;
      } else {
        return 0;
      }
    },
    penalty: false,
    relatedSuits: ['weapon'],
    relatedCards: []
  },
  'RG19': {
    id: 'RG19',
    suit: 'beast',
    name: 'Basilisk',
    replaces: 'FR37',
    strength: 35,
    bonus: false,
    penalty: true,
    relatedSuits: ['army', 'leader', 'beast'],
    relatedCards: []
  },
  'RG20': {
    id: 'RG20',
    suit: 'beast',
    name: 'Unicorn',
    replaces: 'FR36',
    strength: 9,
    bonus: true,
    bonusScore: function (hand) {
      return hand.contains('Princess') ? 30 : (hand.contains('Empress') || hand.contains('Queen') || hand.contains('Enchantress')) ? 15 : 0;
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
  },
  'RG21': {
    id: 'RG21',
    suit: 'beast',
    name: 'Pony Companion',
    strength: 4,
    bonus: true,
    bonusScore: function (hand) {
      return hand.contains('Scout') || hand.contains('Dwarfes') ? 25 : 0
    },
    relatedSuits: [],
    relatedCards: ['Princess', 'Empress', 'Queen', 'Enchantress']
  },
  'RG22': {
    id: 'RG22',
    suit: 'beast',
    name: 'Dragon',
    replaces: 'FR39',
    strength: 30,
    bonus: true,
    bonusScore: function(hand) {
      return 5 * (hand.countSuit('artifact')+hand.countSuit('weapon'));
    },
    penalty: true,
    penaltyScore: function (hand) {
      return -40;
    },
    blanks: function (card, hand) {
      if (!hand.containsSuit('wizard')) {
        return (card.suit == 'army' && !isArmyClearedFromPenalty(card, hand) ||
        card.suit == 'leader' && !isLeaderClearedFromPenalty(card, hand));
      } else {
        return false;
      }
      
    },
    relatedSuits: ['wizard'],
    relatedCards: []
  },
  'RG23': {
    id: 'RG23',
    suit: 'beast',
    name: 'Warhorse',
    replaces: 'FR38',
    strength: 8,
    bonus: true,
    bonusScore: function (hand) {
      return hand.contains('Knight') ? 24 : (hand.containsSuit('leader') ? 14 : 0);
    },
    relatedSuits: ['leader', 'wizard'],
    relatedCards: []
  },
  'RG24': {
    id: 'RG24',
    suit: 'artifact',
    name: 'Mystic Path',
    replaces: 'FR47',
    strength: 5,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var strengths = hand.nonBlankedCards().map(card => card.strength).sort(function (a, b) { return a - b; });
      var bonus = 0;
      var runFound = false;
      do {
        var run = [];
        for (var i = 0; i < strengths.length; i++) {
          var strength = strengths[i];
          if (run.length !== 0 && (strength === run[run.length - 1] + 1)) {
            run.push(strength);
          } else if (run.length < 4 && !run.includes(strength)) {
            run = [strength];
          }
        }
        if (run.length < 4) {
          runFound = false;
        } else {
          runFound = true;
          for (var i = 0; i < run.length; i++) {
            strengths.splice(strengths.indexOf(run[i]), 1);
          }
          if (run.length === 4) {
            bonus += 20;
          } else if (run.length === 5) {
            bonus += 60;
          } else if (run.length === 6) {
            bonus += 100;
          } else if (run.length >= 7) {
            bonus += 140;
          }
        }
      } while (runFound);
      return bonus;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG25': {
    id: 'RG25',
    suit: 'artifact',
    name: 'Amulet',
    replaces: 'FR50',
    strength: 1,
    bonus: true,
    bonusScore: function(hand) {
      return 13 * hand.countSuit('wizard');
    },
    penalty: false,
    clearsPenalty: function (card) {
      return true;
    },
    relatedSuits: [],
    relatedCards: []
  },
  'RG26': {
    id: 'RG26',
    suit: 'artifact',
    name: 'Book of Changes',
    replaces: 'FR49',
    strength: 3,
    bonus: true,
    penalty: false,
    action: true,
    relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use 'Book of Changes'
    relatedCards: []
  },
  'RG27': {
    id: 'RG27',
    suit: 'artifact',
    name: 'Telescope',
    strength: 6,
    bonus: true,
    penalty: false,
    relatedSuits: [],
    relatedCards: []
  },
  'RG28': {
    id: 'RG28',
    suit: 'artifact',
    name: 'World Tree',
    replaces: 'FR48',
    strength: 2,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var suits = ['artifact'];
      for (const card of hand.nonBlankedCards()) {
        if (isPhoenix(card)) {
          if (!suits.includes('flame')) {
            suits.push('flame');
          }
        }
        if (!suits.includes(card.suit)) {
          suits.push(card.suit);
        }
      }
      return suits.length == 6 ? 20 : (suits.length == 7 ? 70 : 0);
    },
    relatedSuits: allSuits(),
    relatedCards: []
  },
  'RG29': {
    id: 'RG29',
    suit: 'artifact',
    name: 'Kings Shield',
    replaces: 'FR46',
    strength: 4,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Queens Sword') ? 40 : 15) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Queens Sword']
  },
  'RG30': {
    id: 'RG30',
    suit: 'weapon',
    name: 'Queens Sword',
    replaces: 'FR43',
    strength: 6,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      return hand.containsSuit('leader') ? (hand.contains('Kings Shield') ? 40 : 10) : 0;
    },
    relatedSuits: ['leader'],
    relatedCards: ['Kings Shield']
  },
  'RG31': {
    id: 'RG31',
    suit: 'weapon',
    name: 'Net',
    strength: 16,
    bonus: true,
    penalty: false,
    clearsPenalty: function (card) {
      return card.suit === 'beast';
    },
    relatedSuits: ['beast'],
    relatedCards: []
  },
  'RG32': {
    id: 'RG32',
    suit: 'weapon',
    name: 'Ship',
    replaces: 'FR41',
    strength: 26,
    bonus: true,
    penalty: true,
    blankedIf: function (hand) {
      return !hand.containsSuit('flood');
    },
    relatedSuits: ['army', 'flood'],
    relatedCards: []
  },
  'RG33': {
    id: 'RG33',
    suit: 'weapon',
    name: 'Longbow',
    strength: 3,
    bonus: true,
    bonusScore: function(hand) {
      return hand.contains('Elves') || hand.contains('Field mistress') || hand.contains('Monster hunter') ? 30 : 0;
    },
    penalty: true,
    penaltyScore: function(hand) {
      if (hand.containsSuit('weather')) {
        if (!hand.contains('Moon')) {
          return 0;
        } else {
          return -15;
        }
      }
    },
    relatedSuits: ['weather'],
    relatedCards: ['Elves', 'Field mistress', 'Monster hunter', 'Moon']
  },
  'RG34': {
    id: 'RG34',
    suit: 'flood',
    name: 'Fountain of Life',
    replaces: 'FR06',
    strength: 1,
    bonus: true,
    penalty: false,
    bonusScore: function (hand) {
      var max = 0;
      for (const card of hand.nonBlankedCards()) {
        if (card.suit === 'beast' || card.suit === 'flood' || card.suit === 'flame' || card.suit === 'land' || card.suit === 'weather' || isPhoenix(card)) {
          if (card.strength > max) {
            max = card.strength;
          }
        }
      }
      return max;
    },
    relatedSuits: ['beast', 'flood', 'flame', 'land', 'weather'],
    relatedCards: []
  },
  'RG35': {
    id: 'RG35',
    suit: 'flood',
    name: 'Great Flood',
    replaces: 'FR08',
    strength: 33,
    bonus: false,
    penalty: true,
    blanks: function (card, hand) {
      return (card.suit === 'army' && !isArmyClearedFromPenalty(this, hand)) ||
        (card.suit === 'land' && card.name !== 'Mountain') ||
        (card.suit === 'flame' && card.name !== 'Lightning') || isPhoenix(card);
    },
    relatedSuits: ['army', 'land', 'flame'],
    relatedCards: ['Mountain', 'Lightning']
  },
  'RG36': {
    id: 'RG36',
    suit: 'flood',
    name: 'Swamp',
    replaces: 'FR07',
    strength: 17,
    bonus: true,
    bonusScore: function(hand) {
      var beastsInList = 0;
      for (const beast of ['Basilisk', 'Hydra']) {
        beastsInList += (hand.contains(beast) ? 1 : 0)
      }
      return beastsInList == 1 ? 20 : 0;
    },
    penalty: true,
    penaltyScore: function (hand) {
      var penaltyCards = hand.countSuit('flame');
      if (!isArmyClearedFromPenalty(this, hand)) {
        penaltyCards += hand.countSuit('army');
      }
      return -5 * penaltyCards;
    },
    relatedSuits: ['army', 'flame'],
    relatedCards: []
  },
  'RG37': {
    id: 'RG37',
    suit: 'flood',
    name: 'Sea',
    strength: 18,
    bonus: true,
    bonusScore: function(hand) {
      if (hand.contains('Ship')) {
        if (hand.contains('Moon') && hand.contains('Telescope')) {
          return 120;
        } else if (hand.contains('Net')) { 
          return 40;
        }
      }
      return 0;
    },
    penalty: false,
    relatedSuits: ['army', 'flame'],
    relatedCards: ['Ship', 'Net', 'Moon', 'Telescope']
  },
  'RG38': {
    id: 'RG38',
    suit: 'flood',
    name: 'Water creature',
    replaces: 'FR10',
    strength: 10,
    bonus: true,
    bonusScore: function(hand) {
      return 15 * hand.containsSuitExcluding('flood', this.id);
    },
    penalty: false,
    relatedSuits: ['flood'], //TODO: anderes Wesen
    relatedCards: []
  },

}

var rrgExtraItems = {
  'RGE01': {
    id: 'RGE01',
    suit: 'beast',
    name: 'Oxen',
    impersonator: true,
    strength: 10,
    bonus: false,
    bonusScore: ()=>0,
    penalty: false,
    penaltyScore: ()=>0,
    action: false,
    relatedSuits: [],
    relatedCards: []
  }
}

var deck = {
  cards: { ...base, ...rrgItems },
  enabledStacks: [base, rrgItems],
  cursedItems: {},
  enableCursedHoardSuits: function () {
    this.addStackToCards(cursedHoard);
  },
  disableCursedHoardSuits: function () {
    this.removeStackFromCards(cursedHoard);
  },
  enableCursedHoardItems: function () {
    this.cursedItems = cursedItems;
  },
  disableCursedHoardItems: function () {
    this.cursedItems = {};
  },
  enableRereadgamesEdition: function () {
    this.addStackToCards(rrgItems);
    BOOK_OF_CHANGES = RRG_BOOK_OF_CHANGES;
  },
  disableRereadgamesEdition: function () {
    this.removeStackFromCards(rrgItems);
    BOOK_OF_CHANGES = ORG_BOOK_OF_CHANGES;
  },
  addStackToCards: function(stack) {
    if (this.enabledStacks.indexOf(stack) < 0) {
      this.enabledStacks.push(stack);
    }
    this.refreshStack();
  },
  removeStackFromCards: function(stack) {
    this.enabledStacks.splice(this.enabledStacks.indexOf(stack), 1);
    this.refreshStack();
  },
  refreshStack: function() {
    this.cards = {};
    for (const stack of this.enabledStacks) {
      this.cards = { ...this.cards, ...stack }
      this.checkReplacementCards();
    }
  },
  checkReplacementCards: function() {
    for (const id in this.cards) {
      const card = this.cards[id];
      if (card.replaces) {
        if (Array.isArray(card.replaces)) {
          for (const repl of card.replaces) {
            delete this.cards[repl];
          }
        } else {
          delete this.cards[card.replaces];
        }
      }
    }
  },
  getCardByName: function (cardName) {
    for (const id in this.cards) {
      const card = this.cards[id];
      if (card.name === cardName) {
        return card;
      }
    }
    for (const id in this.cursedItems) {
      const card = this.cursedItems[id];
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function (id) {
    if (typeof(id) == "number") {
      id = id.toString()
    }

    if (id.match(/^[0-9+]+$/)) {
      id = 'FR' + id.padStart(2, '0')
    }
    return this.cards[id] || this.cursedItems[id];
  },
  getCardsBySuit: function (suits) {
    var cardsBySuit = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    if (Object.keys(this.cursedItems).length > 0 && (suits === undefined || suits.includes('cursed-item'))) {
      ordered['cursed-item'] = [];
      for (const id in this.cursedItems) {
        ordered['cursed-item'].push(this.cursedItems[id]);
      }
    }
    Object.keys(cardsBySuit).sort((a, b) => jQuery.i18n.prop('suit.' + a).localeCompare(jQuery.i18n.prop('suit.' + b))).forEach(function (key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  },
  suits: function () {
    var suits = {};
    for (const id in this.cards) {
      const card = this.cards[id];
      suits[card.suit] = card.suit;
    }
    return Object.keys(suits).sort();
  }
};

function countInstances(string, word) {
  var count = string.split(word).length - 1;
  if (count > 0) {
    console.log("Found literal reference: " + word + " in string: " + string);
  }
  return count
}

function isArmyClearedFromPenalty(card, hand) {
  // FR25, CH19: Rangers: CLEARS the word Army from all Penalties
  // FR41/RG32: Warship/Ship: CLEARS the word Army from all Penalties of all Floods
  // RG07: Monster hunter: CLEARS the word Army from all Penalties of all Beasts
  // RG11: Scout: CLEARS the word Army from all Penalties of all Flames, Floods and Weathers
  return hand.containsId('FR25', true) || hand.containsId('CH19', true) || 
    (card.suit === 'flood' && hand.containsId('FR41', true)) || 
    (card.suit === 'flood' && hand.containsId('RG32', true)) || 
    (card.suit === 'beast' && hand.containsId('RG07', true)) ||
    (['flame', 'flood', 'weather'].includes(card.suit) && hand.containsId('RG11', true));
}

function isLeaderClearedFromPenalty(card, hand) {
  // RG10: Guard: CLEARS the word Leader from all Penalties
  return hand.containsId('RG10', true);
}

function isBeastClearedFromPenalty(card, hand) {
  // RG21: Pony Companion: CLEAR the word Beast from all Penalties
  return hand.containsId('RG21', true);
}

function allSuits() {
  return ['land', 'flood', 'weather', 'flame', 'army', 'wizard', 'leader', 'beast', 'weapon', 'artifact', 'wild', 'building', 'outsider', 'undead'].sort();
}

function isPhoenix(card) {
  return card.id === PHOENIX || card.id === PHOENIX_PROMO || card.id === RRG_PHOENIX;
}

var NONE = -1;
var ISLAND = 'FR09';
var NECROMANCER = 'FR28';
var BOOK_OF_CHANGES = 'FR49';
var ORG_BOOK_OF_CHANGES = 'FR49';
var SHAPESHIFTER = 'FR51';
var MIRAGE = 'FR52';
var DOPPELGANGER = 'FR53';
var PHOENIX = 'FR55';
var PHOENIX_PROMO = 'FR55P';

var RRG_RIVER = 'RG01';
var RRG_PHOENIX = 'RG05';
var RRG_WAND = 'RG06';
var RRG_OXEN = 'RGE01';
var RRG_KNIGHT = 'RG12';
var RRG_BASILISK = 'RG19';
var RRG_BOOK_OF_CHANGES = 'RG26';

var CH_NECROMANCER = 'CH20';
var CH_SHAPESHIFTER = 'CH22';
var CH_MIRAGE = 'CH23';
var CH_DEMON = 'CH10';
var CH_LICH = 'CH14';
var CH_ANGEL = 'CH08';

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, CH_MIRAGE, SHAPESHIFTER, CH_SHAPESHIFTER, BOOK_OF_CHANGES, RRG_BOOK_OF_CHANGES, ISLAND, CH_ANGEL, RRG_RIVER, RRG_WAND, RRG_KNIGHT];

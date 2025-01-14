Handlebars.registerHelper('i18n', function () {
  var key = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      key += arguments[arg];
    }
  }
  try {
    return jQuery.i18n.prop(key);
  } catch (e) {
    return key;
  }
});

Handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
      return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});

var languages = {
  'en': 'English',
  'de': 'Deutsch',
  'es': 'Español',
  'fr': 'Français',
  'pl': 'Polski',
  'pt': 'Português',
  'ua': 'Українська',
  'cz': 'Čeština',
  'kr': '한국어',
  'ru': 'Русский',
  'zh': '中文'
}

$(document).ready(function () {
  const lang = localStorage.getItem('language') || 'de';
  jQuery.i18n.properties({
    name: 'Messages',
    path: 'i18n/',
    mode: 'map',
    cache: true,
    language: lang,
    async: true,
    callback: function () {
      configureSelectedPlayerCount();
      configureSelectedExpansions();
      configureSound();
      showCards();
      getDiscardFromQueryString();
      getHandFromQueryString();
      $('#ch_items').change(function () {
        toggleCursedHoardItems();
      });
      $('#ch_suits').change(function () {
        toggleCursedHoardSuits();
      });
      $('#rrg_edition').change(function () {
        toggleRereadgamesEdition();
      });
      $('#rrg_edition_ext').change(function () {
        toggleRereadgamesEditionExt();
      });
      $('#rrg_buildings').change(function () {
        toggleRereadgamesBuildings();
      });
      $('#sound_state').change(function () {
        toggleSound();
      });
      updateLabels(lang);
    }
  });
});

var click = new Audio('sound/click.mp3');
var swoosh = new Audio('sound/swoosh.mp3');
var clear = new Audio('sound/clear.mp3');
var magic = new Audio('sound/magic.mp3');
var actionId = NONE;
var bookOfChangesSelectedCard = NONE;
var bookOfChangesSelectedSuit = undefined;
var cursedHoardItems = false;
var cursedHoardSuits = false;
var rereadgamesEdition = true;
var rereadgamesEditionExt = false;
var rereadgamesBuildings = false;
var playerCount = 4;
var inputDiscardArea = false;

function selectLanguage(lang) {
  localStorage.setItem('language', lang);
  jQuery.i18n.properties({
    name: 'Messages',
    path: 'i18n/',
    mode: 'map',
    cache: true,
    language: lang,
    async: true,
    callback: function () {
      swoosh.play();
      showCards();
      updateLabels(lang);
    }
  });
}

function updateLabels(lang) {
  $('#clear').attr('title', jQuery.i18n.prop('button.reset'));
  $('#lbl_ch_items').html(jQuery.i18n.prop('label.cursed-hoard.items'));
  $('#lbl_ch_suits').html(jQuery.i18n.prop('label.cursed-hoard.suits'));
  $('#lbl_rrg_edition').html(jQuery.i18n.prop('label.rrg.edition'));
  $('#lbl_rrg_edition_ext').html(jQuery.i18n.prop('label.rrg.edition.ext'));
  $('#lbl_rrg_buildings').html(jQuery.i18n.prop('label.rrg.buildings'));
  $('#sound-label').html(jQuery.i18n.prop('button.sound'));
  $('#selected-language').html(languages[lang]);
  $('#language .dropdown-item').removeClass('active');
  $('#lang-' + lang).addClass('active');
}

function configureSelectedExpansions() {
  if (window.location.search) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === 'expansions') {
        if (param[1].indexOf('ch_items') > -1) {
          cursedHoardItems = true;
          deck.enableCursedHoardItems();
          $('#ch_items').prop('checked', true);
        }
        if (param[1].indexOf('ch_suits') > -1) {
          cursedHoardSuits = true;
          deck.enableCursedHoardSuits();
          $('#ch_suits').prop('checked', true);
        }
        if (param[1].indexOf('rrg_edition') > -1) {
          rereadgamesEdition = true;
          deck.enableRereadgamesEdition();
          $('#rrg_edition').prop('checked', true);
        }
        if (param[1].indexOf('rrg_edition_ext') > -1) {
          rereadgamesEditionExt = true;
          deck.enableRereadgamesEditionExt();
          $('#rrg_edition_ext').prop('checked', true);
        }
        if (param[1].indexOf('rrg_buildings') > -1) {
          rereadgamesBuildings = true;
          deck.enableRereadgamesBuildings();
          $('#rrg_buildings').prop('checked', true);
        }
        return;
      }
    }
  }
  if (localStorage.getItem('ch_items') === true || localStorage.getItem('ch_items') === 'true') {
    cursedHoardItems = true;
    deck.enableCursedHoardItems();
    $('#ch_items').prop('checked', true);
  }
  if (localStorage.getItem('ch_suits') === true || localStorage.getItem('ch_suits') === 'true') {
    cursedHoardSuits = true;
    deck.enableCursedHoardSuits();
    $('#ch_suits').prop('checked', true);
  }
  if (localStorage.getItem('rrg_edition') === true || localStorage.getItem('rrg_edition') === 'true') {
    rereadgamesEdition = true;
    deck.enableRereadgamesEdition();
    $('#rrg_edition').prop('checked', true);
  }
  if (localStorage.getItem('rrg_edition_ext') === true || localStorage.getItem('rrg_edition_ext') === 'true') {
    rereadgamesEditionExt = true;
    deck.enableRereadgamesEditionExt();
    $('#rrg_edition_ext').prop('checked', true);
  }
  if (localStorage.getItem('rrg_buildings') === true || localStorage.getItem('rrg_buildings') === 'true') {
    rereadgamesBuildings = true;
    deck.enableRereadgamesBuildings();
    $('#rrg_buildings').prop('checked', true);
  }
}

function configureSound() {
  if (localStorage.getItem('sound_state') === false || localStorage.getItem('sound_state') === 'false') {
    click.muted = swoosh.muted = clear.muted = magic.muted = true;
    $('#sound_state').prop('checked', false);
  }
}

function configureSelectedPlayerCount() {
  if (window.location.search) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === 'playerCount') {
        playerCount = param[1];
        return;
      }
    }
  }
  if (localStorage.getItem('playerCount')) {
    playerCount = localStorage.getItem('playerCount');
  }
}

function toggleCursedHoardItems() {
  cursedHoardItems = !cursedHoardItems;
  localStorage.setItem('ch_items', cursedHoardItems);
  if (cursedHoardItems) {
    deck.enableCursedHoardItems();
  } else {
    deck.disableCursedHoardItems();
  }
  reset();
}

function toggleCursedHoardSuits() {
  cursedHoardSuits = !cursedHoardSuits;
  localStorage.setItem('ch_suits', cursedHoardSuits);
  if (cursedHoardSuits) {
    deck.enableCursedHoardSuits();
  } else {
    deck.disableCursedHoardSuits();
  }
  reset();
}

function toggleRereadgamesEdition() {
  rereadgamesEdition = !rereadgamesEdition;
  localStorage.setItem('rrg_edition', rereadgamesEdition);
  if (rereadgamesEdition) {
    deck.enableRereadgamesEdition();
  } else {
    deck.disableRereadgamesEdition();
  }
  reset();
}

function toggleRereadgamesEditionExt() {
  rereadgamesEditionExt = !rereadgamesEditionExt;
  localStorage.setItem('rrg_edition_ext', rereadgamesEditionExt);
  if (rereadgamesEditionExt) {
    deck.enableRereadgamesEditionExt();
  } else {
    deck.disableRereadgamesEditionExt();
  }
  reset();
}

function toggleRereadgamesBuildings() {
  rereadgamesBuildings = !rereadgamesBuildings;
  localStorage.setItem('rrg_buildings', rereadgamesBuildings);
  if (rereadgamesBuildings) {
    deck.enableRereadgamesBuildings();
  } else {
    deck.disableRereadgamesBuildings();
  }
  reset();
}

function toggleSound() {
  const enabled = $('#sound_state').prop('checked');
  localStorage.setItem('sound_state', enabled);
  click.muted = swoosh.muted = clear.muted = magic.muted = !enabled;
  clear.play();
}

function setPlayerCount(count) {
  click.play();
  playerCount = count;
  localStorage.setItem('playerCount', playerCount);
  updateHandView();
}

function reset() {
  clear.play();
  discard.clear();
  hand.clear();
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
        registration.unregister();
    } 
  });
  $.ajax({
    url: "",
    context: document.body,
    success: function(s,x){
      try {
        $('html[manifest=fantasy-realms.appcache]').attr('content', '');
        $(this).html(s);
      } catch (e) {
        //do nothing
      }
    }
  });
  showCards();
  updateHandView();
  actionId = NONE;
  bookOfChangesSelectedCard = NONE;
  bookOfChangesSelectedSuit = undefined;
  inputDiscardArea = false;
  $("#discard").hide();
  $("#hand").show();
}

function addToView(id) {
  if (inputDiscardArea) {
    if (discard.addCard(deck.getCardById(id))) {
      click.play();
      updateDiscardAreaView();
    }
  } else {
    if ([SHAPESHIFTER, CH_SHAPESHIFTER, RRG_SHAPESHIFTER, MIRAGE, CH_MIRAGE, RRG_MIRAGE, RRG_MIRROR].includes(actionId)) {
      click.play();
      magic.play();
      var duplicator = hand.getCardById(actionId);
      duplicator.actionData = [id];
      showCards();
      updateHandView();
      actionId = NONE;
    } else if (hand.addCard(deck.getCardById(id))) {
      click.play();
      if (discard.containsId(id)) {
        discard.deleteCardById(id);
      }
      updateHandView();
      actionId = NONE;
    }
  }
}

function selectFromHand(id) {
  const card = hand.getCardById(id);
  if (card.cursedItem) {
    removeFromHand(id);
  } else if (actionId === BOOK_OF_CHANGES) {
    if (id !== BOOK_OF_CHANGES && id !== PHOENIX) {
      click.play();
      bookOfChangesSelectedCard = id;
      performBookOfChanges();
    }
  } else if (actionId === DOPPELGANGER || actionId === RRG_DOPPELGANGER) {
    if (id !== DOPPELGANGER && id !== RRG_DOPPELGANGER) {
      click.play();
      magic.play();
      var actionCard = hand.getCardById(actionId);
      actionCard.actionData = [id];
      actionId = NONE;
      updateHandView();
    }
  } else if (actionId === ISLAND || actionId === RRG_RIVER || actionId === RRG_ISLAND) {
    if (card.suit === 'flood' || card.suit === 'flame' || isPhoenix(card)) {
      defaultAction(actionId, id)
    }
  } else if (actionId === CH_ANGEL || actionId === RRG_WAND) {
      defaultAction(actionId, id)
  } else if (actionId === RRG_KNIGHT) {
    if (card.suit === 'leader') {
      defaultAction(actionId, id);
    }
  } else if (actionId === RRG_TREBUCHET) {
    var actionCard = hand.getCardById(actionId);
    click.play();
    magic.play();
    if (!actionCard.actionData || !Array.isArray(actionCard.actionData)) {
      actionCard.actionData = [];
    }
    actionCard.actionData.push(id);
  } else if (actionId === NONE) {
    removeFromHand(id);
  }
}

function defaultAction(actionId, id) {
  var actionCard = hand.getCardById(actionId);
  actionId = NONE;
  click.play();
  magic.play();
  actionCard.actionData = [id];
  updateHandView();
}

function removeFromHand(id) {
  swoosh.play();
  hand.deleteCardById(id);
  updateHandView();
}

function removeFromDiscard(id) {
  swoosh.play();
  discard.deleteCardById(id);
  updateDiscardAreaView();
}

function updateHandView() {
  var template = Handlebars.compile($("#hand-template").html());
  var score = hand.score(discard);
  var html = template({
    playerCards: hand.faceDownCursedItems().concat(hand.cards()),
    playerCount: playerCount,
    playerCounts: [2, 3, 4, 5, 6]
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#hand').html(html);
  if (score >= 0) {
    $('#points').text(('000' + score).slice(-3));
  } else {
    $('#points').text('-' + ('000' + Math.abs(score)).slice(-3));
  }
  $('#cardCount').text(hand.size());
  $('#cardLimit').text(hand.limit());
  if (hand.empty()) {
    $('#settings').show();
  } else {
    $('#settings').hide();
  }
  updateUrl();
}

function updateDiscardAreaView() {
  var template = Handlebars.compile($("#discard-template").html());
  var score = hand.score(discard);
  var html = template({
    discard: discard.cards()
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#discard').html(html);
  if (score >= 0) {
    $('#points').text(('000' + score).slice(-3));
  } else {
    $('#points').text('-' + ('000' + Math.abs(score)).slice(-3));
  }
  updateUrl();
}

function updateUrl() {
  var params = [];
  if (cursedHoardItems || cursedHoardSuits || rereadgamesEdition || rereadgamesEditionExt || rereadgamesBuildings) {
    var expansions = [];
    if (cursedHoardItems) {
      expansions.push('ch_items');
    }
    if (cursedHoardSuits) {
      expansions.push('ch_suits')
    }
    if (rereadgamesEdition) {
      expansions.push('rrg_edition')
    }
    if (rereadgamesEditionExt) {
      expansions.push('rrg_edition_ext')
    }
    if (rereadgamesBuildings) {
      expansions.push('rrg_buildings')
    }
    params.push('expansions=' + expansions.join(','));
    params.push('playerCount=' + playerCount);
  }
  if (!hand.empty()) {
    params.push('hand=' + hand.toString());
  }
  if (discard.size() > 0) {
    params.push('discard=' + discard.toString());
  }
  if (params.length > 0) {
    history.replaceState(null, null, "index.html?" + params.join('&'));
  } else {
    history.replaceState(null, null, "index.html");
  }
}

function getHandFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'hand') {
      hand.loadFromString(decodeURIComponent(param[1]).replace(/ /g, '+'));
    }
  }
  updateHandView();
}

function getDiscardFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'discard') {
      discard.loadFromString(decodeURIComponent(param[1]));
    }
  }
}

function finishCardMultiAction(id) {
  updateHandView();
}

function useCardAction(id) {
  click.play();
  actionId = id;
  hand.undoCardAction(id);
  showCards();
  if (id === BOOK_OF_CHANGES) {
    bookOfChangesSelectedCard = NONE;
    bookOfChangesSelectedSuit = undefined;
    var template = Handlebars.compile($("#suit-selection-template").html());
    var html = template({
      suits: deck.suits()
    }, {
      allowProtoMethodsByDefault: true
    });
    $('#cards').html(html);
  } else if ([SHAPESHIFTER, CH_SHAPESHIFTER, RRG_SHAPESHIFTER, MIRAGE, CH_MIRAGE, RRG_MIRAGE, RRG_MIRROR].includes(id)) {
    var duplicator = hand.getCardById(id);
    if (id == RRG_SHAPESHIFTER) {
      var oxen = rrgExtraItems[RRG_OXEN];
      deck.cards[oxen.id] = oxen;
    }
    showCards(duplicator.card.relatedSuits);
  }
  updateHandView();
  $('#card-action-text-' + id).text(jQuery.i18n.prop(id + '.action'));
  $('#card-action-use-' + id).hide();
  var card = hand.getCardById(id);
  if (card.multiAction) {
    $('#card-action-done-' + id).show();
  }
  $('#card-action-cancel-' + id).show();
}

function cancelCardAction(id) {
  click.play();
  hand.undoCardAction(id)
  actionId = NONE;
  bookOfChangesSelectedCard = NONE;
  bookOfChangesSelectedSuit = undefined;
  $('#card-action-done-' + id).hide();
  $('#card-action-cancel-' + id).hide();
  $('#card-action-use-' + id).show();
  showCards();
  updateHandView();
}

function performBookOfChanges() {
  if (bookOfChangesSelectedCard !== NONE && bookOfChangesSelectedSuit !== undefined) {
    magic.play();
    var bookOfChanges = hand.getCardById(BOOK_OF_CHANGES);
    bookOfChanges.actionData = [bookOfChangesSelectedCard, bookOfChangesSelectedSuit];
    showCards();
    updateHandView();
    actionId = NONE;
  }
}

function selectSuit(suit) {
  click.play();
  bookOfChangesSelectedSuit = suit;
  performBookOfChanges();
}

function switchToDiscardArea() {
  click.play();
  inputDiscardArea = true;
  updateDiscardAreaView();
  showCards(allSuits());
  $("#hand").hide();
  $("#discard").show();
}

function switchToHand() {
  click.play();
  inputDiscardArea = false;
  updateHandView();
  showCards();
  $("#discard").hide();
  $("#hand").show();
}

function showCards(suits, extraCards) {
  var template = Handlebars.compile($("#cards-template").html());

  /* if (extraCards) {
    for (var suit of Object.keys(extraCards)) {
      for (var card of extraCards[suit]) {
        cards[suit].push(card);
      }
    }
  } */

  var html = template({
    suits: deck.getCardsBySuit(suits),
  }, {
    allowProtoMethodsByDefault: true
  });
  $('#cards').html(html);
}

import Game from './js/game.js';
import Economy from './js/economy.js';
import UI from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const economy = new Economy(ui);
    const game = new Game(ui, economy);

    game.init();

    console.log('Up Down Game Initialized');
});

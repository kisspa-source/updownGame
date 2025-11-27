export default class UI {
    constructor() {
        this.diceContainer = document.getElementById('dice-container');
        this.die1 = document.getElementById('die-1');
        this.die2 = document.getElementById('die-2');
        this.resultSum = document.getElementById('result-sum');

        this.walletDisplay = document.getElementById('wallet-balance');
        this.loanDisplay = document.getElementById('loan-balance');
        this.messageDisplay = document.getElementById('message-display');
        this.characterDisplay = document.getElementById('character-display');

        // Bet Selector Elements
        this.betSelector = document.getElementById('bet-selector');
        this.currentBetBtn = document.getElementById('current-bet-btn');
        this.currentBetValue = document.getElementById('current-bet-value');
        this.betOptions = document.getElementById('bet-options');

        this.bindBetEvents();
    }

    bindBetEvents() {
        this.currentBetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.betOptions.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            this.betOptions.classList.add('hidden');
        });

        this.betOptions.querySelectorAll('.coin-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = e.target.dataset.value;
                this.setBetValue(value);
                this.betOptions.classList.add('hidden');
            });
        });
    }

    setBetValue(value) {
        this.currentBetValue.textContent = value;
    }

    getBetValue() {
        return this.currentBetValue.textContent;
    }

    resetBoard() {
        this.diceContainer.classList.add('hidden');
        this.resultSum.classList.add('hidden');
        this.resultSum.textContent = '?';
    }

    animateDice(callback) {
        this.diceContainer.classList.remove('hidden');
        this.resultSum.classList.add('hidden');
        this.diceContainer.classList.add('rolling');

        // Randomize dice faces during animation
        const interval = setInterval(() => {
            this.die1.textContent = this.getRandomDieFace();
            this.die2.textContent = this.getRandomDieFace();
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            this.diceContainer.classList.remove('rolling');
            if (callback) callback();
        }, 1000); // 1 second animation
    }

    showDiceResult(d1, d2, sum) {
        this.die1.textContent = this.getDieFace(d1);
        this.die2.textContent = this.getDieFace(d2);
        this.resultSum.textContent = `Sum: ${sum}`;
        this.resultSum.classList.remove('hidden');
    }

    getRandomDieFace() {
        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return faces[Math.floor(Math.random() * 6)];
    }

    getDieFace(num) {
        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return faces[num - 1];
    }

    updateWallet(amount) {
        this.walletDisplay.textContent = amount;
    }

    updateLoan(amount) {
        this.loanDisplay.textContent = amount;
    }

    updateInterest(rate) {
        this.interestDisplay = document.getElementById('interest-rate'); // Lazy load or add to constructor
        if (this.interestDisplay) this.interestDisplay.textContent = (rate * 100) + '%';
    }

    showMessage(msg) {
        this.messageDisplay.textContent = msg;
    }

    setMood(mood) {
        // mood: 'neutral', 'happy', 'sad'
        const face = this.characterDisplay.querySelector('.face');
        face.className = `face ${mood}`;
    }
}

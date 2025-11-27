export default class Game {
    constructor(ui, economy) {
        this.ui = ui;
        this.economy = economy;
    }

    init() {
        this.ui.resetBoard();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btn-up').addEventListener('click', () => this.handleBet('up'));
        document.getElementById('btn-down').addEventListener('click', () => this.handleBet('down'));

        // Loan/Repay buttons with hold-to-repeat functionality
        this.setupHoldButton('btn-loan', () => this.handleLoan());
        this.setupHoldButton('btn-repay', () => this.handleRepay());
    }

    setupHoldButton(btnId, callback) {
        const btn = document.getElementById(btnId);
        let interval = null;

        const startRepeat = () => {
            callback(); // Execute immediately
            interval = setInterval(callback, 150); // Repeat every 150ms
        };

        const stopRepeat = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        btn.addEventListener('mousedown', startRepeat);
        btn.addEventListener('mouseup', stopRepeat);
        btn.addEventListener('mouseleave', stopRepeat);

        // Touch support for mobile
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startRepeat();
        });
        btn.addEventListener('touchend', stopRepeat);
        btn.addEventListener('touchcancel', stopRepeat);
    }

    getBetAmount() {
        const val = this.ui.getBetValue();
        if (val === 'ALL') {
            return this.economy.wallet;
        }
        return parseInt(val, 10) || 0;
    }

    handleBet(choice) {
        const betAmount = this.getBetAmount();
        if (betAmount <= 0) {
            this.ui.showMessage("Please enter a valid bet amount!");
            return;
        }

        if (!this.economy.placeBet(betAmount)) {
            this.ui.showMessage("Not enough coins!");
            this.ui.setMood('sad');
            return;
        }

        this.ui.showMessage("Rolling dice...");
        this.ui.setMood('neutral');

        this.ui.animateDice(() => {
            this.resolveTurn(choice, betAmount);
        });
    }

    resolveTurn(choice, betAmount) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;

        this.ui.showDiceResult(d1, d2, sum);

        let isWin = false;
        if (sum === 7) {
            isWin = false; // House edge
            this.ui.showMessage(`7! You lost ${betAmount}.`);
        } else if (choice === 'up' && sum > 7) {
            isWin = true;
        } else if (choice === 'down' && sum < 7) {
            isWin = true;
        }

        if (isWin) {
            this.economy.winBet(betAmount);
            this.ui.showMessage(`WIN! Sum was ${sum}. You won ${betAmount * 2}!`);
            this.ui.setMood('happy');
        } else if (sum !== 7) {
            this.ui.showMessage(`LOSE! Sum was ${sum}. You lost ${betAmount}.`);
            this.ui.setMood('sad');
        } else {
            this.ui.setMood('sad'); // 7 is also a sad loss
        }

        // Apply interest logic
        const interestPaid = this.economy.applyInterest();
        if (interestPaid > 0) {
            setTimeout(() => {
                this.ui.showMessage(`Interest applied: ${interestPaid} coins.`);
            }, 2000);
        }
    }

    handleLoan() {
        this.economy.takeLoan(100);
        this.ui.showMessage("Borrowed 100 coins.");
    }

    handleRepay() {
        if (this.economy.repayLoan(100)) {
            this.ui.showMessage("Repaid 100 coins.");
        } else {
            this.ui.showMessage("Cannot repay 100 coins (insufficient funds or loan).");
        }
    }
}

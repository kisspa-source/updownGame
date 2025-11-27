export default class Economy {
    constructor(ui) {
        this.ui = ui;
        this.wallet = 100;
        this.loan = 0;
        this.interestRate = 0.1; // 10%
    }

    updateUI() {
        this.ui.updateWallet(this.wallet);
        this.ui.updateLoan(this.loan);
        this.ui.updateInterest(this.interestRate);
    }

    canBet(amount) {
        return this.wallet >= amount;
    }

    placeBet(amount) {
        if (this.canBet(amount)) {
            this.wallet -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }

    winBet(amount) {
        // Win 2x the bet (original back + profit)
        this.wallet += amount * 2;
        this.updateUI();
    }

    takeLoan(amount) {
        this.loan += amount;
        this.wallet += amount;
        this.updateUI();
    }

    repayLoan(amount) {
        if (this.wallet >= amount && this.loan >= amount) {
            this.wallet -= amount;
            this.loan -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }

    applyInterest() {
        if (this.loan > 0) {
            const interest = Math.floor(this.loan * this.interestRate);
            this.loan += interest;
            this.updateUI();
            return interest; // Return interest amount for notification
        }
        return 0;
    }
}

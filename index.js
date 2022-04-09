function Block(el, count, callback) {
    this.element = document.querySelector(el);
    this.count = count;
    this.score = 0;
    this.callback = callback;
    this.frequency = 1;
    this.init();
    this.bindEvents();
    this.glowOrder = [];
}

Block.prototype.init = function() {
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= this.count; i++) {
        const iElem = document.createElement("div");
        iElem.classList.add("plain-block");
        iElem.style.width = 100 / this.count - 1 + "vw";
        iElem.style.height = 100 / this.count - 1 + "vw";
        iElem.dataset.value = i;
        fragment.appendChild(iElem);
    }
    this.element.appendChild(fragment);
    setHighScore();
}

Block.prototype.glow = function() {
    for (let i = 1; i <= this.frequency; i++) {
        this.glowOrder.push(random(1, 6))
    }
    const update = async(node) => {
        for (let i = 0; i < this.glowOrder.length; i++) {
            let node = document.querySelectorAll(`[data-value~="${this.glowOrder[i]}"]`)[0];
            const result = await blink(node, 'blue');
        }
    }
    update();
}

Block.prototype.onClick = function(e) {
    const value = Number(e.target.dataset.value);
    if (this.glowOrder[0] !== value) {
        blink(e.target, 'red').then(() => {});
        this.element.classList.add('shake');
        setTimeout(() => {
            this.element.classList.remove('shake');
        }, 1000);
        storeHighScore(this.score);
        this.score = 0;
        this.frequency = 1;
        this.glowOrder = [];
        updateScores(this.score);
        startButton.disabled = false;
        return;
    }
    this.glowOrder.shift();
    if (this.glowOrder.length === 0) {
        ++this.score;
        ++this.frequency;
        updateScores(this.score);
        this.glow();
    }
}

Block.prototype.bindEvents = function() {
    this.element.addEventListener("click", this.onClick.bind(this));
}

const blink = (el, color) => {
    return new Promise(resolve => {
        let element = el
        element.style.backgroundColor = color;
        setTimeout(() => {
            element.style.backgroundColor = '';
            setTimeout(() => resolve(), 300);
        }, 500)
    })
}

const updateScores = (score) => {
    const scoreDiv = document.querySelector('.score');
    scoreDiv.innerHTML = score || 0;
}

const setHighScore = () => {
    let score = localStorage.getItem('highScore') || 0;
    const scoreDiv = document.querySelector('.high-score');
    scoreDiv.innerHTML = score;
}

const storeHighScore = (score) => {
    let existingScore = localStorage.getItem('highScore') || 0;
    if (parseInt(existingScore) < parseInt(score)) {
        localStorage.setItem('highScore', score);
    }
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

let gameBlocks = new Block("#blocks", 5, () => {});

let startButton = document.querySelector('.start');
startButton.addEventListener("click", () => {
    gameBlocks.glow();
    setHighScore();
    startButton.disabled = true;
})
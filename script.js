// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainContent = document.getElementById('mainContent');
const successMessage = document.getElementById('successMessage');
const heartsContainer = document.getElementById('heartsContainer');
const sparklesContainer = document.getElementById('sparklesContainer');
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');

let musicPlaying = false;
let noBtnMoveCount = 0;

// Create floating hearts continuously
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Start creating hearts
setInterval(createFloatingHeart, 800);

// Create sparkles effect
function createSparkles(x, y) {
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';

        const angle = (Math.PI * 2 * i) / 15;
        const velocity = Math.random() * 50 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        sparkle.style.setProperty('--tx', vx + 'px');
        sparkle.style.setProperty('--ty', vy + 'px');

        sparklesContainer.appendChild(sparkle);

        sparkle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(1)`, opacity: 1, offset: 0.5 },
            { transform: `translate(${vx * 1.5}px, ${vy * 1.5}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });

        setTimeout(() => sparkle.remove(), 1500);
    }
}

// Create celebration hearts explosion
function createCelebrationHearts() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)];
            heart.style.left = (Math.random() * 100) + '%';
            heart.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            heartsContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 6000);
        }, i * 100);
    }
}

// Yes button click handler
yesBtn.addEventListener('click', (e) => {
    createSparkles(e.clientX, e.clientY);
    mainContent.classList.add('hidden');
    successMessage.classList.remove('hidden');
    createCelebrationHearts();

    // Play music if not already playing
    if (!musicPlaying) {
        backgroundMusic.play().catch(err => console.log('Music autoplay prevented'));
        musicPlaying = true;
        musicToggle.classList.add('playing');
    }
});

// No button hover/click handler - make it run away!
function moveNoButton() {
    noBtn.classList.add('moving');

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // Add margin from edges to keep button fully visible
    const margin = 20;
    const maxX = viewportWidth - btnWidth - margin;
    const maxY = viewportHeight - btnHeight - margin;

    // Calculate safe zone to avoid placing button too close to Yes button
    const yesRect = yesBtn.getBoundingClientRect();
    const safeDistance = 150;

    let newX, newY;
    let attempts = 0;
    const maxAttempts = 20;
    let foundGoodPosition = false;

    // Try to find a position that's not too close to the Yes button and is within bounds
    while (attempts < maxAttempts && !foundGoodPosition) {
        // Generate random position within safe bounds
        newX = Math.random() * (maxX - margin) + margin;
        newY = Math.random() * (maxY - margin) + margin;

        // Calculate distance from Yes button center
        const yesCenterX = yesRect.left + yesRect.width / 2;
        const yesCenterY = yesRect.top + yesRect.height / 2;
        const btnCenterX = newX + btnWidth / 2;
        const btnCenterY = newY + btnHeight / 2;

        const distance = Math.sqrt(
            Math.pow(btnCenterX - yesCenterX, 2) +
            Math.pow(btnCenterY - yesCenterY, 2)
        );

        // Check if position is good (far enough from Yes button and within bounds)
        if (distance > safeDistance && newX >= margin && newY >= margin && newX <= maxX && newY <= maxY) {
            foundGoodPosition = true;
        }

        attempts++;
    }

    // If we couldn't find a good position, just place it in a safe corner
    if (!foundGoodPosition) {
        const corners = [
            { x: margin, y: margin }, // top-left
            { x: maxX, y: margin }, // top-right
            { x: margin, y: maxY }, // bottom-left
            { x: maxX, y: maxY }  // bottom-right
        ];

        // Pick a random corner
        const corner = corners[Math.floor(Math.random() * corners.length)];
        newX = corner.x;
        newY = corner.y;
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    noBtnMoveCount++;

    // Make the No button text more desperate after several attempts
    if (noBtnMoveCount === 3) {
        noBtn.textContent = 'Really?';
    } else if (noBtnMoveCount === 5) {
        noBtn.textContent = 'Think again... 🥺';
    } else if (noBtnMoveCount === 7) {
        noBtn.textContent = 'Please? 💕';
    }
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Click also moves it (in case hover doesn't work on mobile)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Music toggle
musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🔇';
    } else {
        backgroundMusic.play().catch(err => {
            console.log('Music play prevented:', err);
        });
        musicPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎵';
    }
});

// Initial sparkles on load
window.addEventListener('load', () => {
    setTimeout(() => {
        createSparkles(window.innerWidth / 2, window.innerHeight / 2);
    }, 500);
});

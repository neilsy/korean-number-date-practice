/* SPDX-FileCopyrightText: 2026 Neil Brandt
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// app.js - Main application logic for Phase 1b
import { modes } from './modes.js';

// Current mode and selected strategy (based on enabled mode definitions)
let currentMode = modes.find(m => m.enabled)?.id;
let currentCardStrategy = modes.find(m => m.id === currentMode)?.strategy;
let currentCard = {value: 0}; // placeholder just needs a value

// Direction: 'forward' = prompt→answer (123→한), 'reverse' = answer→prompt (한→123)
let currentDirection = 'forward';

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon) return;

    themeIcon.src = theme === 'dark' ? 'icons/moon.svg' : 'icons/sun.svg';
    themeIcon.alt = theme === 'dark' ? 'Moon icon' : 'Sun icon';
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
}

// Direction toggle
function initializeDirectionToggle() {
    document.querySelectorAll('.direction-option').forEach(button => {
        button.addEventListener('click', () => {
            const newDirection = button.dataset.direction;
            if (newDirection === currentDirection) return;
 
            currentDirection = newDirection;
 
            // Update active state on buttons
            document.querySelectorAll('.direction-option').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.direction === currentDirection);
            });
 
            // Reset to start screen when direction changes
            showScreen('startScreen');
        });
    });
}

// Mode selection
function initializeModeSelector() {
    const modeSelector = document.getElementById('modeSelector');
    const overlay = document.getElementById('overlay');
    const bottomSheet = document.getElementById('bottomSheet');
    const modeList = document.getElementById('modeList');

    // Build mode list from data model
    modes.forEach(mode => {
        const item = document.createElement('li');
        item.className = 'mode-item';
        if (!mode.enabled) {
            item.classList.add('disabled');
            item.textContent = mode.label;
        } else {
            item.setAttribute('data-mode', mode.id);
            item.textContent = mode.label;
            item.addEventListener('click', () => {
                selectMode(mode.id);
                closeBottomSheet();
            });
        }

        if (mode.id === currentMode) {
            item.classList.add('active');
            if (mode.enabled) {
                item.textContent = '✓ ' + item.textContent;
            }
        }

        modeList.appendChild(item);
    });

    modeSelector.addEventListener('click', () => {
        // Toggle behavior: open when closed, close when already open
        const isOpen = bottomSheet.classList.contains('open');
        if (isOpen) {
            closeBottomSheet();
        } else {
            bottomSheet.scrollTop = 0;
            overlay.style.display = 'block';
            bottomSheet.classList.add('open');
        }
    });

    overlay.addEventListener('click', closeBottomSheet);
}

function selectMode(modeId) {
    currentMode = modeId;
    const mode = modes.find(m => m.id === modeId);

    if (!mode) {
        return;
    }

    // Set label and strategy
    document.getElementById('currentMode').textContent = mode.label;
    currentCardStrategy = mode.strategy || currentCardStrategy;

    // Update active class and checkmark
    document.querySelectorAll('.mode-item').forEach(item => {
        item.classList.remove('active');
        item.textContent = item.textContent.replace('✓ ', '');
    });

    const activeItem = document.querySelector(`[data-mode="${modeId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.textContent = '✓ ' + activeItem.textContent;
    }

    // Reset to start screen when mode changes
    showScreen('startScreen');
}

function closeBottomSheet() {
    const overlay = document.getElementById('overlay');
    const bottomSheet = document.getElementById('bottomSheet');
    overlay.style.display = 'none';
    bottomSheet.classList.remove('open');
}

// Card management
function initializeCardInterface() {
    const startButton = document.getElementById('startButton');
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    const nextButton = document.getElementById('nextButton');

    startButton.addEventListener('click', startPractice);
    cardFront.addEventListener('click', flipCard);
    cardBack.addEventListener('click', unflipCard);
    nextButton.addEventListener('click', (event) => {
        event.stopPropagation();
        nextCard();
    });
}

function startPractice() {
    newCard();
    showScreen('cardFront');
}

function newCard() {
    const lastCard = currentCard;
    currentCard = currentCardStrategy(lastCard);

    const frontContent = document.getElementById('frontContent');
    const backContent = document.getElementById('backContent');

    if (currentDirection === 'forward') {
        frontContent.textContent = currentCard.prompt;
        backContent.textContent = currentCard.answer;
    } else {
        frontContent.textContent = currentCard.answer;
        backContent.textContent = currentCard.prompt;
    }
 
    if (currentCard.longAnswers) {
        frontContent.classList.add('long-answer');
        backContent.classList.add('long-answer');
    } else {
        frontContent.classList.remove('long-answer');
        backContent.classList.remove('long-answer');
    }
}

function flipCard() {
    showScreen('cardBack');
    document.getElementById('cardBack').classList.add('flip');
    document.getElementById('cardFront').classList.remove('unflip');
}

function unflipCard() {
    showScreen('cardFront');
    document.getElementById('cardFront').classList.add('unflip');
    document.getElementById('cardBack').classList.remove('flip');
}

function nextCard() {
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    
    // Get the currently active card
    const activeCard = document.querySelector('.screen.active');
    
    // Add slide-out animation
    activeCard.classList.add('slide-out');
    
    // Wait for slide-out to complete, then update content and slide in
    setTimeout(() => {
        newCard();
        showScreen('cardFront');
        
        // Add slide-in animation
        cardFront.classList.add('slide-in');
        
        // Clean up animation classes after animation completes
        setTimeout(() => {
            activeCard.classList.remove('slide-out');
            cardFront.classList.remove('slide-in');
        }, 260);
    }, 400);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDirectionToggle();
    initializeModeSelector();
    initializeCardInterface();

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
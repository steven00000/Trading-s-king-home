    const initialBalance = 10000;
    let balance = initialBalance;
    let numShares = 0;
    let price = 100;
    let history = [];
    let actionHistory = [];
    let stockedActions = {};

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Variables pour suivre la position de la souris
    let isDragging = false;
    let lastX;
    let lastY;

    // Variables pour suivre la position du canevas
    let canvasOffsetX = 0;
    let canvasOffsetY = 0;

    // Ajouter un écouteur d'événement pour suivre le début du mouvement de la souris
    canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    // Ajouter un écouteur d'événement pour suivre le mouvement de la souris
    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            
            // Mettre à jour la position du canevas
            canvasOffsetX += deltaX;
            canvasOffsetY += deltaY;

            // Redessiner la courbe
            plotHistory();

            // Mettre à jour la dernière position de la souris
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // Ajouter un écouteur d'événement pour suivre la fin du mouvement de la souris
    canvas.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function plotHistory() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, 400 - history[0]);

        for (let i = 1; i < history.length; i++) {
            const currentPrice = history[i];
            const previousPrice = history[i - 1];
            
            // Définir la couleur du segment en fonction de la variation du prix
            if (currentPrice < previousPrice) {
                ctx.strokeStyle = '#FF0000'; // Rouge si le prix a diminué
            } else if (currentPrice > previousPrice) {
                ctx.strokeStyle = '#00FF00'; // Vert si le prix a augmenté
            } else {
                ctx.strokeStyle = ''; // Bleu si le prix est resté le même
            }

            // Dessiner le segment correspondant
            ctx.lineTo(i * 10 + canvasOffsetX, 400 - currentPrice + canvasOffsetY);
            ctx.stroke();
            
            // Début d'un nouveau chemin pour éviter la liaison des segments colorés
            ctx.beginPath();
            ctx.moveTo(i * 10 + canvasOffsetX, 400 - currentPrice + canvasOffsetY);
        }
    }



    function generatePrice() {
        const newPrice = Math.max(1, price + Math.floor(Math.random() * 11) - 5);
        price = newPrice;
        history.push(newPrice);
    }

    function buyShare() {
        if (balance >= price) {
            balance -= price;
            numShares++;
            actionHistory.push(`Achat d'une action à ${price} €`);
            if (price in stockedActions) {
                stockedActions[price]++;
            } else {
                stockedActions[price] = 1;
            }
        }
    }

    function sellShare() {
        if (numShares > 0) {
            balance += price;
            numShares--;
            actionHistory.push(`Vente d'une action à ${price} €`);
            stockedActions[price]--;
            if (stockedActions[price] === 0) {
                delete stockedActions[price];
            }
        }
    }

    function updateDisplay() {
        document.getElementById('balance').innerText = `Solde : ${balance} €`;
        document.getElementById('shares').innerText = `Actions détenues : ${numShares}`;
        document.getElementById('price').innerText = `Prix de l'action : ${price} €`;
        generatePrice();
        plotHistory();
        updateStockedActions();
        updateActionHistory();
    }



    function updateStockedActions() {
        const actionsDiv = document.getElementById('actions');
        actionsDiv.innerHTML = '';
        for (const price in stockedActions) {
            const quantity = stockedActions[price];
            actionsDiv.innerHTML += `<p>${price} € : ${quantity} actions</p>`;
        }
    }

    function updateActionHistory() {
        const actionHistoryDiv = document.getElementById('actionHistory');
        actionHistoryDiv.innerHTML = '';
        for (let i = Math.max(0, actionHistory.length - 5); i < actionHistory.length; i++) {
            actionHistoryDiv.innerHTML += `<p>${actionHistory[i]}</p>`;
        }
    }

    function updateGame() {
        updateDisplay();
        setTimeout(updateGame, 500);
    }

    updateGame();














// Exemple avec Node.js et Express.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

// Configuration de session
app.use(session({
    secret: 'votre_secret_session',
    resave: false,
    saveUninitialized: false
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la stratégie OAuth2 de Discord
passport.use(new DiscordStrategy({
    clientID: 'votre_client_id',
    clientSecret: 'votre_client_secret',
    callbackURL: 'votre_url_de_redirection'
}, (accessToken, refreshToken, profile, done) => {
    // Vous pouvez stocker les informations de l'utilisateur dans la session ou la base de données ici
    return done(null, profile);
}));

// Sérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user);
});

// Désérialisation de l'utilisateur
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Route d'authentification avec Discord
app.get('/auth/discord', passport.authenticate('discord'));

// Callback d'authentification de Discord
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/login'
}), (req, res) => {
    // Redirection vers la page principale après l'authentification
    res.redirect('/');
});

// Middleware pour vérifier si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Route de la page principale
app.get('/', isAuthenticated, (req, res) => {
    // Récupérez les informations de l'utilisateur à partir de req.user et affichez-les sur la page
    const user = req.user;
    res.send(`<h1>Bienvenue, ${user.username}!</h1><img src="${user.avatar}" alt="Avatar">`);
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur le port 3000');
});

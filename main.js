import { Game } from './game/game.js';

let game;
  
function startGame(walletAddress) {
    console.log(`Game started for wallet: ${walletAddress}`);
    game = new Game();
}

window.onload = () => {
    const walletAddress = localStorage.getItem("wallet_address");
    if (walletAddress) {
        document.getElementById("connect-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame(walletAddress);
    }
};
// _____                    _____                    _____                    _____          
// /\    \                  /\    \                  /\    \                  /\    \         
// /::\    \                /::\    \                /::\____\                /::\    \        
// /::::\    \              /::::\    \              /::::|   |               /::::\    \       
// /::::::\    \            /::::::\    \            /:::::|   |              /::::::\    \      
// /:::/\:::\    \          /:::/\:::\    \          /::::::|   |             /:::/\:::\    \     
// /:::/  \:::\    \        /:::/__\:::\    \        /:::/|::|   |            /:::/__\:::\    \    
// /:::/    \:::\    \      /::::\   \:::\    \      /:::/ |::|   |           /::::\   \:::\    \   
// /:::/    / \:::\    \    /::::::\   \:::\    \    /:::/  |::|___|______    /::::::\   \:::\    \  
// /:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \  /:::/   |::::::::\    \  /:::/\:::\   \:::\    \ 
// /:::/____/  ___\:::|    |/:::/  \:::\   \:::\____\/:::/    |:::::::::\____\/:::/__\:::\   \:::\____\
// \:::\    \ /\  /:::|____|\::/    \:::\  /:::/    /\::/    / ~~~~~/:::/    /\:::\   \:::\   \::/    /
// \:::\    /::\ \::/    /  \/____/ \:::\/:::/    /  \/____/      /:::/    /  \:::\   \:::\   \/____/ 
// \:::\   \:::\ \/____/            \::::::/    /               /:::/    /    \:::\   \:::\    \     
// \:::\   \:::\____\               \::::/    /               /:::/    /      \:::\   \:::\____\    
// \:::\  /:::/    /               /:::/    /               /:::/    /        \:::\   \::/    /    
// \:::\/:::/    /               /:::/    /               /:::/    /          \:::\   \/____/     
// \::::::/    /               /:::/    /               /:::/    /            \:::\    \         
// \::::/    /               /:::/    /               /:::/    /              \:::\____\        
// \::/____/                \::/    /                \::/    /                \::/    /        
//                          \/____/                  \/____/                  \/____/  

// Global variables of the game
const game = {
  duckSide: "R",
  duckSpeed: 10,
  duckScore: 0,
  hunterScore: 0,
  ammo: 6,
  timer: 0,
  container: document.querySelector('.container'),
  gun: document.querySelector('#gun'),
  duck: null,
  startBtn: document.querySelector('#start'),
  easyBtn: document.querySelector('#easy'),
  normalBtn: document.querySelector('#normal'),
  hardBtn: document.querySelector('#hard'),
  duckAnimationInterval: null,
  keys: []
}

// So variables are more accessible (ex: game.duckScore --> duckScore)
let {
  duckSide,
  duckSpeed,
  duckScore,
  hunterScore,
  ammo,
  container,
  duck,
  gun,
  timer,
  duckAnimationInterval,
  startBtn,
  easyBtn,
  normalBtn,
  hardBtn,
  keys
} = game;

easyBtn.disabled = true;

easyBtn.addEventListener('click', () => {
  easyBtn.disabled = true;
  normalBtn.disabled = false;
  hardBtn.disabled = false;
  duckSpeed = 10;
})

normalBtn.addEventListener('click', () => {
  normalBtn.disabled = true;
  easyBtn.disabled = false;
  hardBtn.disabled = false;
  duckSpeed = 20;
})

hardBtn.addEventListener('click', () => {
  hardBtn.disabled = true;
  normalBtn.disabled = false;
  easyBtn.disabled = false;
  duckSpeed = 25;
})

//Get user cursor position in the window and replace his cursor with a shotgun
const gunCursor = () => {
  gun.classList.remove("hidden");

  container.style.cursor = "none";

  window.addEventListener('mousemove', e => {
      gun.style.left = (e.clientX - 14) + 'px';
      gun.style.top = (e.clientY - 12) + 'px';
  })
}

// Create duck on the game container and set his default look
const initDuck = () => {
  const duckImg = document.createElement('img');
  duckImg.src = "../img/duck3R.png";
  duckImg.classList.add('duck');
  container.appendChild(duckImg);
  duck = document.querySelector('.duck');
}



// Remove difficulty and start button, set and show countdown
const countdown = () => {
  const countdownElement = document.querySelector('.btn-area');

  const difficulty = document.querySelector('.difficulty');
  const command = document.querySelector('.command');

  countdownElement.removeChild(difficulty);
  countdownElement.removeChild(command);

  countdownElement.classList.add('panel-countdown');
  countdownElement.classList.add('countdown');

  let startMinutes = 2;
  timer = startMinutes * 60 - 1;
  countdownElement.innerText = `02:00`;

  timerClear = setInterval(() => {
      let minutes = parseInt(timer / 60, 10);
      let secondes = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      secondes = secondes < 10 ? '0' + secondes : secondes;

      countdownElement.innerText = `${minutes}:${secondes}`;
      timer = timer <= 0 ? 0 : timer - 1;

      if (timer == 0) {
          clearInterval(timerClear);
          document.removeEventListener('keydown', duckMovementEvent);
          duck.removeEventListener('mousedown', hunterShootBird);
          clearInterval(addDuckScore);

          if (hunterScore > duckScore) {
              document.write(`<h1>Hunter has won!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2><br><button onClick="window.location.reload();">New Game</button>`);
              const endingScreenDiv = document.createElement("div");
              const endingScreenImage = document.createElement("img");
              document.body.appendChild(endingScreenDiv);
              endingScreenImage.src = "../img/hunterSmirk.jpg";
              endingScreenDiv.appendChild(endingScreenImage);
          } else if (hunterScore == duckScore) {
              document.write(`<h1>Hunter and Duck have the same score. It's a tie!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2><br><button onClick="window.location.reload();">New Game</button>`);
              const endingScreenDiv = document.createElement("div");
              const endingScreenImage = document.createElement("img");
              document.body.appendChild(endingScreenDiv);
              endingScreenImage.src = "../img/tie.png";
              endingScreenDiv.appendChild(endingScreenImage);
          } else {
              document.write(`<h1>Duck has won!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2><br><button onClick="window.location.reload();">New Game</button>`);
              const endingScreenDiv = document.createElement("div");
              const endingScreenImage = document.createElement("img");
              document.body.appendChild(endingScreenDiv);
              endingScreenImage.src = "../img/duckSmirk.jpg";
              endingScreenDiv.appendChild(endingScreenImage);
          }
      }
  }, 1000)
}




// _____                    _____                    _____                    _____                   _______                   _____          
// /\    \                  /\    \                  /\    \                  /\    \                 /::\    \                 /\    \         
// /::\    \                /::\____\                /::\    \                /::\    \               /::::\    \               /::\    \        
// /::::\    \              /:::/    /               /::::\    \               \:::\    \             /::::::\    \             /::::\    \       
// /::::::\    \            /:::/    /               /::::::\    \               \:::\    \           /::::::::\    \           /::::::\    \      
// /:::/\:::\    \          /:::/    /               /:::/\:::\    \               \:::\    \         /:::/~~\:::\    \         /:::/\:::\    \     
// /:::/__\:::\    \        /:::/    /               /:::/  \:::\    \               \:::\    \       /:::/    \:::\    \       /:::/__\:::\    \    
// /::::\   \:::\    \      /:::/    /               /:::/    \:::\    \              /::::\    \     /:::/    / \:::\    \      \:::\   \:::\    \   
// /::::::\   \:::\    \    /:::/    /      _____    /:::/    / \:::\    \    ____    /::::::\    \   /:::/____/   \:::\____\   ___\:::\   \:::\    \  
// /:::/\:::\   \:::\    \  /:::/____/      /\    \  /:::/    /   \:::\ ___\  /\   \  /:::/\:::\    \ |:::|    |     |:::|    | /\   \:::\   \:::\    \ 
// /:::/  \:::\   \:::\____\|:::|    /      /::\____\/:::/____/     \:::|    |/::\   \/:::/  \:::\____\|:::|____|     |:::|    |/::\   \:::\   \:::\____\
// \::/    \:::\  /:::/    /|:::|____\     /:::/    /\:::\    \     /:::|____|\:::\  /:::/    \::/    / \:::\    \   /:::/    / \:::\   \:::\   \::/    /
// \/____/ \:::\/:::/    /  \:::\    \   /:::/    /  \:::\    \   /:::/    /  \:::\/:::/    / \/____/   \:::\    \ /:::/    /   \:::\   \:::\   \/____/ 
//  \::::::/    /    \:::\    \ /:::/    /    \:::\    \ /:::/    /    \::::::/    /             \:::\    /:::/    /     \:::\   \:::\    \     
//   \::::/    /      \:::\    /:::/    /      \:::\    /:::/    /      \::::/____/               \:::\__/:::/    /       \:::\   \:::\____\    
//   /:::/    /        \:::\__/:::/    /        \:::\  /:::/    /        \:::\    \                \::::::::/    /         \:::\  /:::/    /    
//  /:::/    /          \::::::::/    /          \:::\/:::/    /          \:::\    \                \::::::/    /           \:::\/:::/    /     
// /:::/    /            \::::::/    /            \::::::/    /            \:::\    \                \::::/    /             \::::::/    /      
// /:::/    /              \::::/    /              \::::/    /              \:::\____\                \::/____/               \::::/    /       
// \::/    /                \::/____/                \::/____/                \::/    /                 ~~                      \::/    /        
// \/____/                  ~~                       ~~                       \/____/                                           \/____/         


// Sound when duck has been hit
const playSoundScream = () => {
  let audio = new Audio('../audio/scream.mp3');
  audio.play();
}

// Sound when you shoot with shotgun (includes firing and reloading (cogging))
const playSoundShoot = () => {
  let shoot = new Audio('../audio/shoot.mp3');
  let cog = new Audio('../audio/cog.mp3');

  shoot.play();
  const cogInterval = setInterval(() => {
      clearInterval(cogInterval);
      cog.play();
  }, 400);

}

const playSoundTheme = () => {
  let audio = new Audio('../audio/theme.mp3');
  audio.play();
}


// _____                    _____                    _____                    _____          
// /\    \                  /\    \                  /\    \                  /\    \         
// /::\    \                /::\____\                /::\    \                /::\____\        
// /::::\    \              /:::/    /               /::::\    \              /:::/    /        
// /::::::\    \            /:::/    /               /::::::\    \            /:::/    /         
// /:::/\:::\    \          /:::/    /               /:::/\:::\    \          /:::/    /          
// /:::/  \:::\    \        /:::/    /               /:::/  \:::\    \        /:::/____/           
// /:::/    \:::\    \      /:::/    /               /:::/    \:::\    \      /::::\    \           
// /:::/    / \:::\    \    /:::/    /      _____    /:::/    / \:::\    \    /::::::\____\________  
// /:::/    /   \:::\ ___\  /:::/____/      /\    \  /:::/    /   \:::\    \  /:::/\:::::::::::\    \ 
// /:::/____/     \:::|    ||:::|    /      /::\____\/:::/____/     \:::\____\/:::/  |:::::::::::\____\
// \:::\    \     /:::|____||:::|____\     /:::/    /\:::\    \      \::/    /\::/   |::|~~~|~~~~~     
// \:::\    \   /:::/    /  \:::\    \   /:::/    /  \:::\    \      \/____/  \/____|::|   |          
// \:::\    \ /:::/    /    \:::\    \ /:::/    /    \:::\    \                    |::|   |          
// \:::\    /:::/    /      \:::\    /:::/    /      \:::\    \                   |::|   |          
// \:::\  /:::/    /        \:::\__/:::/    /        \:::\    \                  |::|   |          
// \:::\/:::/    /          \::::::::/    /          \:::\    \                 |::|   |          
// \::::::/    /            \::::::/    /            \:::\    \                |::|   |          
// \::::/    /              \::::/    /              \:::\____\               \::|   |          
// \::/____/                \::/____/                \::/    /                \:|   |          
// ~~                       ~~                       \/____/                  \|___|          


// Swaps between bird pictures to make it look like it's flying in the air depending on where it's flying towards
const setDuckAnimation = () => {
  let counter = 3;

  duckAnimationInterval = setInterval(() => {
      if (counter < 1) {
          counter = 3;
      }
      duck.src = `../img/Duck${counter}${duckSide}.png`;
      counter--;
  }, 250)
}

// Display dead duck animation
const setDeadDuckAnimation = () => {
  clearInterval(duckAnimationInterval);
  duck.src = `../img/dead.png`;

  setTimeout(() => {
      setDuckAnimation();
  }, 1250);
}

// Make dead duck falls into the ground
const setDeadDuckPosition = () => {
  const duckY = duck.style.top.slice(0, -2);

  for (let i = duckY; i < 500; i++) {
      setTimeout(() => {
          duck.style.top = i + "px";
      }, i * 1)
  }
}

// When duck is hit, make the duck invunerable for a set delay, to avoid spamming..
const setDuckGodMode = () => {
  duck.removeEventListener('mousedown', hunterShootBird);
  document.removeEventListener('keydown', duckMovementEvent);


  setTimeout(() => {
      duckMovement();
      hunterShoot();
  }, 1500)
}

// Execute all the related functions to duck being dead
const setDeadDuck = () => {
  setDeadDuckPosition();
  setDeadDuckAnimation();
  setDuckGodMode();
}

// Event listener callback on pressed keys to move duck with multiple keyboards layout (AZERTY, QWERTY)
const duckMovementEvent = (e) => {
  let x = parseInt(duck.style.left) || 0;
  let y = parseInt(duck.style.top) || 0;

  // Store pressed keys when key is down
  keys[e.keyCode] = true;

  // Moves with Arrow Keys

  // LEFT
  if (keys[37]) {
      x -= duckSpeed;
      duckSide = "L";
  }

  // UP
  if (keys[38]) {
      y -= duckSpeed;
  }

  // RIGHT
  if (keys[39]) {
      x += duckSpeed;
      duckSide = "R";
  }

  // DOWN
  if (keys[40]) {
      y += duckSpeed;
  }

  // Prevent arrow keys to scroll the page even tho its supposed to be disabled in CSS
  e.preventDefault();

  //To avoid duck from exiting playground borders
  if (x < 0) {
      x = 0;
  } else if (x + duck.offsetWidth > container.offsetWidth) {
      x = container.offsetWidth - duck.offsetWidth;
  }

  if (y < 0) {
      y = 0;
  } else if (y + duck.offsetHeight > container.offsetHeight) {
      y = container.offsetHeight - duck.offsetHeight;
  }

  if (x < 0) {
      x = 0;
  } else if (x + duck.offsetWidth > container.offsetWidth) {
      x = container.offsetWidth - duck.offsetWidth;
  }

  if (y < 0) {
      y = 0;
  } else if (y + duck.offsetHeight > container.offsetHeight) {
      y = container.offsetHeight - duck.offsetHeight;
  }

  // Apply new coordinates to duck object
  duck.style.left = x + "px";
  duck.style.top = y + "px";
}


//Things to be executed on duck hit
const duckShotEvent = () => {
  addHunterScore();
  setDeadDuck();
  ammunitions();
}


// Move the duck in the space depending on pressed keys, and also avoid duck from exiting playground borders
const duckMovement = () => {
  document.addEventListener("keydown", duckMovementEvent, false);
  document.addEventListener("keyup", e => {

      // Remove stored pressed keys when key are up
      keys[e.keyCode] = false;
  }, false);
}

// Add +1 to duck score
const addDuckScore = () => {
  duckScore++;
  const score = document.querySelector('#scoreDuck');
  score.innerText = duckScore;
  return duckScore;
}



// _____                    _____                    _____                _____                    _____                    _____          
// /\    \                  /\    \                  /\    \              /\    \                  /\    \                  /\    \         
// /::\____\                /::\____\                /::\____\            /::\    \                /::\    \                /::\    \        
// /:::/    /               /:::/    /               /::::|   |            \:::\    \              /::::\    \              /::::\    \       
// /:::/    /               /:::/    /               /:::::|   |             \:::\    \            /::::::\    \            /::::::\    \      
// /:::/    /               /:::/    /               /::::::|   |              \:::\    \          /:::/\:::\    \          /:::/\:::\    \     
// /:::/____/               /:::/    /               /:::/|::|   |               \:::\    \        /:::/__\:::\    \        /:::/__\:::\    \    
// /::::\    \              /:::/    /               /:::/ |::|   |               /::::\    \      /::::\   \:::\    \      /::::\   \:::\    \   
// /::::::\    \   _____    /:::/    /      _____    /:::/  |::|   | _____        /::::::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \  
// /:::/\:::\    \ /\    \  /:::/____/      /\    \  /:::/   |::|   |/\    \      /:::/\:::\    \  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\ 
// /:::/  \:::\    /::\____\|:::|    /      /::\____\/:: /    |::|   /::\____\    /:::/  \:::\____\/:::/__\:::\   \:::\____\/:::/  \:::\   \:::|    |
// \::/    \:::\  /:::/    /|:::|____\     /:::/    /\::/    /|::|  /:::/    /   /:::/    \::/    /\:::\   \:::\   \::/    /\::/   |::::\  /:::|____|
// \/____/ \:::\/:::/    /  \:::\    \   /:::/    /  \/____/ |::| /:::/    /   /:::/    / \/____/  \:::\   \:::\   \/____/  \/____|:::::\/:::/    / 
//  \::::::/    /    \:::\    \ /:::/    /           |::|/:::/    /   /:::/    /            \:::\   \:::\    \            |:::::::::/    /  
//   \::::/    /      \:::\    /:::/    /            |::::::/    /   /:::/    /              \:::\   \:::\____\           |::|\::::/    /   
//   /:::/    /        \:::\__/:::/    /             |:::::/    /    \::/    /                \:::\   \::/    /           |::| \::/____/    
//  /:::/    /          \::::::::/    /              |::::/    /      \/____/                  \:::\   \/____/            |::|  ~|          
// /:::/    /            \::::::/    /               /:::/    /                                 \:::\    \                |::|   |          
// /:::/    /              \::::/    /               /:::/    /                                   \:::\____\               \::|   |          
// \::/    /                \::/____/                \::/    /                                     \::/    /                \:|   |          
// \/____/                  ~~                       \/____/                                       \/____/                  \|___|          
//                                                                                                                                 

let ammoTimeout;
let ammoInterval;
let godModeTimeout;
let isReloading = false;
let ammoCounter = 1;

const ammunitions = () => {
  if (ammo <= 0 || ammoTimeout || isReloading) return;

  ammoTimeout = setTimeout(() => {
      ammoTimeout = null;
  }, 800);

  playSoundShoot();
  ammo--;

  const ammoElement = document.getElementById(`ammo${ammo}`);
  if (ammoElement) {
      ammoElement.innerHTML = "";
  }

  if (ammo <= 0) {

      isReloading = true;
      godModeTimeout = setTimeout(() => {
          setDuckGodMode();
          init
          godModeTimeout = null;
      }, 1200)

      let prevAmmo = ammo;
      ammoInterval = setInterval(() => {
          ammo++;

          const nextAmmoElement = document.getElementById(`ammo${ammo}`);
          if (nextAmmoElement) {
              nextAmmoElement.innerHTML = "<img src='/img/shell.png' alt=''>";
          }

          if (ammo > 6) {
              clearInterval(ammoInterval);
              ammo = 6;
              ammoInterval = null;
              isReloading = false;
              clearTimeout(godModeTimeout);
              godModeTimeout = null;
          } else if (prevAmmo === ammo) {
              clearInterval(ammoInterval);
              ammo = 6;
              ammoInterval = null;
              isReloading = false;
              clearTimeout(godModeTimeout);
              godModeTimeout = null;
          }
          prevAmmo = ammo;
      }, 400);
  }
};

//Add event listener on duck hit
const hunterShoot = () => {

  const shootingInterval = setInterval(() => {
      clearInterval(shootingInterval);
      duck.addEventListener('mousedown', hunterShootBird);

      if (container.addEventListener('mousedown', ammunitions)) {
          container.addEventListener('mousedown', ammunitions);
      }



  }, 3000);
  //  Use and modify to put a timer between shots
}

// When the hunter shoots and hits the duck.
const hunterShootBird = e => {
  playSoundScream();
  e.stopImmediatePropagation();
  duckShotEvent();
  e.stopImmediatePropagation();
}


// Boolean to check if there is still ammo ?
const noAmmo = () => ammo === 0;


// Add +1 to hunter score
const addHunterScore = () => {
  hunterScore++;
  const score = document.querySelector('#scoreHunter');
  score.innerText = hunterScore;
  return hunterScore;
}


//Main function to execute all the function to start the game
const init = () => {
  startBtn.disabled = true;
  easyBtn.disabled = true;
  normalBtn.disabled = true;
  hardBtn.disabled = true;

  countdown();
  setInterval(addDuckScore, 10000);
  initDuck();
  duckMovement();
  setDuckAnimation();
  gunCursor();
  hunterShoot();
  playSoundTheme();
  gun.classList.remove('hidden');
}


// Event listener on start button to init the game, can execute only once
startBtn.addEventListener('click', () => { init(); }, { once: true });
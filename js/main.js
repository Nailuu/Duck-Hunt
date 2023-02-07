// Global variables of the game
const game = {
  duckSide: "R",
  duckSpeed: 10,
  duckScore: 0,
  hunterScore: 0,
  ammo: 0,
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
let {duckSide, duckSpeed, duckScore, hunterScore, ammo, container, duck, gun, timer, duckAnimationInterval, startBtn, easyBtn, normalBtn, hardBtn, keys} = game;

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

// Display starting screen which allows you to insert usernames + select a level if wanting to play against a bot or hunter
const menuScreen = () => {

}

// Scoreboard to show how many shots the hunter has hit / how many shots the duck has dodged
const scoreboard = () => {

}

// Create duck on the game container and set his default look
const initDuck = () => {
    const duckImg = document.createElement('img');
    duckImg.src = "../img/duck3R.png";
    duckImg.classList.add('duck');
    // duck.classList.add('hitbox');
    
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

    setInterval(() =>{
        let minutes = parseInt(timer / 60, 10);
        let secondes = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? '0' + minutes : minutes
        secondes = secondes < 10 ? '0' + secondes : secondes
    
        countdownElement.innerText = `${minutes}:${secondes}`;
        timer = timer  <= 0 ? 0 : timer - 1
    }, 1000)
}

// Swaps between bird pictures to make it look like it's flying in the air depending on where it's flying towards
const setDuckAnimation = () => {
    let counter = 3;

    duckAnimationInterval = setInterval(() => {
        if(counter < 1) {
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

    for(let i = duckY; i < 500; i++) {
        setTimeout(() => {
          duck.style.top = i + "px";
        }, i * 1)
    }
}

// When duck is hit, make the duck invunerable for a set delay, to avoid spamming..
const setDuckGodMode = () => {
  duck.removeEventListener('mousedown', duckShotEvent);
  document.removeEventListener('keydown', duckMovementEvent);

  container.removeEventListener('mousedown', duckShotEvent);

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
    if(keys[37]) {
      x -= duckSpeed;
        duckSide = "L";
    }

    // UP
    if(keys[38]) {
      y -= duckSpeed;
    }
     
    // RIGHT
    if(keys[39]) {
      x += duckSpeed;
      duckSide = "R";
    }

    // DOWN
    if(keys[40]) {
      y += duckSpeed;
    }

    e.preventDefault();
  
    //To avoid duck from exiting playground borders
    if(x < 0) {
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

  duck.style.left = x + "px";
  duck.style.top = y + "px";
}

// Move the duck in the space depending on pressed keys, and also avoid duck from exiting playground borders
const duckMovement = () => {
    document.addEventListener("keydown", duckMovementEvent, false);
    document.addEventListener("keyup", e => {

      // Remove stored pressed keys when key are up
      keys[e.keyCode] = false;
    }, false)
}

// Add +1 to hunter score
const addHunterScore = () => {
    hunterScore++;
    const score = document.querySelector('#scoreHunter');
    score.innerText = hunterScore;
}

// Add +1 to duck score
const addDuckScore = () => {
    duckScore++;
    const score = document.querySelector('#scoreDuck');
    score.innerText = duckScore;
}

// Add +1 to duck score every 10 seconds (should be 10 second without being shot)
const duckAvoidingTimer = (reset) => {
  let time = 9;
  setInterval(() =>{
    if(reset == 1){
      time = 9;
    }
    else{
      time = time;
    }
    time = time  <= 0 ? 0 : time - 1 

    if(time == 0){
  
      time = 9;
      addDuckScore();
    }
  }, 1000);
}

// Did the duck avoid being shot for 10 seconds?
const booleanDuckAvoided = () => {

}

//Main function to manage ammunition system
const ammunitions = () => {
  // const container = document.querySelector('.container');
  function clear() {
    clearInterval(this) 
    return clear; 
  }
  ammo--;
  displayAmmo();
  if(noAmmo()) {

    setInterval(() => {
      ammo++
      console.log(ammo);
      if(ammo == 6) clear();
    },300);
     
  }
    displayAmmo();
}

// Display ammo remaining
const displayAmmo = () => {
    const ammoScore = document.querySelector('#ammo');
    ammoScore.innerText = ammo;
}

// Boolean to check if there is still ammo ?
const noAmmo = () => ammo === 0;


//What will execute on duck hit
const duckShotEvent = () => {
    addHunterScore();
    ammunitions();
    setDeadDuck();
}

//Add event listener on duck hit
const hunterShoot = () => {
    duck.addEventListener('mousedown', hunterShoot => {
      hunterShoot.stopImmediatePropagation();
      duckShotEvent();
      playSound(0);
      playSound(1);
      hunterShoot.stopImmediatePropagation();

      });
    if(container.addEventListener('mousedown', ammunitions)){
      container.addEventListener('mousedown', ammunitions)
      playSound(0);
      playSound(1);
    }
}

// Depending on the score based on the countdown, displays if the hunter wins or the duck wins
const win_loss_Screen = () => {

}

// Pow sound + little background music when playing

    // Tracks :  1 = Reload sound. 2  = Shoot sound 3 - Background Sound
const playSound = track => {

  switch(track){

    case 0:
      // Shooting Sound
      let shoot = document.querySelector('.container');
      function playMusic(){
              let audio = new Audio('../audio/shoot.mp3');
              audio.play()
      }
      shoot.addEventListener("click", playMusic);
      break;

    case 1:
      // Cogging Sound
      let cog = document.querySelector('.container');

      function playMusic(){
              let audio = new Audio('../audio/cog.mp3');
              audio.play()
      }
      cog.addEventListener("click", playMusic);
      break;

    case 2:
      // Reloading Sound

    case 3: 
      // Game Sound
  }
}

// Pause sound + pausing music when going into menu
const pauseAudio = () => {
    
}  

//Get user cursor position in the window and replace his cursor with a shotgun
const gunCursor = () => {
    gun.classList.remove("hidden");

    container.style.cursor = "none";

    window.addEventListener('mousemove', e => {
      gun.style.left = (e.clientX - 14) + 'px';
      gun.style.top = (e.clientY - 12) + 'px';
    })
}

//Main function to execute all the function to start the game
const init = () => {
    startBtn.disabled = true;
    easyBtn.disabled = true;
    normalBtn.disabled = true;
    hardBtn.disabled = true;

    countdown();
    initDuck();
    duckMovement();
    setDuckAnimation();
    gunCursor();
    hunterShoot();
    // playSound(0);
    duckAvoidingTimer();
    gun.classList.remove('hidden');
}

// Event listener on start button to init the game, can execute only once
startBtn.addEventListener('click', () => {
  init();
}, {once: true})
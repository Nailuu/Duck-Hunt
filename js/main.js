let duckSide = "R";
let duckSpeed = 10;

let duckScore = 0;
let hunterScore = 0;

let ammo = 6;

const easyBtn = document.querySelector('#easy');
easyBtn.disabled = true;

const normalBtn = document.querySelector('#normal');
const hardBtn = document.querySelector('#hard');
const startBtn = document.querySelector('#start');

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
    const gameGrid = document.querySelector('.container');
    const duck = document.createElement('img');
    duck.src = "../img/duck3R.png";
    duck.classList.add('duck');
    // duck.classList.add('hitbox');
    
    gameGrid.appendChild(duck);
}

// Countdown before game end
const countdown = () => {
    var countdownElement = document.querySelector('#countdown');
    var startMinutes = 2;
    var countdown = startMinutes * 60;

    setInterval(() =>{
        var minutes = parseInt(countdown / 60, 10);
        var secondes = parseInt(countdown % 60, 10);
        minutes = minutes < 10 ? '0' + minutes : minutes
        secondes = secondes < 10 ? '0' + secondes : secondes
    
        countdownElement.innerText = `${minutes}:${secondes}`;
        countdown = countdown  <= 0 ? 0 : countdown - 1
    }, 1000)
}

let duckAnimationInterval;

// Swaps between bird pictures to make it look like it's flying in the air depending on where it's flying towards
const setDuckAnimation = () => {
    const duck = document.querySelector('.duck');
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
    const duck = document.querySelector('.duck');
    clearInterval(duckAnimationInterval);
    duck.src = `../img/dead.png`;

    setTimeout(() => {
      setDuckAnimation();
    }, 1250);
}

// Make dead duck fall into the ground
const setDeadDuckPosition = () => {
    const duck = document.querySelector(".duck");
    const duckY = duck.style.top.slice(0, -2);

    for(let i = duckY; i < 500; i++) {
        setTimeout(() => {
          duck.style.top = i + "px";
        }, i * 1)
    }
}

// When duck is hit, make the duck invunerable for a set delay, to avoid spamming..
const setDuckGodMode = () => {
  const duck = document.querySelector(".duck");

  duck.removeEventListener('mousedown', duckShotEvent);
  document.removeEventListener('keydown', duckMovementEvent);

  setTimeout(() => {
    duckMovement();
    duckShot();
  }, 1500)
}


const setDeadDuck = () => {
    setDeadDuckPosition();
    setDeadDuckAnimation();
    setDuckGodMode();
}

// Event listener callback on pressed keys to move duck with multiple keyboards layout (AZERTY, QWERTY)
const duckMovementEvent = (e) => {
    const duck = document.querySelector(".duck");
    const container = document.querySelector(".container");

    let left = parseInt(duck.style.left) || 0;
    let top = parseInt(duck.style.top) || 0;
     
    switch (e.key) {
      case "z":
        top -= duckSpeed;
        break;
      case "s":
        top += duckSpeed;
        break;
      case "q":
        left -= duckSpeed;
        duckSide = "L";
        break;
      case "d":
        left += duckSpeed;
        duckSide = "R";
        break;
  
      case "Z":
          top -= duckSpeed;
          break;
      case "S":
          top += duckSpeed;
          break;
      case "Q":
          left -= duckSpeed;
          duckSide = "L";
          break;
      case "D":
          left += duckSpeed;
          duckSide = "R";
          break;
  
      case "w":
        top -= duckSpeed;
        break;
      case "s":
        top += duckSpeed;
        break;
      case "a":
        left -= duckSpeed;
        duckSide = "L";
        break;
      case "d":
        left += duckSpeed;
        duckSide = "R";
        break;
  
      case "W":
          top -= duckSpeed;
          break;
      case "S":
          top += duckSpeed;
          break;
      case "A":
          left -= duckSpeed;
          duckSide = "L";
          break;
      case "D":
          left += duckSpeed;
          duckSide = "R";
          break;
      default:
        break;
    }
  
    //To avoid duck from exiting playground borders
    if (left < 0) {
      left = 0;
    } else if (left + duck.offsetWidth > container.offsetWidth) {
      left = container.offsetWidth - duck.offsetWidth;
    }
  
    if (top < 0) {
      top = 0;
    } else if (top + duck.offsetHeight > container.offsetHeight) {
      top = container.offsetHeight - duck.offsetHeight;
    }

    if (left < 0) {
      left = 0;
    } else if (left + duck.offsetWidth > container.offsetWidth) {
      left = container.offsetWidth - duck.offsetWidth;
    }
  
    if (top < 0) {
      top = 0;
    } else if (top + duck.offsetHeight > container.offsetHeight) {
      top = container.offsetHeight - duck.offsetHeight;
    }

  duck.style.left = left + "px";
  duck.style.top = top + "px";
}

// Move the duck in the space depending on pressed keys, and also avoid duck from exiting playground borders
const duckMovement = () => {
    document.addEventListener("keydown", duckMovementEvent);
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

//Main function to manage ammunition system
const ammunitions = () => {
    ammo--;
    displayAmmo();
    if(noAmmo()) {
      ammo = 6;
      displayAmmo();
    }
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
const duckShot = () => {
    const duck = document.querySelector('.duck')
    duck.addEventListener('mousedown', duckShotEvent)
}

// Depending on the score based on the countdown, displays if the hunter wins or the duck wins
const win_loss_Screen = () => {

}

// Pow sound + little background music when playing

    // Tracks :  1 = Reload sound. 2  = Shoot sound 3 - Background Sound
const playSound = track => {

  switch(track){


    case 0:
    case 1:
      // Cogging Sound
      let cog = new Audio();
      cog.src = "../audio/cog.mp3";
      cog.play();
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
    const gun = document.querySelector('#gun');

    window.addEventListener('mousemove', e => {
      gun.style.left = (e.clientX - 14) + 'px';
      gun.style.top = (e.clientY - 12) + 'px';
    })
}

const gun = document.querySelector('#gun');

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
    duckShot();
    // playSound(0);
    gun.classList.remove('hidden');
}

// Event listener on start button to init the game, can execute only once
startBtn.addEventListener('click', () => {
  init();
}, {once: true})


// Typing for first push, ignore this part. - Moonlight
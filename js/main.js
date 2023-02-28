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

// Define the game object with initial values for various game variables
const game = {
  duckSide: "R",             // current direction of the duck
  duckSpeed: 10,             // speed at which the duck moves
  duckScore: 0,              // current score of the duck
  hunterScore: 0,            // current score of the hunter
  ammo: 6,                   // number of bullets left for the hunter
  timer: 0,                  // current time left in the game
  main: document.querySelector('.main'),                     // main game container
  container: document.querySelector('.container'),           // container for the duck and other elements
  ammoPannel: document.querySelector('.ammo-panel'),         // panel showing the number of bullets left
  gun: document.querySelector('#gun'),                       // image of the gun for the hunter
  duck: null,                                                 // reference to the duck image element
  startBtn: document.querySelector('#start'),                // button to start the game
  easyBtn: document.querySelector('#easy'),                  // button to set the game difficulty to easy
  normalBtn: document.querySelector('#normal'),              // button to set the game difficulty to normal
  hardBtn: document.querySelector('#hard'),                  // button to set the game difficulty to hard
  duckAnimationInterval: null,                                // ID of the interval used for animating the duck
  keys: []                                                    // array to store currently pressed keys
}

// Destructure the game object to make variables more accessible
let {
  duckSide,
  duckSpeed,
  duckScore,
  hunterScore,
  ammo,
  main,
  container,
  ammoPannel,
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

// Disable the easy button and set the duck speed to 10
easyBtn.disabled = true;
easyBtn.addEventListener('click', () => {
  easyBtn.disabled = true;
  normalBtn.disabled = false;
  hardBtn.disabled = false;
  duckSpeed = 10;
});

// Disable the normal button and set the duck speed to 20
normalBtn.addEventListener('click', () => {
  normalBtn.disabled = true;
  easyBtn.disabled = false;
  hardBtn.disabled = false;
  duckSpeed = 20;
});

// Disable the hard button and set the duck speed to 25
hardBtn.addEventListener('click', () => {
  hardBtn.disabled = true;
  normalBtn.disabled = false;
  easyBtn.disabled = false;
  duckSpeed = 25;
});

// Show the hunter's gun and replace the cursor with the gun image
const gunCursor = () => {
  gun.classList.remove("hidden");
  container.style.cursor = "none";
  window.addEventListener('mousemove', e => {
      gun.style.left = (e.clientX - 14) + 'px';
      gun.style.top = (e.clientY - 12) + 'px';
  });
}

// Create the duck image element and add it to the container
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

  // Remove the difficulty and start buttons from the screen
  countdownElement.removeChild(difficulty);
  countdownElement.removeChild(command);

  // Add classes to the countdown element for styling
  countdownElement.classList.add('panel-countdown');
  countdownElement.classList.add('countdown');

  // Set the timer for 2 minutes (120 seconds)
  let startMinutes = 2;
  timer = startMinutes * 60 - 1;

  // Display the initial countdown time (02:00)
  countdownElement.innerText = `02:00`;

  // Update the countdown timer every second
  timerClear = setInterval(() => {
      let minutes = parseInt(timer / 60, 10);
      let secondes = parseInt(timer % 60, 10);

      // Add leading zero if minutes/seconds is less than 10
      minutes = minutes < 10 ? '0' + minutes : minutes;
      secondes = secondes < 10 ? '0' + secondes : secondes;

      // Update the countdown element with the new time
      countdownElement.innerText = `${minutes}:${secondes}`;

      // Decrement the timer by 1 second
      timer = timer <= 0 ? 0 : timer - 1;

      // If the timer reaches 0, end the game and display the results
      if (timer == 0) {
          clearInterval(timerClear);
          document.removeEventListener('keydown', duckMovementEvent);
          duck.removeEventListener('mousedown', hunterShootBird);
          clearInterval(addDuckScore);

          // Determine the winner based on scores and display appropriate message and image
        if(hunterScore == duckScore){
          winLossScreen(0);
        }
        else if(hunterScore > duckScore){
          winLossScreen(1);
        }
        else{
          winLossScreen(2);
        }

      }
  },1000);
}



const winLossScreen = (which) =>{
        // stop the theme sound and play ending game sound
        stopThemeSound();
        playEndingGameSound();
        
      // hide main game and ammo panel
      main.style.display = "none";
      ammoPannel.style.display = "none";

  switch(which){

    // Incase of a Tie
    case 0:
      

      // create a new main element with a container for the win/loss screen
      var replaceMain = document.createElement("div");
      replaceMain.classList.add("main");
      replaceMain.setAttribute("style", " display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1em;");
      document.body.appendChild(replaceMain);

      var replaceContainer = document.createElement("div");
      replaceContainer.classList.add("container");

      // set the win/loss screen background image and styling
      replaceContainer.setAttribute("style", "width: 1200px; height: 625px; background: no-repeat center/100% url(\"../img/tie.gif\"); border-radius: 15px; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;");
      replaceMain.appendChild(replaceContainer);

      // add the win/loss screen message
      var insideContainer = document.createElement("p");
      insideContainer.setAttribute("style", "display: flex; justify-content: center; align-items: center; flex-direction: column; color: orange;");
      insideContainer.innerHTML = `<h1>The Game has ended in a Tie!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2>`;
      replaceContainer.appendChild(insideContainer);

      // add the restart button to the win/loss screen
      var bottomRestartButton = document.createElement("button");
      bottomRestartButton.id = "buttonRestart";
      bottomRestartButton.setAttribute("style", "display: flex; position: fixed; left: 50%; bottom: 20px; transform: translate(-50%, -50%); margin: 0 auto; align-items: center; justify-content: center; gap: 1em; background-color: grey; height: 110px; width: 225px; border-radius: 20px; color: white; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; font-size: 40px;");
      bottomRestartButton.innerHTML = `New Game`;
      
      replaceContainer.appendChild(bottomRestartButton);

      // add event listeners for the restart button to change its appearance on hover and click
      var buttonPressed = document.querySelector("#buttonRestart");
      buttonPressed.addEventListener("mouseover", function(){
          // highlight the mouseover target
        buttonPressed.style.backgroundColor = "orange";
      });

      buttonPressed.addEventListener("mouseout", function(){
          buttonPressed.style.backgroundColor = "grey";
      });

      buttonPressed.addEventListener("click", function() {
        window.location.reload();
      });
      

      replaceContainer.appendChild(bottomRestartButton);
      break;

    // In case of a Hunter Win
    case 1:
       // create a new main element with a container for the win/loss screen
       var replaceMain = document.createElement("div");
       replaceMain.classList.add("main");
       replaceMain.setAttribute("style", " display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1em;");
       document.body.appendChild(replaceMain);
 
       var replaceContainer = document.createElement("div");
       replaceContainer.classList.add("container");
 
       // set the win/loss screen background image and styling
       replaceContainer.setAttribute("style", "width: 1200px; height: 625px; background: no-repeat center/100% url(\"../img/hunterWin.gif\"); border-radius: 15px; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;");
       replaceMain.appendChild(replaceContainer);
 
       // add the win/loss screen message
       var insideContainer = document.createElement("p");
       insideContainer.setAttribute("style", "display: flex; justify-content: center; align-items: center; flex-direction: column; color: orange;");
       insideContainer.innerHTML = `<h1>The Hunter has Won!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2>`;
       replaceContainer.appendChild(insideContainer);
 
       // add the restart button to the win/loss screen
       var bottomRestartButton = document.createElement("button");
       bottomRestartButton.id = "buttonRestart";
       bottomRestartButton.setAttribute("style", "display: flex; position: fixed; left: 50%; bottom: 20px; transform: translate(-50%, -50%); margin: 0 auto; align-items: center; justify-content: center; gap: 1em; background-color: grey; height: 110px; width: 225px; border-radius: 20px; color: white; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; font-size: 40px;");
       bottomRestartButton.innerHTML = `New Game`;
       
       replaceContainer.appendChild(bottomRestartButton);
 
       // add event listeners for the restart button to change its appearance on hover and click
       var buttonPressed = document.querySelector("#buttonRestart");
       buttonPressed.addEventListener("mouseover", function(){
           // highlight the mouseover target
         buttonPressed.style.backgroundColor = "orange";
       });
 
       buttonPressed.addEventListener("mouseout", function(){
           buttonPressed.style.backgroundColor = "grey";
       });
 
       buttonPressed.addEventListener("click", function() {
         window.location.reload();
       });
       
 
       replaceContainer.appendChild(bottomRestartButton);
       break;
    
    // In case of a Duck Win
    case 2:
       // create a new main element with a container for the win/loss screen
       var replaceMain = document.createElement("div");
       replaceMain.classList.add("main");
       replaceMain.setAttribute("style", " display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1em;");
       document.body.appendChild(replaceMain);
 
       var replaceContainer = document.createElement("div");
       replaceContainer.classList.add("container");
 
       // set the win/loss screen background image and styling
       replaceContainer.setAttribute("style", "width: 1200px; height: 625px; background: no-repeat center/100% url(\"../img/duckWin.gif\"); border-radius: 15px; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;");
       replaceMain.appendChild(replaceContainer);
 
       // add the win/loss screen message
       var insideContainer = document.createElement("p");
       insideContainer.setAttribute("style", "display: flex; justify-content: center; align-items: center; flex-direction: column; color: orange;");
       insideContainer.innerHTML = `<h1>The Duck has Won!<h1><br><h2>Hunter : ${hunterScore} vs Duck : ${duckScore}</h2>`;
       replaceContainer.appendChild(insideContainer);
 
       // add the restart button to the win/loss screen
       var bottomRestartButton = document.createElement("button");
       bottomRestartButton.id = "buttonRestart";
       bottomRestartButton.setAttribute("style", "display: flex; position: fixed; left: 50%; bottom: 20px; transform: translate(-50%, -50%); margin: 0 auto; align-items: center; justify-content: center; gap: 1em; background-color: grey; height: 110px; width: 225px; border-radius: 20px; color: white; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; font-size: 40px;");
       bottomRestartButton.innerHTML = `New Game`;
       
       replaceContainer.appendChild(bottomRestartButton);
 
       // add event listeners for the restart button to change its appearance on hover and click
       var buttonPressed = document.querySelector("#buttonRestart");
       buttonPressed.addEventListener("mouseover", function(){
           // highlight the mouseover target
         buttonPressed.style.backgroundColor = "orange";
       });
 
       buttonPressed.addEventListener("mouseout", function(){
           buttonPressed.style.backgroundColor = "grey";
       });
 
       buttonPressed.addEventListener("click", function() {
         window.location.reload();
       });
       
 
       replaceContainer.appendChild(bottomRestartButton);
       break;
  }

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

// Create new Audio object for duckhunt intro sound
let intro = new Audio('../audio/duckhunt-intro.mp3')

// Function to play the intro sound with reduced volume
const playIntroSound = () => {
intro.volume = 0.2;
intro.play();
}

// Section used to control the main game theme sound
let theme;

// Function to play the main game theme sound on loop with reduced volume
const playThemeSound = () => {
theme = new Audio('../audio/theme.mp3');
theme.loop = true;
theme.volume = 0.2;
theme.play();
}

// Function to stop the main game theme sound if it's currently playing
const stopThemeSound = () => {
if (theme) {
theme.pause();
theme.currentTime = 0;
}
}

// Function to play the ending game sound on loop with reduced volume
const playEndingGameSound = () => {
const ending = new Audio('../audio/game-over.mp3');
ending.volume = 0.2;
ending.loop = true;
ending.play();
}

// Function that generates a random time interval between min and max (in milliseconds)
function getRandomInterval(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize quack and bark sound variables
let quack;
let bark;

// Function to play the duck quack sound with reduced volume
const playQuackSound = () => {
quack = new Audio('../audio/duck-quack.mp3');
quack.volume = 0.2;
quack.play();
}

// Function to play the duck quack sound repeatedly with random intervals
function playQuackSoundRepeated() {
const nextInterval = getRandomInterval(5000, 10000);
setTimeout(()=>{
playQuackSound();
playQuackSoundRepeated();
}, nextInterval);
}

// Function to play the dog barking sound with reduced volume
const playBarkSound = () => {
bark = new Audio('../audio/dog-barking.mp3');
bark.volume = 0.2;
bark.play();
}

// Function to play the dog barking sound repeatedly with random intervals
function playBarkSoundRepeated() {
const nextInterval = getRandomInterval(7000, 15000);
setTimeout(() => {
playBarkSound();
playBarkSoundRepeated();
}, nextInterval);
}

// Function to play the duck scream, falling, and caught sounds when the duck is hit
const playScreamSound = () => {
const scream = new Audio('../audio/scream.mp3');
const falling = new Audio('../audio/duck-falling.mp3');
const caught = new Audio('../audio/duck-caught.mp3');

scream.play();
falling.play();

const caughtInterval = setInterval(() => {
clearInterval(caughtInterval);
caught.play();
}, 1000);
}

// Function to play the shotgun shooting and cogging sounds when the player shoots
const playShootSound = () => {
const shoot = new Audio('../audio/shoot.mp3');
const cog = new Audio('../audio/cog.mp3');

shoot.play();
const cogInterval = setInterval(() => {
clearInterval(cogInterval);
cog.play();
}, 400);
}

// Function to play the duck point sound when the player scores a hit
const playDuckPointSound = () => {
const duckPoint = new Audio('../audio/points.mp3');
duckPoint.play();
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


// Function to swap between bird pictures to make it look like it's flying in the air depending on where it's flying towards
const setDuckAnimation = () => {
  let counter = 3;
  
  // Set interval to switch between bird pictures and animate bird movement
  duckAnimationInterval = setInterval(() => {
  if (counter < 1) {
  counter = 3;
  }
  duck.src = `../img/Duck${counter}${duckSide}.png`;
  counter--;
  }, 250)
  }
  
  // Function to display dead bird animation and reset animation after set time
  const setDeadDuckAnimation = () => {
  clearInterval(duckAnimationInterval);
  duck.src = "../img/dead.png";
  
  // Set timeout to reset animation after a set time
  setTimeout(() => {
  setDuckAnimation();
  }, 1250);
  }
  
  // Function to make dead bird fall to the ground
  const setDeadDuckPosition = () => {
  const duckY = duck.style.top.slice(0, -2);
  
  // Use setTimeout to move bird down the screen one pixel at a time
  for (let i = duckY; i < 500; i++) {
  setTimeout(() => {
  duck.style.top = i + "px";
  }, i * 2)
  }
  }
  
  // Function to make bird invulnerable for a set delay after being hit
  const setDuckGodMode = () => {
  // Remove event listeners to avoid spamming
  duck.removeEventListener('mousedown', hunterShootBird);
  document.removeEventListener('keydown', duckMovementEvent);
  
  // Set timeout to re-enable event listeners after set time
  setTimeout(() => {
  duckMovement();
  hunterShoot();
  }, 1500)
  }
  
  // Function to execute all the related functions to bird being dead
  const setDeadDuck = () => {
  setDeadDuckPosition();
  setDeadDuckAnimation();
  setDuckGodMode();
  }
  
  // Event listener callback on pressed keys to move bird with arrow keys (up, right, down, left)
  const duckMovementEvent = (e) => {
  let x = parseInt(duck.style.left) || 0;
  let y = parseInt(duck.style.top) || 0;
  
  // Store pressed keys when key is down
  keys[e.keyCode] = true;
  
  // Move bird with Arrow Keys
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
  
  // Prevent arrow keys to scroll the page even though it is disabled in CSS
  e.preventDefault();
  
  // Avoid bird from exiting playground borders
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


// Function to execute on duck being hit
const duckShotEvent = () => {
  addHunterScore(); // Add score to the hunter
  setDeadDuck(); // Set duck to dead and play animation
  ammunitions(); // Decrease the remaining ammunition count
  }
  
  // Function to move the duck with the arrow keys and prevent it from exiting the playground borders
  const duckMovement = () => {
  document.addEventListener("keydown", duckMovementEvent, false);
  document.addEventListener("keyup", e => {
  // Remove stored pressed keys when key are up
  keys[e.keyCode] = false;
  }, false);
  }
  
  // Function to add +1 to duck score and update the score display
  const addDuckScore = () => {
  duckScore++; // Increment the duck score
  const score = document.querySelector('#scoreDuck'); // Get the score display element
  score.innerText = duckScore; // Update the score display
  playDuckPointSound(); // Play a sound to indicate a score increase
  return duckScore; // Return the updated score
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

// This function manages the ammunition in the game. 
// It sets a timeout if the ammo is below 0 or already reloading, and plays the shoot sound

// Variable declaration for variables needed in ammo and elsewhere.
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

  playShootSound();
  ammo--;

  const ammoElement = document.getElementById(`ammo${ammo}`);
  if (ammoElement) {
      ammoElement.innerHTML = "";
  }

  // If ammo is 0, it reloads and sets the duck to god mode
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

          // If the ammo reaches 6, it clears the interval and sets the isReloading to false
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

//Adds an event listener on the duck when it is hit.
const hunterShoot = () => {
  // Sets an interval to add a timer between each shot. 
  const shootingInterval = setInterval(() => {
      clearInterval(shootingInterval);
      duck.addEventListener('mousedown', hunterShootBird);

      // Enables the ammunitions container to be clicked
      if (container.addEventListener('mousedown', ammunitions)) {
          container.addEventListener('mousedown', ammunitions);
      }

  }, 3000);
  //  Use and modify to put a timer between shots
}

// When the hunter shoots and hits the duck. - Executes when the hunter successfully hits the duck.
const hunterShootBird = e => {
  playScreamSound();
  e.stopImmediatePropagation();
  duckShotEvent();
  e.stopImmediatePropagation();
}

// Boolean to check if there is still ammo ? - Checks if there is still ammo left.
const noAmmo = () => ammo === 0;

// Add +1 to hunter score - Adds one point to the hunter's score. 
const addHunterScore = () => {
  hunterScore++;
  const score = document.querySelector('#scoreHunter');
  score.innerText = hunterScore;
  playDuckPointSound();
  return hunterScore;
}

//Main function to execute all the function to start the game - Initializes the game and sets up the duck movements, sound effects, gun cursor and more.
const init = () => {
  startBtn.disabled = true;
  easyBtn.disabled = true;
  normalBtn.disabled = true;
  hardBtn.disabled = true;

  playIntroSound();
  intro.addEventListener('ended',() =>{
    countdown()
    setInterval(addDuckScore, 10000);
    initDuck();
    duckMovement();
    setDuckAnimation();
    gunCursor();
    hunterShoot();
    playThemeSound();
    playBarkSoundRepeated();
    playQuackSoundRepeated();
    gun.classList.remove('hidden');
  })
}


// Event listener on start button to init the game, can execute only once
startBtn.addEventListener('click', () => { init(); }, { once: true });
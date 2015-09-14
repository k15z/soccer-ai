# Soccer AI
This project is a cross between RoboCup and MIT Battlecode: user-created AI's 
direct their team's players on the simulated soccer field. It is written 
entirely in HTML5/CSS/JS, and can be run in any modern web browser.

## engine.js
```
engine.IS_DONE
engine.drawFrame()
engine.setCanvas(canvas)
engine.setPlayer1(player)
engine.setPlayer2(player)
```

The majority of code in this project is located in `engine.js`; the `Engine` 
handles all the game logic, from running simulations to drawing frames. It 
contains information about the score, the ball's location/velocity, as well as 
the status of various robots on each team.

## player.js
```
player.id
player.action(state)
player.message(data)
```

The other main component is the `player.js` file. Each competitor creates their 
own `Player` object which gets loaded into the engine. Several instances of the 
each competitors `Player` object are created by the engine, one for each player 
on that competitor's team, and each instance is assigned an unique id.

Every time the frame changes, each instance of the `Player` is examined and the 
`player.action` method is called. State information containing the location of 
the ball, other players, and the goals is provided; an acceleration vector 
should be returned.

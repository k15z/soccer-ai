# Soccer AI
This project is a cross between RoboCup and MIT Battlecode: user-created AI's 
direct their team's players on the simulated soccer field. It is written 
entirely in HTML5/CSS/JS, and can be run in any modern web browser.

## engine.js
```
engine.drawFrame()
engine.setCanvas(canvas)
engine.setPlayer1(player)
engine.setPlayer2(player)
```

The majority of code in this project will be located in `engine.js`; this file 
handles all the game logic, from running simulations to drawing frames. It 
contains information about the score, the ball's location/velocity, as well as 
the status of various robots on each team.

## player.js
```
player.id
player.action(state)
player.message(id, data)
```

The other main component is the `player.js` file. Each competitor creates their 
own `player` object which gets loaded into the engine. Several instances of the 
each competitors `player` object are created, one for each player on that 
competitor's team, and each instance is assigned an unique id. The `player` 
object can use that id to send messages to other players on their team.

Every time the frame changes, each instance of the `player` is examined and the 
`player.action` method is called. State information containing the location of 
the ball, other players, and the goals is provided, and either an acceleration 
vector or a "kick" command should be returned in a reasonable amount of time.

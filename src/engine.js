/**
 * The Engine class does everything from doing the math for the simulation 
 * to rendering the canvas after every frame is processed.
 * 
 * Usage:
    var engine = new Engine();
    engine.setCanvas(document.getElementById('field'));
    // engine.setPlayer1(Player);
    // engine.setPlayer2(Player);

    function step(timestamp) {
        engine.drawFrame();
        if (!engine.isDone())
            window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
 * 
 * @author Kevin Zhang & Felipe Hofmann
 */
function Engine() {
    var IS_DONE = false;
    var MAX_SPEED = 2;
    var NUM_PLAYER = 6;
    var LINE_WIDTH = 5;
    var GOAL_HEIGHT = 200;
    var FIELD_WIDTH = 1100;
    var FIELD_HEIGHT = 700;
    var PLAYER_RADIUS = 25;
    
    var cvs = false;
    var ctx = false;
    var team1 = [];
    var team2 = [];
    var time = 0;
    
    /**
     * This function prepares the canvas by setting the width and height and 
     * then calling the `drawField` function to fill the canvas with a 
     * beautiful forest green background. It also stores references to the 
     * canvas and context variables.
     */
    function setCanvas(canvas) {
        cvs = canvas;
        ctx = cvs.getContext("2d");
        cvs.width = FIELD_WIDTH;
        cvs.height = FIELD_HEIGHT;
    }
    
    /**
     * Create NUM_PLAYER instances of the Player function, and append each 
     * instance to the team1 array. Each instances is placed at a random 
     * location on team1's side of the field.
     */
    function setPlayer1(Player) {
        for (var p = 0; p < NUM_PLAYER; p++) {
            var player = new Player()
            player.id = p;
            team1.push({
                x: Math.random() * (FIELD_WIDTH/2 - 2*PLAYER_RADIUS) + PLAYER_RADIUS,
                y: Math.random() * (FIELD_HEIGHT - 2*PLAYER_RADIUS) + PLAYER_RADIUS,
                vx: 0,
                vy: 0,
                player: player
            });
        }
    }
    
    /**
     * Create NUM_PLAYER instances of the Player function, and append each 
     * instance to the team2 array. Each instances is placed at a random 
     * location on team2's side of the field.
     */
    function setPlayer2(Player) {
        for (var p = 0; p < NUM_PLAYER; p++) {
            var player = new Player()
            player.id = p;
            team2.push({
                x: Math.random() * (FIELD_WIDTH/2 - 2*PLAYER_RADIUS) + FIELD_WIDTH/2 + PLAYER_RADIUS,
                y: Math.random() * (FIELD_HEIGHT - 2*PLAYER_RADIUS) + PLAYER_RADIUS,
                vx: 0,
                vy: 0,
                player: player
            });
        }
    }
    
    /**
     * Draws the field. Computes the state. Simulates a step. And increments
     * the time.
     */
    function drawFrame() {
        var goal = drawField();
        var state = computeState(goal);
        simulateStep(state);
        time++;
    }
    
    /**
     * Draw the background, players, and goals. Return an object describing
     * the location of the goals.
     */
    function drawField() {
        // fill background
        ctx.fillStyle = "#009900";
        ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

        // draw half-way line
        ctx.lineWidth = LINE_WIDTH;
        ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF"; 
            ctx.moveTo(FIELD_WIDTH/2, 0);
            ctx.lineTo(FIELD_WIDTH/2, FIELD_HEIGHT);
            ctx.stroke();
        ctx.closePath();

        // draw center circle
        ctx.beginPath();
            ctx.arc(FIELD_WIDTH/2, FIELD_HEIGHT/2, 75, 0, 2*Math.PI);
            ctx.stroke();
        ctx.closePath();

        // draw end zones
        ctx.strokeRect(0 - LINE_WIDTH, FIELD_HEIGHT/2 - GOAL_HEIGHT, GOAL_HEIGHT, GOAL_HEIGHT*2);
        ctx.strokeRect(FIELD_WIDTH - GOAL_HEIGHT + LINE_WIDTH, FIELD_HEIGHT/2 - GOAL_HEIGHT, GOAL_HEIGHT, GOAL_HEIGHT*2);

        // draw players
        ctx.fillStyle = "deepskyblue";
        for (var p = 0; p < NUM_PLAYER; p++) {
            ctx.beginPath();
            ctx.arc(team1[p].x, team1[p].y, PLAYER_RADIUS, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        ctx.fillStyle = "salmon";
        for (var p = 0; p < NUM_PLAYER; p++) {
            ctx.beginPath();
            ctx.arc(team2[p].x, team2[p].y, PLAYER_RADIUS, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

        // draw goals
        var goal = [
            {
                x1: LINE_WIDTH,
                y1: FIELD_HEIGHT/2 - GOAL_HEIGHT/2,
                x2: (LINE_WIDTH) + (LINE_WIDTH*3),
                y2: (FIELD_HEIGHT/2 - GOAL_HEIGHT/2) + (GOAL_HEIGHT)
            },
            {
                x1: FIELD_WIDTH - LINE_WIDTH*3 - LINE_WIDTH,
                y1: FIELD_HEIGHT/2 - GOAL_HEIGHT/2,
                x2: (FIELD_WIDTH - LINE_WIDTH*3 - LINE_WIDTH) + (LINE_WIDTH*3),
                y2: (FIELD_HEIGHT/2 - GOAL_HEIGHT/2) + (GOAL_HEIGHT)
            }
        ];
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(goal[0].x1, goal[0].y1, goal[0].x2 - goal[0].x1, goal[0].y2 - goal[0].y1);
        ctx.fillRect(goal[1].x1, goal[1].y1, goal[1].x2 - goal[1].x1, goal[1].y2 - goal[1].y1);
        return goal;
    };

    /**
     * Compute the state of the game using the location of the goals.
     */
    function computeState(goal) {
        return {
            time: time
        }
    }

    /**
     * Call the action function on each player using the given state object.
     * Apply the returned acceleration vector.
     */
    function simulateStep(state) {
        for (var p = 0; p < NUM_PLAYER; p++) {
            var vector = false;
            vector = team1[p].player.action(state);
            team1[p].x += team1[p].vx;
            team1[p].y += team1[p].vy;
            team1[p].vx += vector.x;
            if (Math.abs(team1[p].vx) > MAX_SPEED)
                team1[p].vx = MAX_SPEED*team1[p].vx/Math.abs(team1[p].vx);
            team1[p].vy += vector.y;
            if (Math.abs(team1[p].vy) > MAX_SPEED)
                team1[p].vy = MAX_SPEED*team1[p].vy/Math.abs(team1[p].vy);

            vector = team2[p].player.action(state);
            team2[p].x += team2[p].vx;
            team2[p].y += team2[p].vy;
            team2[p].vx += vector.x;
            if (Math.abs(team2[p].vx) > MAX_SPEED)
                team2[p].vx = MAX_SPEED*team2[p].vx/Math.abs(team2[p].vx);
            team2[p].vy += vector.y;
            if (Math.abs(team2[p].vy) > MAX_SPEED)
                team2[p].vy = MAX_SPEED*team2[p].vy/Math.abs(team2[p].vy);
        }
    }

    var exports = {};
    exports.setCanvas = setCanvas;
    exports.setPlayer1 = setPlayer1;
    exports.setPlayer2 = setPlayer2;
    exports.drawFrame = drawFrame;
    return exports;
}

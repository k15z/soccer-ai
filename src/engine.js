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
    var SOCCER_RADIUS = 15;
    var FRICTION_RATE = .99;
    
    var time = 0;
    var cvs = false;
    var ctx = false;
    var team1 = [], team2 = [];
    var ball = {
        x: FIELD_WIDTH/2,
        y: FIELD_HEIGHT/2,
        vx: Math.random()*2 - 1,
        vy: Math.random()*2 - 1
    };

    function isDone() {
        return IS_DONE;
    }
    
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
        var goal = updateView();
        var state = currentState(goal);
        simulateStep(goal, state);
        time++;
    }
    
    /**
     * Draw the background, players, and goals. Return an object describing
     * the location of the goals.
     */
    function updateView() {
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

        // draw ball
        ctx.fillStyle = "white";
        ctx.beginPath();
            ctx.arc(ball.x, ball.y, SOCCER_RADIUS, 0, Math.PI*2);
            ctx.fill();
        ctx.closePath();

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
    function currentState(goal) {
        return {
            time: time,
            ball: ball,
            goal: goal,
            team1: team1,
            team2: team2
        }
    }

    /**
     * Call the action function on each player using the given state object.
     * Apply the returned acceleration vector.
     */
    function simulateStep(goal, state) {
        // calculate new location/velocity
        function kinematics(team) {
            if (!team) {
                ball.x += ball.vx;
                ball.vx *= FRICTION_RATE;
                if (ball.x < 0 + SOCCER_RADIUS || ball.x > FIELD_WIDTH - SOCCER_RADIUS)
                    ball.vx = -ball.vx;

                ball.y += ball.vy;
                ball.vy *= FRICTION_RATE;
                if (ball.y < 0 + SOCCER_RADIUS || ball.y > FIELD_HEIGHT - SOCCER_RADIUS)
                    ball.vy = -ball.vy;

                return;
            }

            for (var p = 0; p < NUM_PLAYER; p++) {
                var accel = team[p].player.action(state);

                team[p].x += team[p].vx;
                if (team[p].x < 0 + PLAYER_RADIUS)
                    team[p].x = 0 + PLAYER_RADIUS;
                if (team[p].x > FIELD_WIDTH - PLAYER_RADIUS)
                    team[p].x = FIELD_WIDTH - PLAYER_RADIUS;

                team[p].y += team[p].vy;
                if (team[p].y < 0 + PLAYER_RADIUS)
                    team[p].y = 0 + PLAYER_RADIUS;
                if (team[p].y > FIELD_HEIGHT - PLAYER_RADIUS)
                    team[p].y = FIELD_HEIGHT - PLAYER_RADIUS;

                team[p].vx += accel.x;
                if (Math.abs(team[p].vx) > MAX_SPEED)
                    team[p].vx = MAX_SPEED*team[p].vx/Math.abs(team[p].vx);

                team[p].vy += accel.y;
                if (Math.abs(team[p].vy) > MAX_SPEED)
                    team[p].vy = MAX_SPEED*team[p].vy/Math.abs(team[p].vy);
            }
        }
        kinematics();
        kinematics(team1);
        kinematics(team2);

        // handle collisions
        function collisions(ball, goal, player) {
            for (var g = 0; g < goal.length; g++)
                if (goal[g].x1 < ball.x && ball.x < goal[g].x2)
                    if (goal[g].y1 < ball.y && ball.y < goal[g].y2)
                        IS_DONE = true;

            for (var p1 = 0; p1 < player.length; p1++) {
                var distance = 0.0;
                distance += (player[p1].x - ball.x) * (player[p1].x - ball.x);
                distance += (player[p1].y - ball.y) * (player[p1].y - ball.y);
                distance = Math.sqrt(distance);
                if (distance < PLAYER_RADIUS + SOCCER_RADIUS) {
                    ball.vx += player[p1].vx;
                    ball.vy += player[p1].vy;
                }

                for (var p2 = p1; p2 < player.length; p2++) {
                    if (p1 == p2)
                        continue;
                    var distance = 0.0;
                    distance += (player[p1].x - player[p2].x) * (player[p1].x - player[p2].x);
                    distance += (player[p1].y - player[p2].y) * (player[p1].y - player[p2].y);
                    distance = Math.sqrt(distance);
                    if (distance < PLAYER_RADIUS*2) {
                        player[p1].vx = -player[p1].vx;
                        player[p1].vy = -player[p1].vy;
                        player[p2].vx = -player[p2].vx;
                        player[p2].vy = -player[p2].vy;
                    }
                }
            }
        }
        collisions(ball, goal, [].concat(team1).concat(team2));

        return;
    }

    var exports = {};
    exports.isDone = isDone;
    exports.setCanvas = setCanvas;
    exports.setPlayer1 = setPlayer1;
    exports.setPlayer2 = setPlayer2;
    exports.drawFrame = drawFrame;
    return exports;
}

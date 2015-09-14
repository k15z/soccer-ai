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
    var NUM_PLAYER = 6;
    var LINE_WIDTH = 5;
    var GOAL_HEIGHT = 200;
    var FIELD_WIDTH = 1100;
    var FIELD_HEIGHT = 700;
    
    var cvs = false, ctx = false;
    var team1 = [], team2 = [];
    
    /**
     * This function prepares the canvas by setting the width and height and 
     * then calling the `drawField` function to fill the canvas with a 
     * beautiful forest green background. It also stores references to the 
     * canvas and context variables.
     */
    function setCanvas(canvas) {
        cvs = canvas;
        cvs.width = FIELD_WIDTH;
        cvs.height = FIELD_HEIGHT;
        
        ctx = cvs.getContext("2d");
        drawField();
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
            team1.append({
                x: Math.random() * FIELD_WIDTH/2,
                y: Math.random() * FIELD_HEIGHT,
                player
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
            team2.append({
                x: Math.random() * FIELD_WIDTH/2 + FIELD_WIDTH/2,
                y: Math.random() * FIELD_HEIGHT,
                player
            });
        }
    }
    
    function drawFrame() {
        var goal = drawField();
    }
    
    /**
     * This helper function draws the field, and more importantly, returns 
     * an object containing the location of the goals.
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

    var exports = {};
    exports.setCanvas = setCanvas;
    exports.setPlayer1 = setPlayer1;
    exports.setPlayer2 = setPlayer2;
    exports.drawFrame = drawFrame;
    return exports;
}

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
    var cvs = false;
    var ctx = false;
    var WIDTH = 1100;
    var HEIGHT = 750;
    var GOAL_SIZE = 100;
    
    /**
     * This function prepares the canvas by setting the width and height and 
     * then filling the canvas with a beautiful forest green background. It 
     * also stores the references to the canvas and context variables.
     */
    function setCanvas(canvas) {
        cvs = canvas;
        cvs.width = WIDTH;
        cvs.height = HEIGHT;
        
        ctx = cvs.getContext("2d");
        ctx.fillStyle = "#009900";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    
    function drawFrame() {
        (function() {
        })();
    }
    
    var exports = {};
    exports.setCanvas = setCanvas;
    exports.drawFrame = drawFrame;
    return exports;
}

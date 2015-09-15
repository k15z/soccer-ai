function Engine(canvas, Player1, Player2) {
    var FRICTION = 0.99;
    var PLAYERS = 6, MAX_TIME = 2000;
    var BOT_SPEED = 2, BALL_SPEED = 10;
    var BALL_RADIUS = 10, BOT_RADIUS = 15;
    var GOAL_WIDTH = 15, GOAL_HEIGHT = 150;
    var FIELD_WIDTH = 1100, FIELD_HEIGHT = 600;
    
    var winner = false;
    function won() {
        if (time > MAX_TIME)
            return -1;
        return winner;
    }
    
    var time = 0;
    var ball = {
        x: FIELD_WIDTH/2, y: FIELD_HEIGHT/2,
        vx: Math.random()*4 - 2, vy: Math.random()*4 - 2
    };
    var goal1 = {
        x1: 2, y1: FIELD_HEIGHT/2 - GOAL_HEIGHT/2,
        x2: GOAL_WIDTH, y2: FIELD_HEIGHT/2 + GOAL_HEIGHT/2
    };
    var goal2 = {
        x1: FIELD_WIDTH - GOAL_WIDTH, y1: FIELD_HEIGHT/2 - GOAL_HEIGHT/2,
        x2: FIELD_WIDTH - 2, y2: FIELD_HEIGHT/2 + GOAL_HEIGHT/2
    };
    var team1 = [], team2 = [];
    for (var i = 0; i < PLAYERS; i++) {
        var player1 = Player1(1, i);
        team1.push({
            "x": Math.random() * (FIELD_WIDTH/2 - BOT_RADIUS*2) + BOT_RADIUS,
            "y": Math.random() * (FIELD_HEIGHT - BOT_RADIUS*2) + BOT_RADIUS,
            "vx": 0, "vy": 0, "player": player1
        });
        
        var player2 = Player2(2, i);
        team2.push({
            "x": Math.random() * (FIELD_WIDTH/2 - BOT_RADIUS*2) + FIELD_WIDTH/2 + BOT_RADIUS,
            "y": Math.random() * (FIELD_HEIGHT - BOT_RADIUS*2) + BOT_RADIUS,
            "vx": 0, "vy": 0, "player": player2
        });
    }
    
    var cvs = canvas, ctx = canvas.getContext("2d");
    cvs.width = FIELD_WIDTH; cvs.height = FIELD_HEIGHT;
    function step() {
        if (winner) return;
        
        (function(){
            ctx.beginPath();
                ctx.fillStyle = "#009900";
                ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(goal1.x1, goal1.y1, goal1.x2 - goal1.x1, goal1.y2 - goal1.y1);
                ctx.fillRect(goal2.x1, goal2.y1, goal2.x2 - goal2.x1, goal2.y2 - goal2.y1);
            ctx.closePath();
            
            ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#FFFFFF";
                ctx.strokeRect(0, FIELD_HEIGHT/2 - GOAL_HEIGHT, GOAL_HEIGHT, GOAL_HEIGHT*2);
                ctx.strokeRect(FIELD_WIDTH - GOAL_HEIGHT, FIELD_HEIGHT/2 - GOAL_HEIGHT, GOAL_HEIGHT, GOAL_HEIGHT*2);
            ctx.closePath();
            
            ctx.beginPath();
                ctx.moveTo(FIELD_WIDTH/2, 0);
                ctx.lineTo(FIELD_WIDTH/2, FIELD_HEIGHT);
                ctx.stroke();
            ctx.closePath();
            
            ctx.beginPath();
                ctx.arc(FIELD_WIDTH/2, FIELD_HEIGHT/2, BALL_RADIUS*3, 0, 2*Math.PI);
                ctx.stroke();
            ctx.closePath();
            
            ctx.beginPath();
                ctx.fillStyle = "#FFFFFF";
                ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, 2*Math.PI);
                ctx.fill();
            ctx.closePath();
            
            for (var i = 0; i < PLAYERS; i++) {
                ctx.beginPath();
                    ctx.fillStyle = "deepskyblue";
                    ctx.arc(team1[i].x, team1[i].y, BOT_RADIUS, 0, 2*Math.PI);
                    ctx.fill();
                ctx.closePath();
                
                ctx.beginPath();
                    ctx.fillStyle = "salmon";
                    ctx.arc(team2[i].x, team2[i].y, BOT_RADIUS, 0, 2*Math.PI);
                    ctx.fill();
                ctx.closePath();
            }
        })();
        
        (function() {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vx *= FRICTION;
            ball.vy *= FRICTION;
            
            for (var i = 0; i < PLAYERS; i++) {
                team1[i].x += team1[i].vx;
                team1[i].y += team1[i].vy;
                team2[i].x += team2[i].vx;
                team2[i].y += team2[i].vy;
            }
            
            if (goal1.x1 < ball.x && ball.x < goal1.x2)
                if (goal1.y1 < ball.y && ball.y < goal1.y2)
                    winner = 2;
            if (goal2.x1 < ball.x && ball.x < goal2.x2)
                if (goal2.y1 < ball.y && ball.y < goal2.y2)
                    winner = 1;
            
            if (ball.x - 0 < BALL_RADIUS || FIELD_WIDTH - ball.x < BALL_RADIUS) {
                ball.vx = -ball.vx;
                ball.x += 10*ball.vx;
            }
            if (ball.y - 0 < BALL_RADIUS || FIELD_HEIGHT - ball.y < BALL_RADIUS) {
                ball.vy = -ball.vy;
                ball.y += 10*ball.vy;
            }
            
            if (Math.abs(ball.vx) > BALL_SPEED)
                ball.vx = BALL_SPEED * ball.vx / Math.abs(ball.vx);
            if (Math.abs(ball.vy) > BALL_SPEED)
                ball.vy = BALL_SPEED * ball.vy / Math.abs(ball.vy);
            
            var distance = 0.0;
            var teams = [].concat(team1).concat(team2);
            for (var i = 0; i < teams.length; i++) {
                distance = Math.sqrt(
                    (teams[i].x - ball.x) * (teams[i].x - ball.x) + 
                    (teams[i].y - ball.y) * (teams[i].y - ball.y)
                );
                if (distance <= BOT_RADIUS + BALL_RADIUS) {
                    var newVelX1 = (ball.vx * (BALL_RADIUS - BOT_RADIUS) + (2 * BOT_RADIUS * teams[i].vx)) / (BALL_RADIUS + BOT_RADIUS);
                    var newVelY1 = (ball.vy * (BALL_RADIUS - BOT_RADIUS) + (2 * BOT_RADIUS * teams[i].vy)) / (BALL_RADIUS + BOT_RADIUS);
                    ball.vx = 2*newVelX1; ball.vy = 2*newVelY1;
                    ball.x += 5*ball.vx; ball.y += 5*ball.vy;
                }
                
                for (var j = i; j < teams.length; j++) {
                    if (j == i)
                        continue;
                    distance = Math.sqrt(
                        (teams[i].x - teams[j].x) * (teams[i].x - teams[j].x) + 
                        (teams[i].y - teams[j].y) * (teams[i].y - teams[j].y)
                    );
                    if (distance <= BOT_RADIUS + BOT_RADIUS) {
                        teams[i].x -= teams[i].vx;
                        teams[i].y -= teams[i].vy;
                        teams[j].x -= teams[j].vx;
                        teams[j].y -= teams[j].vy;
                        
                        teams[i].vx = 0;
                        teams[i].vy = 0;
                        teams[j].vx = 0;
                        teams[j].vy = 0;
                    }
                }
            }
        })();
        
        (function() {
            var state = {
                "time": time,
                "ball": ball,
                "goal1": goal2,
                "goal2": goal2,
                "team1": team1,
                "team2": team2
            };
            
            var teams = [].concat(team1).concat(team2);
            for (var i = 0; i < teams.length; i++) {
                var state2 = $.extend({}, state, teams[i]);
                var accel = teams[i].player.action(state2);
                teams[i].vx += accel.ax;
                if (Math.abs(teams[i].vx) > BOT_SPEED)
                    teams[i].vx = (BOT_SPEED) * teams[i].vx / Math.abs(teams[i].vx);
                teams[i].vy += accel.ay;
                if (Math.abs(teams[i].vy) > BOT_SPEED)
                    teams[i].vy = (BOT_SPEED) * teams[i].vy / Math.abs(teams[i].vy);
                if (teams[i].x - BOT_RADIUS < 0)
                    teams[i].vx = 0;
                if (teams[i].x > FIELD_WIDTH - BOT_RADIUS)
                    teams[i].vx = 0;
                if (teams[i].y - BOT_RADIUS < 0)
                    teams[i].vy = 0;
                if (teams[i].y > FIELD_HEIGHT - BOT_RADIUS)
                    teams[i].vy = 0;
            }
        })();
        
        time++;
    }

    var exports = {};
    exports.won = won;
    exports.step = step;
    return exports;
}

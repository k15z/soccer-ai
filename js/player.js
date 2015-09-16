/**
 * The BasicPlayer object demonstrates how to move the robot around in an
 * semi-intelligent fashion by returning an acceleration vector from the
 * "player.action(state)" function. This Player naively chases after the
 * ball - but occasionally takes random detours.
 */
function BasicPlayer(team, id) {
    var t = Math.random() * 10 + 10;
    var t_ax = Math.random() * 10 - 5;
    var t_ay = Math.random() * 10 - 5;
    
    function action(state) {
        if (t-- > 0) {
            return { ax: t_ax, ay: t_ay };
        } else if (Math.random() < 0.02) {
            t = Math.random() * 20 + 20;
            t_ax = Math.random() * 10 - 5;
            t_ay = Math.random() * 10 - 5;
        }
        return {
            ax: (state.ball.x - state.x), 
            ay: (state.ball.y - state.y)
        };
    }
    
    var exports = {};
    exports.action = action;
    return exports;
}

/**
 * The AdvancedPlayer object... will, at the very least, be able to defeat
 * the BasicPlayer.
 */
function AdvancedPlayer(team, id) {
    function action(state) {
        return {
            ax: 0,
            ay: 0
        };
    }

    var exports = {};
    exports.action = action;
    return exports;
}

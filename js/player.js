function Player(team, id) {
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

/**
 */
function Player() {
    var vector = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
    };

    function action(state) {
        return vector;
    }

    var exports = {};
    exports.action = action;
    return exports;
}

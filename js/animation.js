
export function animate(animationFrom, animationTo, duration, cb, done) {
    const animationStarted = Date.now();
    var _animate = () => {
        const elapsed = Date.now() - animationStarted;
        if (elapsed > duration) {
            cb(animationTo);
            done();
            return;
        }
        const v = Math.sin(Math.PI / 2 * elapsed / duration);
        cb(animationFrom + (animationTo - animationFrom) * v);
        requestAnimationFrame(_animate);
    };
    requestAnimationFrame(_animate);
}

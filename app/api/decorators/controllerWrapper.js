export default function controllerWrapper(controllerFn) {
    return async (req, res, next) => {
        try {
            await Promise.resolve(controllerFn(req, res, next));
        } catch (err) {
            console.log(err);
            next(err);
        }
    };
}

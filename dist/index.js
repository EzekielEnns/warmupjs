var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function wr(func, options) {
    var ready = localStorage.getItem("ready");
    if (ready == null) {
        ready = Date.now().toString();
        localStorage.setItem("ready", Date.now().toString());
        options.fn(options === null || options === void 0 ? void 0 : options.props);
    }
    return (...args) => __awaiter(this, void 0, void 0, function* () {
        const last = localStorage.getItem("last");
        const curr = Date.now();
        const diff = curr - parseInt(ready !== null && ready !== void 0 ? ready : curr.toString());
        if (localStorage.getItem("is_timeout")) {
            const last = localStorage.getItem("timeout");
            const diff = curr - parseInt(last !== null && last !== void 0 ? last : curr.toString());
            //remove delay if it exists 
            if (diff <= 0) {
                yield new Promise(function (resolve, _) {
                    setTimeout(function () {
                        localStorage.removeItem("is_timeout");
                        resolve(1);
                    }, diff).toString();
                });
            }
        }
        //if we less than the delay lets enqueue/wait till delay is done
        else if (diff < options.delay) {
            yield new Promise(function (resolve, _) {
                localStorage.setItem("is_timeout", setTimeout(function () {
                    resolve(1);
                }, options.delay - diff).toString());
                localStorage.setItem("timeout", Date.now().toString());
            });
        }
        //if we are past the reset time start a new timeout
        else if ((curr - parseInt(last !== null && last !== void 0 ? last : curr.toString())) / 60000 > options.reset) {
            options.fn(options.props);
            yield new Promise(function (resolve, _) {
                localStorage.setItem("is_timeout", setTimeout(function () {
                    resolve(1);
                }, options.delay).toString());
                localStorage.setItem("timeout", Date.now().toString());
            });
        }
        const result = yield func(...args)
            .catch(options === null || options === void 0 ? void 0 : options.err);
        localStorage.setItem("last", Date.now().toString());
        return result;
    });
}

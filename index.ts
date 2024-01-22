

type Options<T> = {
    fn:(props:T) => any;         //warm up function
    props:T | undefined;                     //props for func
    delay:number;                //delay for serverless, in miliseconds
    err:(props:Error) => void|undefined;   //error handler 
    reset:number;                //time to reset delay in mintues
}


type AnyAsyncFunction = (...args: any[]) => Promise<any>;

export function wr<T extends AnyAsyncFunction,J>( func: T,options:Options<J>): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  var ready = localStorage.getItem("ready");
  if (ready == null) {
    
    ready = Date.now().toString();
    localStorage.setItem("ready", Date.now().toString());
    options.fn(options?.props)
  }
  return async (...args: Parameters<T>) => {
    const last = localStorage.getItem("last");
    const curr = Date.now();
    const diff = curr - parseInt(ready ?? curr.toString());
    
    

    if (localStorage.getItem("is_timeout")) {
      const last = localStorage.getItem("timeout");
      const diff = curr - parseInt(last ?? curr.toString());
        
      //remove delay if it exists 
      if (diff <= 0) {
        await new Promise(function (resolve, _) {
          setTimeout(function () {
            localStorage.removeItem("is_timeout");
            resolve(1);
          }, diff).toString();
          
        });
      }
    } 
    //if we less than the delay lets enqueue/wait till delay is done
    else if (diff < options.delay) {
      
      await new Promise(function (resolve, _) {
        localStorage.setItem(
          "is_timeout",
          setTimeout(function () {
            resolve(1);
          }, options.delay - diff).toString()
        );
        
        localStorage.setItem("timeout", Date.now().toString());
      });
    } 
    //if we are past the reset time start a new timeout
    else if ((curr - parseInt(last ?? curr.toString())) / 60000 > options.reset) {
      
      options.fn(options.props);
      await new Promise(function (resolve, _) {
        localStorage.setItem(
          "is_timeout",
          setTimeout(function () {
            resolve(1);
          }, options.delay).toString()
        );
        localStorage.setItem("timeout", Date.now().toString());
      });
    }

    const result = await func(...args)
        .catch(options?.err)
    localStorage.setItem("last", Date.now().toString());
    return result;
  };
}

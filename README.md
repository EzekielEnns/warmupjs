# WarmUp JS

ever needed to call a warm up function before using some serverless api/database

well look no further warmupJs is here.

```js
wr( 
    fetch("some api that needs access to a cool serverless thing"), 
    { fn:fetch("warmup/"), delay:45000, rest:30/*time in minutes*/ err:some_error_fun } )(props)
```
In classic JS fashion feel free to wrap the wrapper too!
```js
export wr2 = (T extends AnyAsyncFunction)=>(wr(T,{/*your options*/})())
```
*I do plan on adding support for setting global options*

## Options
```typescript
type Options<T> = {
    fn:(props:T) => any;         //warm up function
    props:T | undefined;                     //props for func
    delay:number;                //delay for serverless, in miliseconds
    err:(props:Error) => void|undefined;   //error handler 
    reset:number;                //time to reset delay in mintues
}
```

## why make this
well I ran into a problem where I needed to wake up a serverless database for testing
and for a product that was in pre-alpha, it's really useful to be able to 
warm up something like aurora db or Azure SQL Serverless

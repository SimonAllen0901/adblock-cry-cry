> [!WARNING]
>
> This project is under active development!

# AdBlockCryCry

A simple JavaScript library to detect if a user has an AdBlocker installed in their browser.


```=js
const detector = new AdBlockCryCry()

detector.init(async () => {
  const isAdblock = await detector.detect();
  if (isAdblock) {
    console.log("AD Blocker detected!");
    // do something..
  } else {
    console.log("No AD Blocker detected!");
    // do something..
  }
});
```

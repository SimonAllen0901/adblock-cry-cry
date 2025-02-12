> [!WARNING]
>
> This project is under active development!

# AdBlockCryCry

A simple JavaScript library to detect if a user has an AdBlocker installed in their browser.

## Usage

```=js
import AdBlockCryCry from "adblockcrycry";

const detector = new AdBlockCryCry();

detector.init(async () => {
  const isAdblock = await detector.detect();
  if (isAdblock) {
    console.log("AD Blocker detected!");
    // Take appropriate action
  } else {
    console.log("No AD Blocker detected!");
  }
});

```

## API Reference

### `new AdBlockCryCry(options)`

Creates an instance of the AdBlockCryCry detector.

| Parameter | Type | Default | Description | 
| --- | --- | --- | --- |
| `img` | `string` | `"/ads.jpg"` | Path to a dummy ad image used for detection |
| `elementIds` | `Array<string>` | `[]` | Additional ad-related element IDs to check |

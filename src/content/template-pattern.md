---
title: "Design Pattern Template With Typescript"
date: "2021-11-02"
draft: false
path: "/blog/design-pattern-template-ts"
---

## Summary
In this post I will show example design pattern Template with Typescript.

The Template pattern will exposes the template. The sub class can override method and implement base on abstract class.

Refer from [tutorial](https://www.tutorialspoint.com/design_pattern/template_pattern.htm)

## Getting started

In this post we will use [Typescript Playground](https://www.typescriptlang.org/play) to easy setup typescript. 

## Example

1. Create template with abstract class

```ts
abstract class Game {
  abstract init(): void
  abstract start(): void
  abstract end(): void

  play() {
    this.init();
    this.start();
    this.end();
  }
}
```

2. Create sub class extends template

```ts
class SnakeGame extends Game {
  init() {
    console.log('Init SnakeGame');
  }

  start() {
    console.log('Start SnakeGame');
  }

  end() {
    console.log('End SnakeGame');
  }
}

class RubikGame extends Game {
  init() {
    console.log('Init RubikGame');
  }

  start() {
    console.log('Start RubikGame');
  }

  end() {
    console.log('End RubikGame');
  }
}
```

3. Verify outout

```ts
const snakeGame: Game = new SnakeGame();
const rubikGame: Game = new RubikGame();

snakeGame.play()
rubikGame.play();
```

```bash
[LOG]: "Init SnakeGame" 
[LOG]: "Start SnakeGame" 
[LOG]: "End SnakeGame" 
[LOG]: "Init RubikGame" 
[LOG]: "Start RubikGame" 
[LOG]: "End RubikGame" 
```

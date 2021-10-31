---
title: "Design Pattern Observer With Typescript"
date: "2021-10-31"
draft: false
path: "/blog/design-pattern-observer-ts"
---

## Summary
In this post I will show example design pattern Observer with Typescript.

Observer pattern is used when there is one-to-many relationship between objects such as if one object is modified, its depenedent objects are to be notified automatically

Refer from [tutorial](https://www.tutorialspoint.com/design_pattern/observer_pattern.htm)

## Getting started

In this post we will use [Typescript Playground](https://www.typescriptlang.org/play) to easy setup typescript. 

## Example

1. Create an interface

```ts
interface IObserver {
  update(state: any): void
}
```

2. Create Subject class

```ts
class Subject {
  private state: any;
  private observers: IObserver[];

  constructor(initState: any) {
    this.state = initState;
    this.observers = [];
  }

  setState(newState: any) {
    this.state = newState;
    this.notify();
  }

  attach(observer: IObserver) {
    this.observers.push(observer);
  }

  private notify() {
    this.observers.forEach((observer: IObserver) => {
      observer.update(this.state);
    });
  }
}
```

3. Create class implement IObserver

```ts
abstract class Observer implements IObserver {
  private subject: Subject;

  constructor(subject: Subject) {
    this.subject = subject;
    this.subject.attach(this);
  }

  abstract update(state: any): void
}

class BinaryObserver extends Observer {
  update(state: any) {
    console.log(`BinaryObserver Receive state, ${state}`);
  }
}

class HexaObserver extends Observer {
  update(state: any) {
    console.log(`HexaObserver Receive state, ${state}`);
  }
}
```

4. Use Subject Class to notify to Observer class

```ts
const subject = new Subject(0);
const binary = new BinaryObserver(subject);
const hexa = new HexaObserver(subject);

subject.setState(2);
```

5. Verify output

```bash
[LOG]: "BinaryObserver Receive state, 2" 
[LOG]: "HexaObserver Receive state, 2" 
```

---
title: "Design Pattern Factory With Typescript"
publishDate: "2021-10-30"
description: "note"
tags: ["Typescript", "design pattern", "javascript"]
---

## Summary
In this post I will show example design pattern Factory with Typescript.

The Factory pattern provide one of the best ways to create an object.

Refer from [tutorial](https://www.tutorialspoint.com/design_pattern/factory_pattern.htm)

## Getting started

In this post we will use [Typescript Playground](https://www.typescriptlang.org/play) to easy setup typescript. 

## Example

1. Create an interface

```ts
interface IShape {
  draw(): void
}
```

2. Create class implement interface

```ts
class Rectangle implements IShape {
  draw() {
    console.log('Rectangle');
  }
}

class Square implements IShape {
  draw() {
    console.log('Square');
  }
}

class Circle implements IShape {
  draw() {
    console.log('Circle');
  }
}
```

3. Create factory class

```ts
enum ShapeType {
  RECTANGLE = 'RECTANGLE',
  SQUARE = 'SQUARE',
  CIRCLE = 'CIRCLE',
}

class ShapeFactory {
  getShape(shapeType: string): IShape | null {
    switch (shapeType) {
      case ShapeType.RECTANGLE:
        return new Rectangle();
      case ShapeType.SQUARE:
        return new Square();
      case ShapeType.CIRCLE:
        return new Circle();
      default:
        return null;
    }
  }
}
```

4. Use Factory Class to get instance of the class

```ts
const shapeFactory = new ShapeFactory();

const rec = shapeFactory.getShape(ShapeType.RECTANGLE);
const square = shapeFactory.getShape(ShapeType.SQUARE);
const circle = shapeFactory.getShape(ShapeType.CIRCLE);
```

5. Verify output

```ts
(rec as  IShape).draw();
(square as  IShape).draw();
(circle as  IShape).draw();
```

```bash
[LOG]: "Rectangle" 
[LOG]: "Square" 
[LOG]: "Circle"
```
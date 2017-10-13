'use strict';

//Nazaire's JavaScript Engine
class Vector {
  constructor(x, y) {
    this[0] = x;
    this[1] = y;
    this[2] = 1;
  }

  // --- MUTATORS ---

  //Adds a vector to this vector
  add(v) {
    this[0] += v.x;
    this[1] += v.y;

    return this;
  }

  //Subtracts a vector from this vector
  subtract(v) {
    this[0] -= v.x;
    this[1] -= v.y;

    return this;
  }

  //Scales this vector by x (and y)
  scale(x, y) {
    if (arguments.length === 2) {
      this[0] *= x;
      this[1] *= y;
    } else {
      this[0] *= x.x;
      this[1] *= x.y;
    }

    return this;
  }

  //Scales this vector by the components of another vector
  scaleBy(x) {
    this[0] *= x;
    this[1] *= x;

    return this;
  }

  // --- RETURNS NEW OBJECTS ---

  //Returns the result of adding another vector to this vector
  plus(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  //Returns the result of subtracting another vector from this vector
  minus(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  //Returns the result of scaling this vector
  times(x, y) {
    if (arguments.length === 2)
      return new Vector(this.x * x, this.y * y);
    else
      return new Vector(this.x * x.x, this.y * x.y);
  }

  //Returns the result of scaling this vector
  timesBy(x) {
    return new Vector(this.x * x, this.y * x);
  }

  //Returns the scalar result of multiplying this vector with another vector
  dot(v) {
    return this.x * v.x + this.y + v.y;
  }

  //Sets the values of this vector to the provided x and y
  setTo(x, y) {
    if (arguments.length === 2) {
      this[0] = x;
      this[1] = y;
    } else {
      this[0] = x.x;
      this[1] = x.y;
    }
  }

  // --- PRIVATE GETTERS ---

  //Get the x component of this vector
  get x() {
    return this[0];
  }

  //Get the y component of this vector
  get y() {
    return this[1];
  }

  //Get the z component of this vector
  get z() {
    return this[2];
  }

  //Returns this vector, with absolute values
  get abs() {
    return new Vector(Math.abs(this.x), Math.abs(this.y));
  }
  //Returns a copy of this vector, with each component as a demoninator under 1
  get reciprocal() {
    return new Vector(1 / this.x, 1 / this.y);
  }

  //Returns the length of this vector, squared. Fast.
  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  //Returns the length of this vector. Slow.
  get length() {
    return Math.pow(this.lengthSquared, 0.5);
  }

  //Returns the unit vector of this vector. Slow.
  get unit() {
    return this.times(1 / this.length);
  }

  //Returns a copy of this vector
  get copy() {
    return new Vector(this.x, this.y);
  }

  // --- STATIC GETTERS ---

  //The zero vector (0, 0)
  static get zero() {
    return new Vector(0, 0);
  }

  //The one vector (1, 1)
  static get one() {
    return new Vector(1, 1);
  }

  //The 'up' vector (0, 1)
  static get up() {
    return new Vector(0, 1);
  }

  //The 'right' vector (1, 0)
  static get right() {
    return new Vector(1, 0);
  }
}
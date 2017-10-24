'use strict';

//As of now, this class is only good for 2D
//Nazaire's JavaScript Engine
class Vector {
  constructor(x, y, z) {
    this[0] = x;
    this[1] = y !== null ? y : x;
    this[2] = z !== null ? z : 1;
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
    if (y !== null) {
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
  
  //Rotates this vector by the given value (radians)
  rotate(radians){
    this.setTo(this.x * Math.cos(radians) - this.y * Math.sin(radians), this.x * Math.sin(radians) + this.y * Math.cos(radians));
    
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
    if (y !== null)
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
  
  //Returns the result of rotating this vector
  rotatedBy(radians){
    return new Vector(this.x * Math.cos(radians) - this.y * Math.sin(radians), this.x * Math.sin(radians) + this.y * Math.cos(radians));
  }

  //Sets the values of this vector to the provided x and y
  setTo(x, y, z) {
    if (y !== null) {
      this[0] = x;
      this[1] = y;
    } else {
      this[0] = x.x;
      this[1] = x.y;
    }
    
    return this;
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
  
  //Returns the angle of the vector, in radians
  get angle(){
    return Math.atan2(this.y, this.x);
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
    return new Vector(this.x, this.y, this.z);
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
  
  //MATRIX FUNCTIONS
  get translationMatrix(){
    return [[1, 0, this.x], [0, 1, this.y], [0, 0, 1]];
  }
  get rotationMatrix(){
    let angle = this.angle;
    
    return [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0, 1]];
  }
  get scaleMatrix(){
    return [[this.x, 0, 0], [0, this.y, 0], [0, 0, 1]];
  }
  
  multM(m1, m2){
    let m1x0 = m1[0][0], m1x1 = m1[0][1], m1x2 = m1[0][2],
        m1y0 = m1[1][0], m1y1 = m1[1][1], m1y2 = m1[1][2],
        m1z0 = m1[2][0], m1z1 = m1[2][1], m1z2 = m1[2][2];
    
    if(m2){
      let m2x0 = m1[0][0], m2x1 = m1[0][1], m2x2 = m1[0][2],
          m2y0 = m1[1][0], m2y1 = m1[1][1], m2y2 = m1[1][2],
          m2z0 = m1[2][0], m2z1 = m1[2][1], m2z2 = m1[2][2];

      return [[m1x0 * m2x0 + m1x1 * m2y0 + m1x2 * m2z0, m1x0 * m2x1 + m1x1 * m2y1 + m1x2 * m2z1, m1x0 * m2x2 + m1x1 * m2y2 + m1x2 * m2z2],
             [m1y0 * m2x0 + m1y1 * m2y0 + m1y2 * m2z0, m1y0 * m2x1 + m1y1 * m2y1 + m1y2 * m2z1, m1y0 * m2x2 + m1y1 * m2y2 + m1y2 * m2z2],
             [m1z0 * m2x0 + m1z1 * m2y0 + m1z2 * m2z0, m1z0 * m2x1 + m1z1 * m2y1 + m1z2 * m2z1, m1z0 * m2x2 + m1z1 * m2y2 + m1z2 * m2z2]];
    }else{
      return new Vector(this.x * m1x0 + this.y * m1x1 + this.z * m1x2, this.x * m1y0 + this.y * m1y1 + this.z * m1y2, this.x * m1z0 + this.y * m1z1 + this.z * m1z2);
    }
  }
}
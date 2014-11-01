function getAreaOfRectangle(Base, Height) {
  return Base * Height;
}

function getAreaOfTriangle(Base, Height) {
  return Base * Height;
}

var Base = INPUT("base");
var Height = INPUT("height");
OUTPUT("Area of a " + Base + " x " + Height + " rectangle = " + getAreaOfRectangle(Base, Height));
OUTPUT("Area of a " + Base + " x " + Height + " triangle = " + getAreaOfTriangle(Base, Height));

function getAreaOfRectangle(Base, Height) {
  return Base * Height;
}

function getAreaOfTriangle(Base, Height) {
  return Base * Height;
}

function main() {
    var Base = INPUT("base");
    var Height = INPUT("height");
    OUTPUT("rectangle", getAreaOfRectangle(Base, Height));
    OUTPUT("triangle", getAreaOfTriangle(Base, Height));
}

const { Jimp } = require('jimp');

async function getColor() {
  const image = await Jimp.read('c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\public\\logocafe.png');
  image.resize({ w: 1, h: 1 });
  const color = image.getPixelColor(0, 0);
  console.log("Hex Color: ", color.toString(16));
}

getColor().catch(console.error);

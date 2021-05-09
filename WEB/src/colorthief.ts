import colorThief from 'colorthief';

let thief = null;

/**
 * Shamelessly stole from stack overflow 😇
 * @param r red
 * @param g green
 * @param b blue
 * @returns hexa
 */
const rgbToHex = ([r, g, b]: number[]): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * You know the rules if it works d'ont touch it 😏
 * @param bgColor color of the background
 * @returns if background mostly dark return white else black
 */
const getForegroundColor = (bgColor) =>
  parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000000' : '#ffffff';

export const initThief = (): void => {
  if (thief) return;
  thief = new colorThief();
};

/**
 * get the dominant color of an image
 * @param img image to get color from
 * @returns hexa of the colors
 */
export const getColors = (img: HTMLImageElement): Promise<{ bgColor: string; fgColor: string }> => {
  img.crossOrigin = 'Anonymous';
  return new Promise((resolve) => {
    if (!img.complete) {
      img.onload = () => {
        const bgColor = rgbToHex(thief.getColor(img));
        resolve({ bgColor, fgColor: getForegroundColor(bgColor) });
      };
    } else {
      const bgColor = rgbToHex(thief.getColor(img));
      resolve({ bgColor, fgColor: getForegroundColor(bgColor) });
    }
  });
};

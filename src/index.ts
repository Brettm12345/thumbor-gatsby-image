import { FixedObject, FluidObject } from "gatsby-image";
import { Thumbor } from "thumbor-ts";

import { getBaseProps } from "./util";
import { getDimensions } from "./remote";

const scale = (width: number) => (x: number) => Math.round(width * x);

const getWidths = (sizeMultipliers: number[], width: number) =>
  sizeMultipliers.map(scale(width));

interface BaseArgs {
  /** @default true */
  base64?: boolean;
  /** @default 20 */
  base64Width?: number;
}

interface FixedArgs extends BaseArgs {
  /** @default 400 */
  width?: number;
  /** @default 0 - Automatically scale to aspect ratio */
  height?: number;
}

export const fixed = async (
  image: Thumbor,
  args: FixedArgs
): Promise<FixedObject> => {
  const {
    height = 0,
    width = 400,
    base64: withBase64 = true,
    base64Width = 20
  } = args;
  const sizeMultipliers = [1, 1.5, 2, 3];
  const original = await getDimensions(image);
  const widths = getWidths(sizeMultipliers, width);
  const base = await getBaseProps({
    image,
    original,
    widths,
    width,
    base64Width,
    withBase64,
    height,
    getSrcSet: (_, index) => url => `${url} ${sizeMultipliers[index]}x`
  });
  return {
    ...base,
    height: Math.round(width / base.aspectRatio),
    width
  };
};

interface FluidArgs extends BaseArgs {
  /** @default 800 */
  maxWidth?: number;
  maxHeight?: number;
  /** @default "(max-width: ${maxWidth}px) 100vw, ${maxWidth}px" */
  sizes?: string;
  srcSetBreakpoints?: number[];
}

export const fluid = async (
  image: Thumbor,
  args: FluidArgs = {}
): Promise<FluidObject> => {
  const {
    maxHeight: height = 0,
    srcSetBreakpoints,
    base64: withBase64 = true,
    base64Width = 20,
    maxWidth: maxWidthArg = 800
  } = args;
  const sizeMultipliers = [0.25, 0.5, 1, 1.5, 2, 3];
  const maxWidth = srcSetBreakpoints
    ? srcSetBreakpoints[srcSetBreakpoints.length - 1]
    : maxWidthArg;

  const original = await getDimensions(image);

  const {
    srcSetBreakpoints: widths = getWidths(sizeMultipliers, maxWidth),
    sizes = `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`
  } = args;

  const base = await getBaseProps({
    image,
    original,
    widths,
    withBase64,
    base64Width,
    width: maxWidth,
    height,
    getSrcSet: currentWidth => url => `${url} ${currentWidth}w`
  });

  return {
    ...base,
    sizes
  };
};

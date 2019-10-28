import { FixedObject, FluidObject } from 'gatsby-image'
import { lt } from 'ramda'
import { Thumbor } from 'thumbor-ts/src'

import { getBaseProps, getMeta } from './util'

interface FixedArgs {
  width?: number;
  height?: number;
}

export const fixed = async (
  image: Thumbor,
  { height = 0, width = 400 }: FixedArgs
): Promise<FixedObject> => {
  const sizeMultipliers = [1, 1.5, 2, 3];
  const original = await getMeta(image);
  const widths = sizeMultipliers.map(scale =>
    Math.round(original.width * scale)
  );

  return {
    ...(await getBaseProps(image, original, widths, width, height)),
    height,
    width
  };
};

interface FluidArgs {
  maxWidth?: number;
  maxHeight?: number;
  sizes?: string;
  srcSetBreakpoints?: number[] | null;
}

export const fluid = async (
  image: Thumbor,
  { maxHeight = 0, srcSetBreakpoints, sizes, ...args }: FluidArgs
): Promise<FluidObject> => {
  const sizeMultipliers = [0.25, 0.5, 1, 1.5, 2, 3];
  const maxWidth = srcSetBreakpoints
    ? srcSetBreakpoints[srcSetBreakpoints.length - 1]
    : args.maxWidth || 800;

  const original = await getMeta(image);

  const aspectRatio =
    maxHeight && maxWidth
      ? maxWidth / maxHeight
      : original.width / original.height;

  const widths =
    srcSetBreakpoints ||
    sizeMultipliers
      .map(scale => Math.round(original.width * scale))
      .filter(lt(original.width))
      .concat(original.width);

  return {
    ...(await getBaseProps(image, original, widths, maxWidth, maxHeight)),
    aspectRatio,
    sizes: sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`
  };
};

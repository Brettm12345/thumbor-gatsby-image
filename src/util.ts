import { map, filter, mapWithIndex, unzip } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { Thumbor } from "thumbor-ts";

import { Dimensions, getBase64 } from "./remote";

const gt = (x: number) => (y: number) => x > y;
const join = (sep = "") => (arr: string[]) => arr.join(sep);

export const getUrls = (image: Thumbor): [string, string] => [
  image.buildUrl(),
  image.format("webp").buildUrl()
];

interface GetSrcSetsOptions {
  image: Thumbor;
  widths: number[];
  aspectRatio: number;
  original: Dimensions;
  getSrcSet: (currentWidth: number, index: number) => (url: string) => string;
}

export const getSrcSets = ({
  image,
  widths,
  aspectRatio,
  original,
  getSrcSet
}: GetSrcSetsOptions) =>
  pipe(
    widths,
    filter(gt(original.width)),
    mapWithIndex(
      (index, width) =>
        pipe(
          getUrls(image.resize(width, Math.round(width / aspectRatio))),
          map(getSrcSet(width, index))
        ) as [string, string]
    ),
    unzip,
    map(join(", "))
  );

interface GetBasePropsOptions
  extends Pick<GetSrcSetsOptions, "image" | "widths" | "getSrcSet"> {
  original: Dimensions;
  withBase64: boolean;
  width: number;
  base64Width: number;
  height: number;
}

export const getBaseProps = async ({
  image,
  original,
  width,
  withBase64,
  base64Width,
  height,
  ...rest
}: GetBasePropsOptions) => {
  const aspectRatio =
    height !== 0 ? width / height : original.width / original.height;
  const [src, srcWebp] = getUrls(image.resize(width, height));
  const [srcSet, srcSetWebp] = getSrcSets({
    image,
    original,
    aspectRatio,
    ...rest
  });
  return {
    aspectRatio,
    base64: withBase64
      ? await getBase64(image, base64Width, aspectRatio)
      : undefined,
    src,
    srcWebp,
    srcSet,
    srcSetWebp
  };
};

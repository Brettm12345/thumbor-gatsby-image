import * as FileType from "file-type";
import { pipe } from "fp-ts/lib/pipeable";
import got from "got";
import { filter, join, lte, map, reduce } from "ramda";
import { Thumbor } from "thumbor-ts";

export interface Meta {
  frameCount: number;
  width: number;
  height: number;
  url: string;
}

export const getMeta = async (image: Thumbor): Promise<Meta> => {
  const response = await got(image.metaDataOnly().buildUrl()).json<{
    thumbor: {
      source: Meta;
    };
  }>();
  return response.thumbor.source;
};

export const getUrls = (image: Thumbor): [string, string] => [
  image.buildUrl(),
  image.format("webp").buildUrl()
];

type SrcSets = [string[], string[]];

export const getBase64 = async (image: Thumbor): Promise<string> => {
  const buffer = await got(image.resize(20, 0).buildUrl()).buffer();
  const type = await FileType.fromBuffer(buffer);
  if (!type)
    throw new Error(
      "Failed to generate the image thumbnail: couldn't fetch the file type"
    );
  return `data:${type.mime};base64,${buffer.toString("base64")}`;
};

export const getSrcSets = (
  image: Thumbor,
  widths: number[],
  originalWidth: number
) =>
  pipe(
    widths,
    filter(lte(originalWidth)),
    reduce<number, SrcSets>(
      (acc, currentWidth) =>
        pipe(
          getUrls(image.resize(currentWidth, 0)),
          map<string, string>(url => `${url} ${currentWidth}w`),
          ([base, webp]): SrcSets => [[...acc[0], base], [...acc[1], webp]]
        ),
      [[], []] as SrcSets
    ),
    map(join(", "))
  );

export const getBaseProps = async (
  image: Thumbor,
  original: Meta,
  widths: number[],
  width: number,
  height = 0
) => {
  const [src, srcWebp] = getUrls(image.resize(width, height));
  const [srcSet, srcSetWebp] = getSrcSets(image, widths, original.width);
  const base64 = await getBase64(image);
  return {
    base64,
    src,
    srcWebp,
    srcSet,
    srcSetWebp
  };
};

import * as FileType from "file-type";
import got from "got";
import { Thumbor } from "thumbor-ts/dist/types";

export interface Dimensions {
  width: number;
  height: number;
}

interface MetadataResponse {
  thumbor: {
    source: Dimensions;
  };
}

export const getDimensions = async (image: Thumbor): Promise<Dimensions> =>
  (await got(image.metaDataOnly().buildUrl()).json<MetadataResponse>()).thumbor
    .source;

export const getBase64 = async (
  image: Thumbor,
  width: number,
  aspectRatio: number
): Promise<string> => {
  const buffer = await got(
    image.resize(width, width / aspectRatio).buildUrl()
  ).buffer();
  const type = await FileType.fromBuffer(buffer);
  if (!type) {
    console.error(
      "Failed to generate the image thumbnail: couldn't fetch the file type"
    );
    return "";
  }
  return `data:${type.mime};base64,${buffer.toString("base64")}`;
};

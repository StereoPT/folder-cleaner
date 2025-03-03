import { lstatSync } from "node:fs";
import { join } from "node:path";

type isFileArgs = { filename: string; folderPath: string };

export const isFile = ({ filename, folderPath }: isFileArgs) => {
  const filePath = join(folderPath, filename);
  return lstatSync(filePath).isFile();
};

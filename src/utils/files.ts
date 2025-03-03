import { existsSync, lstatSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

type isFileArgs = {
  filename: string;
  folderPath: string;
};

export const isFile = ({ filename, folderPath }: isFileArgs) => {
  const filePath = join(folderPath, filename);
  return lstatSync(filePath).isFile();
};

type moveOrDeleteArgs = {
  folder: string;
  file: string;
  currentPath: string;
  folderPath: string;
};

export const moveOrDelete = ({ folder, file, currentPath, folderPath }: moveOrDeleteArgs) => {
  const newPath = join(folderPath, folder, file);

  if (!existsSync(newPath)) {
    renameSync(currentPath, newPath);
  } else {
    rmSync(currentPath);
  }
};

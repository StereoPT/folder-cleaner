import { Icon, List } from "@raycast/api";
import { existsSync, lstatSync, readdirSync, renameSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { basename, extname, join, parse } from "node:path";

const folders = {
  Documents: [".pdf", ".doc", ".docx", ".txt"],
  Images: [".jpeg", ".png", ".jpg", ".svg", ".psd"],
  Programs: [".exe", ".dmg", ".apk", ".jar"],
  Coding: [".js", ".md", ".py", ".json", ".ipynb"],
  Archives: [".zip", ".rar", ".7z", ".gz"],
  Sheets: [".csv", ".xls", ".xlsx"],
  Slides: [".ppt", ".pptx"],
  Music: [".mp3"],
  Video: [".mov"],
};
type FoldersType = (keyof typeof folders)[];

const PARSED_DOWNLOADS = parse("/Downloads");
const DOWNLOADS_PATH = join(homedir(), PARSED_DOWNLOADS.name);
const FOLDERS = Object.keys(folders) as FoldersType;
const DATE_REGEX = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;

const isFile = (filename: string) => {
  const filePath = join(DOWNLOADS_PATH, filename);
  return lstatSync(filePath).isFile();
};

const moveOrDelete = (folder: string, file: string, currentPath: string) => {
  const newPath = join(DOWNLOADS_PATH, folder, file);
  if (!existsSync(newPath)) {
    renameSync(currentPath, newPath);
  } else {
    rmSync(currentPath);
  }
};

// TODO: Move this to Settings somehow
// const setupFolders = async () => {
//   for (const folder of [...FOLDERS, "Cafe"]) {
//     const sortFolder = path.join(DOWNLOADS_PATH, folder);
//     if (!fs.existsSync(sortFolder)) {
//       fs.mkdirSync(sortFolder);
//     }
//   }
// };

const Command = () => {
  const downloadFiles = readdirSync(DOWNLOADS_PATH).filter(isFile);

  for (const file of downloadFiles) {
    const currentPath = join(DOWNLOADS_PATH, file);
    const extension = extname(file).toLocaleLowerCase();
    const fileName = basename(file, extension);

    const datePortion = fileName.split("_")[1];
    if (datePortion && DATE_REGEX.test(datePortion)) {
      moveOrDelete("Cafe", file, currentPath);
      continue;
    }

    for (const folder of FOLDERS) {
      const ext = folders[folder];

      if (ext.includes(extension)) {
        moveOrDelete(folder, file, currentPath);
      }
    }
  }

  return (
    <List>
      {downloadFiles.map((file) => (
        <List.Item key={file} icon={Icon.Document} title={file} />
      ))}
    </List>
  );
};

export default Command;

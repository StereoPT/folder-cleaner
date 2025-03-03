import { useCallback, useState } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List, showHUD } from "@raycast/api";

import { isFile } from "./utils/file";
import { Preferences } from "./types/preferences";

import { existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { basename, extname, join } from "node:path";

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

const FOLDERS = Object.keys(folders) as FoldersType;
const DATE_REGEX = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;

const moveOrDelete = (folder: string, file: string, currentPath: string, folderPath: string) => {
  const newPath = join(folderPath, folder, file);
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
  const { downloadFolder } = getPreferenceValues<Preferences>();
  const [downloadFiles] = useState<string[]>(() => {
    const readDownloadFolder = readdirSync(downloadFolder);
    return readDownloadFolder.filter((file) => {
      return isFile({ filename: file, folderPath: downloadFolder });
    });
  });

  const cleanAllFiles = useCallback(() => {
    for (const file of downloadFiles) {
      const currentPath = join(downloadFolder, file);
      const extension = extname(file).toLocaleLowerCase();
      const fileName = basename(file, extension);

      const datePortion = fileName.split("_")[1];
      if (datePortion && DATE_REGEX.test(datePortion)) {
        moveOrDelete("Cafe", file, currentPath, downloadFolder);
        continue;
      }

      for (const folder of FOLDERS) {
        const ext = folders[folder];

        if (ext.includes(extension)) {
          moveOrDelete(folder, file, currentPath, downloadFolder);
        }
      }
    }

    return showHUD("Folder Cleaned");
  }, [downloadFiles]);

  return (
    <List navigationTitle="Files inside Folder">
      {downloadFiles.map((file) => (
        <List.Item
          key={file}
          icon={Icon.Document}
          title={file}
          actions={
            <ActionPanel title="Cleaner Actions">
              <Action title="Clean All" onAction={cleanAllFiles} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

export default Command;

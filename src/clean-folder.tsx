import { useCallback, useState } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List, showHUD } from "@raycast/api";

import { isFile, moveOrDelete } from "./utils/files";
import { Preferences } from "./types/preferences";

import { readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { defaultFolders, SetupFoldersAction } from "./setup-folders";

const DATE_REGEX = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;

const CleanFolderCommand = () => {
  const { folderToClean } = getPreferenceValues<Preferences>();

  const [downloadFiles] = useState<string[]>(() => {
    const readDownloadFolder = readdirSync(folderToClean);
    return readDownloadFolder.filter((file) => {
      return isFile({ filename: file, folderPath: folderToClean });
    });
  });

  const cleanAllFiles = useCallback(() => {
    for (const file of downloadFiles) {
      const currentPath = join(folderToClean, file);
      const extension = extname(file).toLocaleLowerCase();
      const fileName = basename(file, extension);

      const datePortion = fileName.split("_")[1];
      if (datePortion && DATE_REGEX.test(datePortion)) {
        moveOrDelete({
          folder: "Cafe",
          file,
          currentPath,
          folderPath: folderToClean,
        });
        continue;
      }

      for (const { name, extensions } of defaultFolders) {
        if (extensions.includes(extension)) {
          moveOrDelete({
            folder: name,
            file,
            currentPath,
            folderPath: folderToClean,
          });
        }
      }
    }

    return showHUD("Folder Cleaned");
  }, [downloadFiles]);

  return (
    <List
      navigationTitle="Files inside Folder"
      actions={
        <ActionPanel>
          <SetupFoldersAction />
        </ActionPanel>
      }
    >
      {downloadFiles.map((file) => (
        <List.Item
          key={file}
          icon={Icon.Document}
          title={file}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="Cleaner Actions">
                <Action title="Clean All" onAction={cleanAllFiles} />
              </ActionPanel.Section>
              <ActionPanel.Section title="Settings">
                <SetupFoldersAction />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

export default CleanFolderCommand;

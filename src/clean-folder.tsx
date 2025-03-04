import { useCallback, useState } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List, showHUD } from "@raycast/api";

import { moveOrDelete } from "./utils/files";
import { Preferences } from "./types/preferences";

import { basename, extname, join } from "node:path";
import { SetupFoldersAction } from "./components/setup-folders";
import { useFetchFolderFiles } from "./hooks/useFetchFolderFiles";
import { Folder } from "./types/folders";
import { useFetchStoredFolders } from "./hooks/useFetchStoredFolders";

const DATE_REGEX = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;

const CleanFolderCommand = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderFiles, setFolderFiles] = useState<string[]>([]);

  const { folderToClean } = getPreferenceValues<Preferences>();

  useFetchStoredFolders({ setFolders, setIsLoading });
  useFetchFolderFiles({ setFolderFiles, setIsLoading });

  const cleanAllFiles = useCallback(() => {
    for (const file of folderFiles) {
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

      for (const { name, extensions } of folders) {
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
  }, [folderFiles]);

  return (
    <List
      isLoading={isLoading}
      navigationTitle="Files inside Folder"
      actions={
        <ActionPanel>
          <SetupFoldersAction />
        </ActionPanel>
      }
    >
      {folderFiles.map((file) => (
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

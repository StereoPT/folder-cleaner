import { useCallback, useState } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List, showHUD } from "@raycast/api";

import { moveOrDelete } from "./utils/files";
import { Preferences } from "./types/preferences";

import { extname, join } from "node:path";
import { SetupFoldersAction } from "./components/setup-folders";
import { useFetchFolderFiles } from "./hooks/useFetchFolderFiles";
import { Folder } from "./types/folders";
import { useFetchStoredFolders } from "./hooks/useFetchStoredFolders";

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
  }, [folderFiles, folders]);

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

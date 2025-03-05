import { useCallback } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List, showHUD } from "@raycast/api";

import { moveOrDelete } from "./utils/files";
import { Preferences } from "./types/preferences";

import { extname, join } from "node:path";
import { ListFoldersAction } from "./components/list-folders";
import { useFetchFolderFiles } from "./hooks/useFetchFolderFiles";
import { useFetchStoredFolders } from "./hooks/useFetchStoredFolders";

const CleanFolderCommand = () => {
  const { folderToClean } = getPreferenceValues<Preferences>();

  const { folders, isLoading: isLoadingFolders } = useFetchStoredFolders();
  const { folderFiles, isLoading: isLoadingFiles } = useFetchFolderFiles(folderToClean);

  const isLoading = isLoadingFolders && isLoadingFiles;

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
          <ListFoldersAction />
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
              {folders.length > 0 && (
                <ActionPanel.Section title="Cleaner Actions">
                  <Action title="Clean All" onAction={cleanAllFiles} />
                </ActionPanel.Section>
              )}
              <ActionPanel.Section title="Settings">
                <ListFoldersAction />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

export default CleanFolderCommand;

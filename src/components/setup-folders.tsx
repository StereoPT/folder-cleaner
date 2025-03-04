import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { Folder } from "../types/folders";
import { useFetchStoredFolders } from "../hooks/useFetchStoredFolders";
import { AddFoldersAction } from "./add-folder";
import { CreateNewFolder } from "../actions/createNewFolder";

const SetupFolders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([]);

  useFetchStoredFolders({ setFolders, setIsLoading });

  const createNewFolder = async (folder: Folder) => {
    try {
      await CreateNewFolder({ newFolder: folder, existingFolders: folders, setFolders });
    } catch (e) {
      await showToast(Toast.Style.Failure, "Folder not created", "Something went wrong!");
    }
  };

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      actions={
        <ActionPanel>
          <AddFoldersAction onCreate={createNewFolder} />
        </ActionPanel>
      }
    >
      {folders?.map((folder) => {
        return (
          <List.Item
            title={folder.name}
            key={folder.name}
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.TagList title="Extensions">
                      {folder.extensions.map((extension) => (
                        <List.Item.Detail.Metadata.TagList.Item key={extension} text={extension} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <AddFoldersAction onCreate={createNewFolder} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
};

export const SetupFoldersAction = () => {
  return <Action.Push icon={Icon.Cog} title="Setup Folders" target={<SetupFolders />} />;
};

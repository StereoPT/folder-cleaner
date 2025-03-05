import { Dispatch, SetStateAction } from "react";
import { Folder } from "../types/folders";
import { LocalStorage, showToast, Toast } from "@raycast/api";

type EditFolderProps = {
  folderName: string;
  editedFolder: Folder;
  existingFolders: Folder[];
  setFolders: Dispatch<SetStateAction<Folder[]>>;
};

export const EditFolder = async ({ folderName, editedFolder, existingFolders, setFolders }: EditFolderProps) => {
  const foundFolder = existingFolders.find((f) => f.name === folderName);
  if (!foundFolder) {
    throw new Error("Unable to find folder to edit");
  }

  const newFolderList = existingFolders.map((f) => (f.name === foundFolder.name ? editedFolder : f));
  setFolders(newFolderList);

  await LocalStorage.setItem(foundFolder.name, JSON.stringify(editedFolder));
  await showToast(Toast.Style.Success, "Folder Edited");
};

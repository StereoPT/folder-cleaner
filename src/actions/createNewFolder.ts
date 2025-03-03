import { Dispatch, SetStateAction } from "react";
import { Folder } from "../types/folders";
import { LocalStorage, showToast, Toast } from "@raycast/api";

type CreateNewFolderProps = {
  newFolder: Folder;
  existingFolders: Folder[];
  setFolders: Dispatch<SetStateAction<Folder[]>>;
};

export const CreateNewFolder = async ({ newFolder, existingFolders, setFolders }: CreateNewFolderProps) => {
  const checkFolderName = existingFolders.find((f) => f.name === newFolder.name);
  if (checkFolderName) {
    throw new Error("Folder with same name already exists");
  }

  const newFolderList = [...existingFolders, newFolder];
  setFolders(newFolderList);

  await LocalStorage.setItem(newFolder.name, JSON.stringify(newFolder));
  await showToast(Toast.Style.Success, "Folder Created", "Will be used to clean your files");
};

import { Dispatch, SetStateAction } from "react";
import { Folder } from "../types/folders";
import { LocalStorage, showToast, Toast } from "@raycast/api";

type DeleteFolderProps = {
  folderName: string;
  existingFolders: Folder[];
  setFolders: Dispatch<SetStateAction<Folder[]>>;
};

export const DeleteFolder = async ({ folderName, existingFolders, setFolders }: DeleteFolderProps) => {
  const foundFolder = existingFolders.find((f) => f.name === folderName);
  if (!foundFolder) {
    throw new Error("Unable to find folder to delete");
  }

  const newFolderList = existingFolders.filter((f) => f.name !== foundFolder.name);
  setFolders(newFolderList);

  console.log(await LocalStorage.allItems());

  await LocalStorage.removeItem(foundFolder.name);
  await showToast(Toast.Style.Success, "Folder Deleted");
};

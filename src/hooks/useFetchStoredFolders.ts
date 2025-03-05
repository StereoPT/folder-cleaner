import { captureException, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { Folder } from "../types/folders";
import { buildException } from "../utils/buildException";

export const useFetchStoredFolders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    setIsLoading(false);
    const fetchFoldersFromLocalStorage = async () => {
      const storedFoldersObject = await LocalStorage.allItems<Record<string, string>>();
      if (!Object.keys(storedFoldersObject).length) {
        return;
      }

      const storedFolders: Folder[] = [];

      for (const key in storedFoldersObject) {
        try {
          storedFolders.push(JSON.parse(storedFoldersObject[key]));
        } catch (error) {
          captureException(
            buildException(error as Error, "Error parsing stored folders from local storage", {
              folderId: key,
              localStorage: storedFoldersObject,
            }),
          );
        }
      }

      setIsLoading(false);
      setFolders(storedFolders);
    };

    void fetchFoldersFromLocalStorage();
  }, []);

  return {
    folders,
    setFolders,
    isLoading,
  };
};

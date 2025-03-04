import { captureException, getPreferenceValues } from "@raycast/api";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Preferences } from "../types/preferences";
import { readdir } from "node:fs/promises";
import { isFile } from "../utils/files";
import { buildException } from "../utils/buildException";

type useFetchFolderFilesProps = {
  setFolderFiles: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useFetchFolderFiles = ({ setFolderFiles, setIsLoading }: useFetchFolderFilesProps) => {
  const { folderToClean } = getPreferenceValues<Preferences>();

  useEffect(() => {
    setIsLoading(true);

    const fetchFolderFiles = async () => {
      try {
        const folder = await readdir(folderToClean);
        const folderFiles = folder.filter((file) => {
          return isFile({ filename: file, folderPath: folderToClean });
        });

        setFolderFiles(folderFiles);
      } catch (error) {
        captureException(
          buildException(error as Error, "Error fetching files from folder", {
            folderToClean,
          }),
        );
      }

      setIsLoading(false);
    };

    void fetchFolderFiles();
  }, []);
};

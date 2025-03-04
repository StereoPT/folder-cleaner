import { Action, Icon, List } from "@raycast/api";

export const defaultFolders = [
  { name: "Documents", extensions: [".pdf", ".doc", ".docx", ".txt"] },
  { name: "Images", extensions: [".jpeg", ".png", ".jpg", ".svg", ".psd"] },
  { name: "Programs", extensions: [".exe", ".dmg", ".apk", ".jar"] },
  { name: "Coding", extensions: [".js", ".md", ".py", ".json", ".ipynb"] },
  { name: "Archives", extensions: [".zip", ".rar", ".7z", ".gz"] },
  { name: "Sheets", extensions: [".csv", ".xls", ".xlsx"] },
  { name: "Slides", extensions: [".ppt", ".pptx"] },
  { name: "Music", extensions: [".mp3"] },
  { name: "Video", extensions: [".mov"] },
];

const SetupFolders = () => {
  return (
    <List isShowingDetail>
      {defaultFolders?.map((folder) => {
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
          />
        );
      })}
    </List>
  );
};

export default SetupFolders;

export const SetupFoldersAction = () => {
  return <Action.Push icon={Icon.Cog} title="Setup Folders" target={<SetupFolders />} />;
};

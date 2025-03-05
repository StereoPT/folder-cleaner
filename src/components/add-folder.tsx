import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { availableExtensions } from "../utils/availableExtensions";
import { Folder } from "../types/folders";

type FormValues = {
  folderName: string;
  extensions: string[];
};

type FolderFormProps =
  | {
      type: "create";
      onCreate: (folder: Folder) => void;
    }
  | {
      type: "edit";
      folder: Folder;
      onEdit: (oldFolder: Folder, newFolder: Folder) => void;
    };

const FolderForm = (props: FolderFormProps) => {
  const { pop } = useNavigation();

  const handleSubmit = (values: FormValues) => {
    const newFolder = { name: values.folderName, extensions: values.extensions };

    if (props.type === "create") {
      props.onCreate(newFolder);
    } else if (props.type === "edit") {
      props.onEdit(props.folder, newFolder);
    }

    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={props.type === "create" ? "Add Folder" : "Edit Folder"} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="folderName" title="Folder Name" value={props.type === "edit" ? props.folder.name : ""} />
      <Form.TagPicker id="extensions" title="Extensions" value={props.type === "edit" ? props.folder.extensions : []}>
        {availableExtensions.map((extension) => (
          <Form.TagPicker.Item key={extension.value} value={extension.value} title={extension.title} />
        ))}
      </Form.TagPicker>
    </Form>
  );
};

type AddFoldersActionProps = {
  onCreate: (folder: Folder) => void;
};

export const AddFoldersAction = ({ onCreate }: AddFoldersActionProps) => {
  return (
    <Action.Push icon={Icon.PlusCircle} title="Add Folder" target={<FolderForm type="create" onCreate={onCreate} />} />
  );
};

type EditFolderActionProps = {
  folder: Folder;
  onEdit: (oldFolder: Folder, newFolder: Folder) => void;
};

export const EditFolderAction = ({ folder, onEdit }: EditFolderActionProps) => {
  return (
    <Action.Push
      icon={Icon.Pencil}
      title="Edit Folder"
      target={<FolderForm type="edit" folder={folder} onEdit={onEdit} />}
    />
  );
};

import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { availableExtensions } from "../utils/availableExtensions";
import { Folder } from "../types/folders";

type FormValues = {
  folderName: string;
  extensions: string[];
};

type AddFolderProps = {
  onCreate: (folder: Folder) => void;
};

const AddFolder = ({ onCreate }: AddFolderProps) => {
  const { pop } = useNavigation();

  const handleSubmit = (values: FormValues) => {
    onCreate({ name: values.folderName, extensions: values.extensions });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Folder" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="folderName" title="Folder Name" />
      <Form.TagPicker id="extensions" title="Extensions">
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
  return <Action.Push icon={Icon.PlusCircle} title="Add Folder" target={<AddFolder onCreate={onCreate} />} />;
};

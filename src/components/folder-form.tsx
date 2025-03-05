import { Action, ActionPanel, Form } from "@raycast/api";
import { availableExtensions } from "../utils/availableExtensions";

export type FormValues = {
  folderName: string;
  extensions: string[];
};

type FolderFormProps = {
  submitText: string;
  defaultFolderName?: string;
  defaultFolderExtenstions?: string[];
  handleSubmit: (values: FormValues) => void;
};

export const FolderForm = ({
  submitText,
  handleSubmit,
  defaultFolderName = "",
  defaultFolderExtenstions = [],
}: FolderFormProps) => {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={submitText} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="folderName" title="Folder Name" defaultValue={defaultFolderName} />
      <Form.TagPicker id="extensions" title="Extensions" defaultValue={defaultFolderExtenstions}>
        {availableExtensions.map((extension) => (
          <Form.TagPicker.Item key={extension.value} value={extension.value} title={extension.title} />
        ))}
      </Form.TagPicker>
    </Form>
  );
};

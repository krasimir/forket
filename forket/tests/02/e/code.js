import { createNoteAction } from './actions/utils.js';

function EmptyNote() {
  return <Button onClick={createNoteAction} />;
}

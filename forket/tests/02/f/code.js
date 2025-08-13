import createNoteAction from "./actions/createNoteAction.js";
import deleteNote from './actions/deleteNote.js'

function EmptyNote() {
  return (
    <>
      <Button onClick={createNoteAction} />
      <Button onClick={deleteNote} />
    </>
  );
}

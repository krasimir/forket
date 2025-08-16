import { createNoteAction, deleteNote, updateNote } from './actions/utils.js';
function EmptyNote() {
    return (<>
      <Button onClick={"$FSA_createNoteAction"}/>
      <Button onClick={"$FSA_deleteNote"}/>
      <Button onClick={"$FSA_updateNote"}/>
    </>);
}

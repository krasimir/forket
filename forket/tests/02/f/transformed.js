import createNoteAction from "./actions/createNoteAction.js";
import deleteNote from './actions/deleteNote.js';
function EmptyNote() {
    return (<>
      <Button onClick={"$FSA_createNoteAction"}/>
      <Button onClick={"$FSA_deleteNote"}/>
    </>);
}

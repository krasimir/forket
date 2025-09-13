import createNoteAction from "./actions/createNoteAction.js";
import deleteNote from './actions/deleteNote.js';
function EmptyNote() {
    return (<>
      <Button onClick={"$FSA_f_3_createNoteAction"}/>
      <Button onClick={"$FSA_f_4_deleteNote"}/>
    </>);
}

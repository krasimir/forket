import { createNoteAction, deleteNote, updateNote } from './actions/utils.js';
function EmptyNote() {
    return (<>
      <Button onClick={"$FSA_f_2_createNoteAction"}/>
      <Button onClick={"$FSA_f_3_deleteNote"}/>
      <Button onClick={"$FSA_f_4_updateNote"}/>
    </>);
}

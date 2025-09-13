import db from "./db";
import { delay } from '/utils';
export async function doSomethingElse() {
    "use server";
    await delay();
    return 'done';
}
export const createNoteAction = async ()=>{
    "use server";
    await db.notes.create();
};
function EmptyNote() {
    ;
    return <Button onClick={"$FSA_f_1_createNoteAction"} doSomethingElse={"$FSA_f_2_doSomethingElse"}/>;
}

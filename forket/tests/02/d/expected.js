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
    return <Button onClick={"$FSA_1"} doSomethingElse={"$FSA_2"}/>;
}

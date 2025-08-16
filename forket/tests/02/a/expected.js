import db from "./db";
export async function createNoteAction() {
    "use server";
    await db.notes.create();
}
function EmptyNote() {
    return <Button onClick={"$FSA_createNoteAction"}/>;
}

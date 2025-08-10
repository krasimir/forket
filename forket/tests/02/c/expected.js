import db from "./db";
export const createNoteAction = async ()=>{
    "use server";
    await db.notes.create();
};
function EmptyNote() {
    return <Button onClick={"/path/to/my/file.tsx:createNoteAction"}/>;
}

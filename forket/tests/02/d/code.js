import db from "./db";
import { delay } from '/utils';

function EmptyNote() {
  const createNoteAction = async () => {
    "use server";

    await db.notes.create();
  };
  async function doSomethingElse() {
    "use server";

    await delay();
    return 'done';
  };
  return <Button onClick={createNoteAction} doSomethingElse={doSomethingElse}/>;
}

import { ref, push, update, remove } from "firebase/database";
import { db } from "../firebase";

export const createItem = (path, body) => push(ref(db, path), body);
export const updateItem = (path, id, body) => update(ref(db, `${path}/${id}`), body);
export const removeItem = (path, id) => remove(ref(db, `${path}/${id}`));

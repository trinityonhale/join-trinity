import { Role } from "@/db/constants";
import { Model } from "@/db/model";
import { db } from "@/firebase";
import { addDoc, getDoc, collection, doc, setDoc } from "firebase/firestore";

export function upsertUser(user: Model.User['data']) {
    return setDoc(doc(collection(db, 'users'), user.uid), user)
}

export async function getUserRole(uid: string): Promise<Role> {
    const document = await getDoc(doc(db, 'users', uid))
    return document.data()?.role ?? Role.user
}
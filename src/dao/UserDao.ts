import { Role } from "@/db/constants";
import { Model } from "@/db/model";
import { db } from "@/firebase";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";

export async function upsertUser(id: string, user: Model.AnyUser) {
  const hasUser = await getDoc(doc(db, "users", id)).then((doc) =>
    doc.exists()
  );

  const payload = {
    uid: user.uid,
    displayName: user.displayName,
    photoUrl: user.photoUrl,
    schemaVersion: 1,
    ...(hasUser ? {} : { role: Role.user }),
  };

  console.log("hasUser", hasUser);
  console.log("payload", payload);

  return hasUser
    ? updateDoc(doc(db, "users", id), payload)
    : setDoc(doc(db, "users", id), payload);
}

export async function getUserRole(uid: string): Promise<Role> {
  const document = await getDoc(doc(db, "users", uid));
  return document.data()?.role ?? Role.user;
}

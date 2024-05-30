import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  addDoc,
  getDocs,
  QueryDocumentSnapshot,
  Query,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import * as Model from "@/db/model";

export async function getNextPageOfQuests(
  lastDocument: QueryDocumentSnapshot | null,
  pageSize: number
): Promise<QueryDocumentSnapshot[]> {
  let baseQuery: Query = collection(db, "quests");

  // If lastDocument is provided, start after it
  if (lastDocument) {
    baseQuery = query(
      baseQuery,
      orderBy("urgency"),
      orderBy("createdAt"),
      startAfter(lastDocument)
    );
  } else {
    baseQuery = query(baseQuery, orderBy("urgency"), orderBy("createdAt"));
  }

  const nextPageQuery = query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(nextPageQuery);

  return snapshot.docs;
}

export async function createQuest(quest: Model.QuestV1): Promise<DocumentReference> {
  return addDoc(collection(db, "quests"), quest);
}

export async function getQuest(id: string): Promise<DocumentSnapshot> {
  return getDoc(doc(db, "quests", id));
}

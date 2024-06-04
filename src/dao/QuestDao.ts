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
  updateDoc,
  deleteDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import * as Model from "@/db/model";
import { QuestStatus } from "@/db/constants";

export async function getNextPageOfQuests(
  lastDocument: QueryDocumentSnapshot | null,
  pageSize: number,
  status: QuestStatus = QuestStatus.open
): Promise<QueryDocumentSnapshot[]> {
  let baseQuery: Query = collection(db, "quests");

  // If lastDocument is provided, start after it
  if (lastDocument) {
    baseQuery = query(
      baseQuery,
      where("status", "==", status),
      orderBy("urgency", "desc"),
      orderBy("createdAt", "desc"),
      startAfter(lastDocument)
    );
  } else {
    baseQuery = query(baseQuery, 
      where("status", "==", status),
      orderBy("urgency", "desc"),
      orderBy("createdAt", "desc")
    );
  }

  const nextPageQuery = query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(nextPageQuery);

  return snapshot.docs;
}

export async function createQuest(quest: Model.QuestV1): Promise<DocumentReference> {
  return addDoc(collection(db, "quests"), {
    ...quest,
    status: QuestStatus.open,
  });
}

export async function changeQuestStatus(id: string, status: QuestStatus = QuestStatus.open): Promise<void> {
  return updateDoc(doc(db, "quests", id), {
    status: status,
  });
}

export async function getQuest(id: string): Promise<DocumentSnapshot> {
  return getDoc(doc(db, "quests", id));
}

export async function getQuestAssignments(id: string): Promise<Model.RetrievedQuestAssignment | null> {
  const snapshot = await getDocs(collection(db, "quests", id, "assignments"));
  if (snapshot.empty) {
    return null;
  }

  const assignment = snapshot.docs[0].data()

  const userSnapshot = (await getDoc(assignment.assignee)).data() as Model.AnyUser;

  return {
    assignee: userSnapshot,
    assignedAt: assignment.assignedAt
  }
}

export async function deleteQuest(id: string): Promise<void> {
  return deleteDoc(doc(db, "quests", id));
}

export async function takeQuest(id: string, uid: string) {
  const userRef = doc(db, "users", uid);

  const payload: Model.QuestAssignment = {
    assignedAt: new Timestamp(new Date().getTime() / 1000, 0),
    assignee: userRef
  }

  return addDoc(collection(db, "quests", id, "assignments"), payload).then(() => {
    return updateDoc(doc(db, "quests", id), {
      status: QuestStatus.adopted
    })
  })
}

export async function withdrawQuest(id: string) {
  return getDocs(collection(db, "quests", id, "assignments")).then((snapshot) => {
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    })

    return updateDoc(doc(db, "quests", id), {
      status: QuestStatus.open
    })
  })
}
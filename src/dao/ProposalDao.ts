import { AnyProposal, AnyUser } from "@/db/model";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ProposalStatus } from "@/db/constants";

export function createProposal(
  proposal: AnyProposal
): Promise<DocumentReference> {
  return addDoc(collection(db, "proposals"), {
    ...proposal,
    status: ProposalStatus.pending,
  });
}

export async function getNextPageOfProposals(
  lastDocument: QueryDocumentSnapshot | null,
  pageSize: number,
  status: ProposalStatus
): Promise<QueryDocumentSnapshot[]> {
  let baseQuery: Query = collection(db, "proposals");

  // If lastDocument is provided, start after it
  if (lastDocument) {
    baseQuery = query(
      baseQuery,
      where("status", "==", status),
      startAfter(lastDocument)
    );
  } else {
    baseQuery = query(baseQuery, where("status", "==", status));
  }

  const nextPageQuery = query(baseQuery, limit(pageSize));

  const snapshot = await getDocs(nextPageQuery);

  return snapshot.docs;
}

export async function getProposal(
    id: string
): Promise<DocumentSnapshot> {
    return getDoc(doc(db, "proposals", id))
}

export async function signProposal(id: string, user: any): Promise<void> {
    // signatures is a sub collection of proposal
    const proposalRef = doc(db, "proposals", id);
    await addDoc(collection(proposalRef, 'signatures'), {
      uid: user.uid,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      createdAt: Timestamp.now()
    })
}
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Role, QuestUrgency, QuestStatus } from './constants';

interface BaseModel {
    schemaVersion?: number,
}

export type AnyUser = UserV1
export type AnyQuest = QuestV1

export interface UserV1 extends BaseModel {
    readonly schemaVersion: 1;
    uid: string;
    displayName: string;
    photoUrl: string;
    role: Role;
}

export type QuestV1 = BaseModel & {
    readonly schemaVersion: 1,
    title: string,
    details?: string,
    urgency: QuestUrgency,
    excerpt?: string,
    assignedTo?: AnyUser,
    createdAt: Timestamp,
    status: QuestStatus,
    assignnment?: QuestAssignment,
}

export type QuestAssignment = {
    assignee: DocumentReference,
    assignedAt: Timestamp,
}

export type RetrievedQuestAssignment = {
    assignee: AnyUser,
    assignedAt: Timestamp,
}

export type UserQuest = {
    uid: string,
    questId: string,
}
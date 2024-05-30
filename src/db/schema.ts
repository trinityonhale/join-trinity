import { Timestamp } from 'firebase/firestore';
import { Role, QuestUrgency } from './constants';

export const SCHEMA_VERSION = 1;


interface BaseDocument {
    id: string,
    schemaVersion: number
}

export type User = BaseDocument & {
    uid: string,
    displayName: string,
    photoUrl: string,
    role: Role,
}

export type Quest = BaseDocument & {
    title: string,
    details: string,
    urgency: QuestUrgency,
    assignedTo: string, // 1:1 relationship with User.id
    createdAt: Timestamp,
}
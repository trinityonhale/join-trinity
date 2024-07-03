import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Role, QuestUrgency, QuestStatus, ProposalStatus } from './constants';

interface BaseModel {
    schemaVersion?: number,
}

export type AnyUser = UserV1
export type AnyQuest = QuestV1
export type AnyProposal = ProposalV1

export interface UserV1 extends BaseModel {
    readonly schemaVersion: 1;
    uid: string;
    displayName: string;
    photoUrl: string;
    role?: Role;
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

export type ProposalV1 = BaseModel & {
    readonly schemaVersion: 1,
    title: string,
    content: string,
    status: ProposalStatus.pending,
    attachments?: ProposalAttachment[],
    signatures?: ProposalSignature[],
    comments?: ProposalComment[],
    createdAt: Timestamp,
    signaturesCount?: Number,
    commentsCount?: Number,
    uid: string,

    // propagated
    author?: AnyUser,
}

export type ProposalComment = Comments & {
    yay: boolean
}

export type Comments = BaseModel & {
    readonly schemaVersion: 1,
    author: AnyUser,
    content: string,
    createdAt: Timestamp,
}

export type ProposalAttachment = BaseModel & {
    readonly schemaVersion: 1,
    url: string,
    name: string
}

export type ProposalSignature = BaseModel & {
    user: AnyUser,
    createdAt: Timestamp
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
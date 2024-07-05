export enum Role {
    admin = 'admin',
    user = 'user'
}

export enum QuestUrgency {
    low = 1,
    medium = 2,
    high = 3
}

export enum QuestStatus {
    open = 'open',
    adopted = 'adopted',
    closed = 'closed'
}

export enum ProposalStatus {
    pending = 'pending',
    considering = 'considering', // enough signatures collected
    accepted = 'accepted', // proposal has been accepted
    rejected = 'rejected', // proposal has been rejected
    dropped = 'dropped' // proposal dropped
}

export const PROPOSAL_SIGNATURES_THRESHOLD = 1
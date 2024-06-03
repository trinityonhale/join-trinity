import { SCHEMA_VERSION } from './schema'
import * as Schema from './schema'
import { Role, QuestUrgency, QuestStatus } from './constants'
import { Timestamp } from 'firebase/firestore'

const adminUser: Schema.User = {
    id: 'abcd-efgh-ijkl-mnop',
    schemaVersion: SCHEMA_VERSION,
    uid: 'abcd-efgh-ijkl-mnop',
    displayName: 'Example User',
    photoUrl: 'https://example.com/avatar.jpg',
    role: Role.admin
}

const user: Schema.User = {
    id: 'abcd-efgh-ijkl-mnop',
    schemaVersion: SCHEMA_VERSION,
    uid: 'abcd-efgh-ijkl-mnop',
    displayName: 'Example User',
    photoUrl: 'https://example.com/avatar.jpg',
    role: Role.user
}

const quest: Schema.Quest = {
    id: 'abcd-efgh-ijkl-mnop',
    schemaVersion: SCHEMA_VERSION,
    title: 'Example Quest',
    details: 'This is an example quest',
    urgency: QuestUrgency.high,
    status: QuestStatus.open,
    assignedTo: user.id,
    createdAt: Timestamp.now()
}

// TODO: Insert adminUser, user, and quest into the database
console.log(adminUser, user, quest)
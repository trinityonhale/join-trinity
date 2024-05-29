import { Role, QuestUrgency, Schema, SCHEMA_VERSION } from './schema'

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
    assignedTo: user.id
}

// TODO: Insert adminUser, user, and quest into the database
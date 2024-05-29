import { Role, QuestUrgency } from './constants';

export namespace Model {

    interface BaseModel {
        id?: string,
        schemaVersion?: number,
        data: any
    }

    export type User = BaseModel & {
        schemaVersion: 1,
        data: {
            uid: string,
            displayName: string,
            photoUrl: string,
            role: Role,
        }
    }

    export type Quest = BaseModel & {
        data: {
            title: string,
            details: string,
            urgency: QuestUrgency,
            assignedTo: User
        }
    }
}

import { Role, QuestUrgency } from './constants';

export namespace Model {

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

    export function make<T>(data: any): T {
        return Object.assign(new UserV1(), data)
    }

    export type QuestV1 = BaseModel & {
        schemaVersion: 1,
        title: string,
        details: string,
        urgency: QuestUrgency,
        assignedTo: AnyUser
    }
}

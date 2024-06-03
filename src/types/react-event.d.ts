declare module '@nucleoidai/react-event' {
    export function publish(event: string, payload: any): void;
    export function subscribe(event: string, callback: (payload: any) => void): void;
}
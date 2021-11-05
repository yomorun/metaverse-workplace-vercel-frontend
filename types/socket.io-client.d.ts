declare module 'socket.io-client' {
    declare function io(url: string | undefined, option: any): Socket
    export default io

    export interface Socket {
        on(event: string, callback: (data: any) => void)
        emit(event: string, data: any)
        connect()
        disconnect(msg: string): void
    }
}

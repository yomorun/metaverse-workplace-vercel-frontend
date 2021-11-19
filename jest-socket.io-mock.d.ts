declare module 'socket.io-mock' {
    declare class SocketMock {
        public socketClient: Socket

        on(event: string, callback: (data: any) => void)
        emit(event: string, data: any)
        connect()
        disconnect(msg: string): void
    }

    export default SocketMock

    interface Socket {
        on(event: string, callback: (data: any) => void)
        emit(event: string, data: any)
        connect()
        disconnect(msg: string): void
    }
}

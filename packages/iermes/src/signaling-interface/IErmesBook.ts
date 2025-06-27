interface IErmesBookPrivate<SignalMessage, SocketType> {
    retriveAllAccount(): Promise<string[]>
}

export interface IErmesBookService<SignalMessage, SocketType>  extends IErmesBookPrivate<SignalMessage, SocketType>{

} 

export interface IErmesBookRepository<SignalMessage, SocketType>  extends IErmesBookPrivate<SignalMessage, SocketType>{
    
} 
/**
 * interface used to create Ids for the messages
 */
export interface IIdHandler<IdType> {
    /**
     * function that return a unique id every time that it is called, the id should be progressive
     */
    getNewId(): IdType;
    /**
     * reset the counter of the messages
     */
    reset(): IdType;
    /**
     * set the counter from the generation need to began
     * @param counter the starting point of the counter
     */
    setCounter(counter: IdType): void;
}

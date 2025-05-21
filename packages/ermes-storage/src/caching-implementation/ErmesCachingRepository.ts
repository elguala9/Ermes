import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository } from "iermes/index";

/**
 * In‐memory repository con capacità massima (FIFO eviction).
 */
export class ErmesCachingRepository<
  D extends MessageType
> implements IErmesCachingRepository<D> {
  private _buffer = new Map<IdType, D>();

  constructor(private maxBuffer: number) {}

  async destroy(): Promise<void> {
    await this.clear();
  }

  async clear(): Promise<void> {
    return this._buffer.clear();
  }

  numberOfElements(): number {
    return this._buffer.size;
  }

  async listOfIds(): Promise<IdType[]> {
    return Array.from(this._buffer.keys());
  }

  async store(data: D): Promise<void> {
    // Se esiste già, lo "riportiamo in testa"
    if (this._buffer.has(data.id)) {
      this._buffer.delete(data.id);
    }

    this._buffer.set(data.id, data);

    // Se superiamo la capacità, rimuoviamo il più vecchio (prima chiave inserita)
    if (this.numberOfElements() > this.maxBuffer) {
      const oldestKey = this._buffer.keys().next().value;
      if(oldestKey)
        this._buffer.delete(oldestKey);
    }
  }

  async retrieve(id: IdType): Promise<D | undefined> {
    return this._buffer.get(id);
  }

  async delete(id: IdType): Promise<void> {
    this._buffer.delete(id);
  }
}

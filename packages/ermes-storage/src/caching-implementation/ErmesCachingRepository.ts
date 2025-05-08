import { IdType, MessageType } from "ermes-types";
import { IErmesCachingRepository } from "iermes/index";

/**
 * In‐memory repository con capacità massima (FIFO eviction).
 */
export class ErmesCachingRepository<
  D extends MessageType
> implements IErmesCachingRepository<D> {
  private buffer = new Map<IdType, D>();

  constructor(private maxBuffer: number) {}

  async clear(): Promise<void> {
    this.buffer.clear();
  }

  numberOfElements(): number {
    return this.buffer.size;
  }

  async listOfIds(): Promise<IdType[]> {
    return Array.from(this.buffer.keys());
  }

  async store(data: D): Promise<void> {
    // Se esiste già, lo "riportiamo in testa"
    if (this.buffer.has(data.id)) {
      this.buffer.delete(data.id);
    }

    this.buffer.set(data.id, data);

    // Se superiamo la capacità, rimuoviamo il più vecchio (prima chiave inserita)
    if (this.numberOfElements() > this.maxBuffer) {
      const oldestKey = this.buffer.keys().next().value;
      if(oldestKey)
        this.buffer.delete(oldestKey);
    }
  }

  async retrieve(id: IdType): Promise<D | undefined> {
    return this.buffer.get(id);
  }

  async delete(id: IdType): Promise<void> {
    this.buffer.delete(id);
  }
}

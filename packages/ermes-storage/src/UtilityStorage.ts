/**
 * Avvolge un oggetto T in un PutDocument<T>, aggiungendo _id,
 * e opzionalmente _rev e _attachments se forniti.
 */
export function toPutDocument<T extends object>(
    data: T,
    rev?: string,
    attachments?: PouchDB.Core.Attachments
  ): PouchDB.Core.PutDocument<T> {
    // Costruisco il documento includendo solo i campi presenti
    const doc: Partial<PouchDB.Core.PutDocument<T>> = {
      // aggiungo _rev se passato
      ...(rev ? { _rev: rev } : {}),
      // aggiungo _attachments se passato
      ...(attachments ? { _attachments: attachments } : {}),
      // infine i campi del tuo oggetto
      ...data,
    };
  
    // Cast finale a PutDocument<T>, perché sappiamo che ha almeno T & BasicDocument
    return doc as PouchDB.Core.PutDocument<T>;
  }
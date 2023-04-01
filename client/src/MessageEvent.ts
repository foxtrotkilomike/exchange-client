class MessageEvent<T> extends Event {
  data: T;

  constructor(type: string, data: T) {
    super(type);
    this.data = data;
  }
}

export default MessageEvent;

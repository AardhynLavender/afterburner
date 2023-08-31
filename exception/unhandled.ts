export default class UnhandledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnhandledException";
  }
}

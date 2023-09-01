export default function repeat(i: number, callback: (i: number) => void) {
  Array.from(Array(i).keys()).map(callback);
}

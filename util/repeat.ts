export default function repeat(i: number, callback: (i: number) => any) {
  return Array.from(Array(i).keys()).map(callback);
}

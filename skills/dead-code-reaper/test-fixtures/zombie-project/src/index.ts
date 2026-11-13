import { ActiveButton } from './components/ActiveButton';
import { add } from './utils/math';

export function main() {
  const sum = add(5, 10);
  console.log(`Sum is ${sum}`);
  return ActiveButton();
}

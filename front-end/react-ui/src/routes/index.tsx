import { createFileRoute } from '@tanstack/react-router';
import TodosGrid from '../components/TodosGrid';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <TodosGrid />
    </div>
  );
}

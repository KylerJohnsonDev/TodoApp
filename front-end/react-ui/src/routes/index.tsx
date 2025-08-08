import { createFileRoute } from '@tanstack/react-router';
import TodosGrid from '../components/TodosGrid';
import { useGetApiTodos } from '../__generated__/todos/todos';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {

 const query = useGetApiTodos();
 console.log('query', query);

  return (
    <div className="p-2">
      <TodosGrid />
    </div>
  );
}

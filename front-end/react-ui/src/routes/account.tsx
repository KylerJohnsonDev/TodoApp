import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account')({
  component: Account,
});

function Account() {
  return (
    <div className="p-2">
      <h3>User Account!</h3>
    </div>
  );
}

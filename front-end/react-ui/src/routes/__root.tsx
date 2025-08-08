import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '../components/Header';
import { AuthResponseDto } from '../__generated__/model';
import { GetApiAuthProfileQueryResult } from '../__generated__/auth/auth';

interface RouterContext {
  auth: GetApiAuthProfileQueryResult | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

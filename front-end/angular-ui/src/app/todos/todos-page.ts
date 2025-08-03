import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'todos-page',
  template:`
    <h1>Todos</h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full h-full',
  },
})
export default class TodosPage {}

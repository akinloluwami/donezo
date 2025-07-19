import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__authenticated/app/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__authenticated/app/tasks"!</div>
}

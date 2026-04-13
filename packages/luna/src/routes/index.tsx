import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  // 首页先保留最小展示，后续可在此扩展业务内容。
  return <div>luna app</div>;
}

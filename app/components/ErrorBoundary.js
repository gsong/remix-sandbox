export function ErrorBoundary({ error }) {
  return (
    <div className="text-red-500">
      Something went wrong! 😢
      <pre>{error.message}</pre>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <h1 className="font-heading text-display-md text-primary-700">404</h1>
      <p className="font-body text-body-lg text-neutral-text-secondary">Page not found.</p>
      <a href="/" className="font-body text-primary-500 underline hover:text-primary-700">
        Go home
      </a>
    </div>
  );
}

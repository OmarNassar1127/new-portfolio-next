import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl md:text-[150px] font-bold text-primary/20 font-mono leading-none">
        404
      </p>
      <h1 className="text-2xl md:text-4xl font-bold mt-4 mb-4">
        Page Not Found
      </h1>
      <p className="text-muted max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
      >
        <i className="ri-arrow-left-line" />
        Back to Home
      </Link>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center p-12 text-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="text-neutral-500 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the first doc page
  redirect('/docs');
}

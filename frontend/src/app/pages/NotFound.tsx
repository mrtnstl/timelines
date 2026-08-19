import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="">
      <div className="font-faculty text-2xl">Page Not Found!</div>
      <Link to={'/'}>back to Home</Link>
    </section>
  );
}

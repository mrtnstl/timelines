import { Link } from 'react-router';

export default function NotFound() {
  return (
    <>
      <div>Page Not Found!</div>
      <Link to={'/'}>back to Home</Link>
    </>
  );
}

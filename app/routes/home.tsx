import Navbar from 'components/Navbar';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    { name: "description", content: "AI Powered application designed to convert architectal designs into 3D images." },
  ];
}

export default function Home() {
  return (
    <div className='home'>
      <Navbar />
    </div>
  )
}

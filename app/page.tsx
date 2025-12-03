import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to main AthenaPeX dashboard
  redirect('/pex-os/prompts');
}

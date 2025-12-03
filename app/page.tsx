import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to main PEX-OS dashboard
  redirect('/pex-os/prompts');
}

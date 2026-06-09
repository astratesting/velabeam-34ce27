import Sidebar from '@/components/ui/Sidebar';
import Topbar from '@/components/ui/Topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <div className="ml-[240px]">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

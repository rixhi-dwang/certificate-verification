import VerifyCard from './components/VerifyCard';

export default function App() {
  return (
    <div className="min-h-screen bg-app-gradient text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <VerifyCard />
        </div>
      </main>
    </div>
  );
}

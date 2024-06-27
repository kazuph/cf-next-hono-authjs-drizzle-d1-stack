import Header from '@/components/Header';
import Todo from '@/components/Todo';
import Footer from '@/components/Footer';


export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container flex-grow px-4 py-8 mx-auto">
        <Todo />
      </main>
      <Footer />
    </div >
  );
}

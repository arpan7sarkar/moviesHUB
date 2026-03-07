import PageTransition from '../components/layout/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-primary pt-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display text-text-primary uppercase tracking-wider">Home Page</h1>
      </div>
    </PageTransition>
  );
};


export default Home;

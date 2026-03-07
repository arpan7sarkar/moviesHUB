function App() {
  return (
    <main className="min-h-screen bg-primary">
      <div className="container-custom py-20 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-accent text-glow tracking-tighter">
          CineVault
        </h1>
        <p className="mt-4 text-xl text-text-secondary font-body">
          The Ultimate Cinematic Experience
        </p>
        <div className="mt-12 group glass-panel p-8 max-w-md text-center hover:border-accent/30 transition-all duration-300">
          <p className="text-text-primary text-lg">
            Tailwind v4 is <span className="text-success font-semibold italic">Live</span>.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button className="btn-primary">Explore Movies</button>
            <button className="px-6 py-2.5 border border-border text-text-primary rounded-md hover:bg-surface transition-all">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App


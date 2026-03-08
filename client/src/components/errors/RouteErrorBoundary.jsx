import React from 'react';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route boundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState((prev) => ({ hasError: false, retryCount: prev.retryCount + 1 }));
    }
  }

  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, retryCount: prev.retryCount + 1 }));
  };

  render() {
    const { hasError, retryCount } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-[55vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-secondary/70 p-8 text-center shadow-elevated backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-danger/35 bg-danger/10 text-danger">
              <FiAlertTriangle size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary">Something went wrong</h2>
            <p className="mt-2 text-sm text-text-muted">
              We hit an unexpected error while loading this page.
            </p>
            <button
              onClick={this.handleRetry}
              className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <FiRefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return <React.Fragment key={retryCount}>{children}</React.Fragment>;
  }
}

export default RouteErrorBoundary;

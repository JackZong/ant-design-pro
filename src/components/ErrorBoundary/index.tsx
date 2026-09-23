import { Button, Card, Result } from 'antd';
import React from 'react';

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    /(?:loading|failed to load) (?:css )?chunk/i.test(error.message) ||
    /Failed to fetch dynamically imported module/i.test(error.message)
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
  retryCount: number;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
    if (
      this.state.hasError &&
      this.state.error &&
      isChunkLoadError(this.state.error)
    ) {
      window.location.reload();
    }
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError || !this.state.error) {
      return (
        <React.Fragment key={this.state.retryCount}>
          {this.props.children}
        </React.Fragment>
      );
    }

    const isOffline = !this.state.isOnline;
    const isChunkError = isChunkLoadError(this.state.error);

    return (
      <Card variant="borderless" style={{ margin: 24 }}>
        <Result
          status="error"
          title={isChunkError ? 'Failed to load page' : 'Something went wrong'}
          subTitle={
            isChunkError && isOffline
              ? 'Your network connection has been lost. Please check your connection and reload.'
              : isChunkError
                ? 'Page resources failed to load. Please reload and try again.'
                : 'Sorry, an error occurred on this page. Please reload or go back to the home page.'
          }
          extra={[
            isChunkError && (
              <Button type="primary" key="retry" onClick={this.handleRetry}>
                Retry
              </Button>
            ),
            <Button
              type={isChunkError ? 'default' : 'primary'}
              key="reload"
              onClick={this.handleReload}
            >
              Reload Page
            </Button>,
            <Button href="/welcome" key="home">
              Back Home
            </Button>,
          ].filter(Boolean)}
        />
      </Card>
    );
  }
}

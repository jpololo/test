import React from 'react';
import ErrorPage from '../components/ErrorPage';

const ErrorPageView: React.FC = () => {
  const handleRetry = () => {
    console.log('Retrying...');
    // Simulate retry logic
    setTimeout(() => {
      alert('Retry attempted! In a real app, this would reload the failed operation.');
    }, 1000);
  };

  const handleGoHome = () => {
    console.log('Going home...');
    window.location.href = '/';
  };

  const handleGoBack = () => {
    console.log('Going back...');
    window.history.back();
  };

  return (
    <div className="space-y-8">
      {/* Default Error Page */}
      <ErrorPage
        title="Something went wrong"
        message="We're sorry, but something unexpected happened. Please try again or contact support if the problem persists."
        errorCode="500"
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        type="generic"
      />
    </div>
  );
};

export default ErrorPageView;
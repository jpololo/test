import React from 'react';
import { RefreshCw, Home, ArrowLeft, AlertTriangle, Database, Wifi } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  type?: 'network' | 'server' | 'notfound' | 'generic';
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again.",
  errorCode,
  onRetry,
  onGoHome,
  onGoBack,
  type = 'generic'
}) => {
  const getIllustration = () => {
    switch (type) {
      case 'network':
        return (
          <div className="relative">
            <div className="w-64 h-64 mx-auto mb-8 relative">
              {/* Browser Window */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-lg">
                {/* Browser Header */}
                <div className="h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-2xl flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-8 flex flex-col items-center justify-center h-52">
                  {/* Sad Face */}
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center mb-4">
                    <div className="text-orange-500 text-3xl">
                      <div className="flex space-x-2 mb-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <div className="w-8 h-4 border-2 border-orange-500 border-t-0 rounded-b-full"></div>
                    </div>
                  </div>
                  
                  {/* Warning Triangle */}
                  <div className="absolute top-16 right-8">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Database Stack */}
                  <div className="absolute bottom-4 right-8">
                    <div className="space-y-1">
                      <div className="w-6 h-3 bg-orange-400 rounded-sm"></div>
                      <div className="w-6 h-3 bg-orange-500 rounded-sm"></div>
                      <div className="w-6 h-3 bg-orange-600 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Cable */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-4 bg-orange-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'server':
        return (
          <div className="w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            <div className="relative">
              <Database className="w-32 h-32 text-orange-300" />
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notfound':
        return (
          <div className="w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            <div className="text-9xl font-bold text-orange-200">404</div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <div className="w-64 h-64 mx-auto mb-8 relative">
              {/* Browser Window */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-lg">
                {/* Browser Header */}
                <div className="h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-2xl flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                    <div className="w-3 h-3 bg-orange-200 rounded-full opacity-80"></div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-8 flex flex-col items-center justify-center h-52">
                  {/* Sad Face */}
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center mb-4">
                    <div className="text-orange-500 text-3xl">
                      <div className="flex space-x-2 mb-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <div className="w-8 h-4 border-2 border-orange-500 border-t-0 rounded-b-full"></div>
                    </div>
                  </div>
                  
                  {/* Warning Triangle */}
                  <div className="absolute top-16 right-8">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Database Stack */}
                  <div className="absolute bottom-4 right-8">
                    <div className="space-y-1">
                      <div className="w-6 h-3 bg-orange-400 rounded-sm"></div>
                      <div className="w-6 h-3 bg-orange-500 rounded-sm"></div>
                      <div className="w-6 h-3 bg-orange-600 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Cable */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-4 bg-orange-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        {getIllustration()}
        
        {/* Error Code */}
        {errorCode && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Error {errorCode}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Wifi className="w-4 h-4" />
              <span>Check your internet connection</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh the page</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Contact support if issue persists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
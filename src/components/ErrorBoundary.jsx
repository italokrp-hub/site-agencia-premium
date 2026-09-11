import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('CRITICAL RUNTIME ERROR CAUGHT BY ERROR BOUNDARY:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado ao carregar este conteúdo.</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ocorreu um erro temporário no navegador. Clique abaixo para recarregar a página ou refazer sua ação.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="text-xs text-left bg-gray-900 text-red-300 p-3 rounded-lg overflow-x-auto mb-6 max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-[#2C7A7B] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#235f60] transition-colors shadow-md"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

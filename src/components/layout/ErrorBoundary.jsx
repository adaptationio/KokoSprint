import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6 text-center gap-4">
          <p className="text-4xl">😵</p>
          <p className="text-xl font-black text-text-primary uppercase tracking-widest">
            Something went wrong
          </p>
          <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
            Try refreshing the page. Your data is safe in the cloud.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-neon text-bg font-bold uppercase tracking-wider rounded-lg py-3 px-8 active:scale-95 transition-all"
          >
            Refresh
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

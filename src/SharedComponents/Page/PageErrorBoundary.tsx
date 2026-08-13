import { Component, ErrorInfo, ReactNode } from 'react';

import './page-error-boundary.css';

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
};

export class PageErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    override render() {
        if (this.state.hasError) {
            return (
                <div className="page-error-boundary">
                    <h1>Something Went Wrong</h1>
                    <div className="page-error-boundary__content">
                        <div>An unknown error occurred</div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

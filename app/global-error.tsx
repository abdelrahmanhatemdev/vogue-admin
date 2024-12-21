'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h1>Global Error</h1>
                <p>{error.message || 'An unexpected error occurred.'}</p>
                <button onClick={() => reset()}>Retry</button>
            </body>
        </html>
    );
}
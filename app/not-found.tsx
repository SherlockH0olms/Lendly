export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you are looking for does not exist.
                </p>
                <a href="/" className="inline-block mt-4 text-primary hover:underline">
                    Go back home
                </a>
            </div>
        </div>
    );
}

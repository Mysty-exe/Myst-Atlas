import '../styles/Loading.css';

function LoadingScreen() {
    return (
        <div className="loading-screen">

            <div className="loading-content">

                <h1 className="loading-title">
                    MYST ATLAS
                </h1>

                <p className="loading-subtitle">
                    ORBITAL VISUALIZATION SYSTEM
                </p>

                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

        </div>
    );
}

export default LoadingScreen
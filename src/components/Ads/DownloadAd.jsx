import { useEffect, useRef } from "react";

export default function DownloadAd() {
    const adRef = useRef(null);

    useEffect(() => {
        if (!adRef.current) return; // make sure the ref exists

        // Create and append script
        const script = document.createElement("script");
        script.src = "https://downloadsecures.us/?h=c0c7c76d30bd3dcaefc96f40275bdc0a&user=117";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.type = "text/javascript";
        adRef.current.appendChild(script);

        // Cleanup safely
        return () => {
            if (adRef.current) {
                adRef.current.innerHTML = ""; // only clear if still mounted
            }
        };
    }, []);

    return (
        <div ref={adRef} style={{ textAlign: "center" }}>
            <a href="javascript:void(0)" rel="nofollow" className="buttonPress-117">
                <button

                >
                    DOWNLOAD SETUP
                </button>
            </a>
        </div>
    );
}

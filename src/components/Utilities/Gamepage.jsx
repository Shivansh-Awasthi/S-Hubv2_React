import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const GamePage = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const itemsPerPage = 9999999; // Consider lowering this for production

    const handleData = async () => {
        try {
            // Use proper env var for API URL and token
            const apiBase = process.env.VITE_API_URL || process.env.VITE;
            const token = process.env.VITE_API_TOKEN;

            const response = await axios.get(
                `${apiBase}/api/apps/all?page=1&limit=${itemsPerPage}`,
                {
                    headers: {
                        'X-Auth-Token': token
                    }
                }
            );

            // Defensive: prefer apps, then data, otherwise fallback to []
            const apps = response?.data?.apps ?? response?.data?.data ?? [];
            setData(Array.isArray(apps) ? apps : []);
            setError(null);
        } catch (err) {
            console.error('Failed to load games', err);
            setData([]);
            setError(err?.message || 'Failed to load data');
        }
    };

    const sanitizeTitle = (title) => {
        return title.replace(/\s+/g, '-').toLowerCase();
    };

    useEffect(() => {
        handleData();
    }, []);

    return (
        <div style={{ visibility: 'hidden' }}>
            {/* Guard mapping: only map when data is an array */}
            {Array.isArray(data) ? data.map((ele) => (
                <div key={ele._id}>
                    <Helmet>
                        <title>{ele.title} for {ele.platform} | Toxic Games</title>
                        <meta name="description" content={ele.description} />
                        <meta
                            name="keywords"
                            content={`${ele.title}, ${ele.title} for ${ele.platform}, Mac Games, Free Games, PC Games, Download Games, Android Games, Playstation iso`}
                        />
                        <meta name="robots" content="index, follow" />
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Game",
                                "name": ele.title,
                                "platform": ele.platform,
                                "url": `https://toxicgame.net/download/${sanitizeTitle(ele.platform)}/${sanitizeTitle(ele.title)}/${ele._id}`,
                                "description": ele.description,
                                "image": ele.coverImg,
                                "downloadUrl": `https://toxicgame.net/download/${sanitizeTitle(ele.platform)}/${sanitizeTitle(ele.title)}/${ele._id}`,
                                "datePublished": ele.createdAt,
                                "size": ele.size,
                                "price": ele.isPaid ? `₹${ele.price}` : "Free",
                            })}
                        </script>
                    </Helmet>
                    <h1>{ele.title} for {ele.platform}</h1>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: (ele.description || '').replace(/\\n/g, '<br />')
                        }}
                    />
                    <br /><br />
                    <noscript>
                        <a href={`https://toxicgame.net/download/${sanitizeTitle(ele.platform)}/${sanitizeTitle(ele.title)}/${ele._id}`} className="download-link">
                            Download {ele.title} for {ele.platform}
                        </a>
                    </noscript>
                    <div className="download-links">
                        <a href={`https://toxicgame.net/download/${sanitizeTitle(ele.platform)}/${sanitizeTitle(ele.title)}/${ele._id}`} target="_blank" rel="noopener noreferrer">
                            Download {ele.title} for {ele.platform}
                        </a>
                    </div>
                </div>
            )) : (
                // show nothing (or a lightweight error) while hidden
                error ? <div style={{ display: 'none' }}>Error: {error}</div> : null
            )}
        </div>
    );
};

export default GamePage;
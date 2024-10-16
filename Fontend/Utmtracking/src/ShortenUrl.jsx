import React, { useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios'; // For making the API request to fetch city

const ShortenUrl = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [error, setError] = useState('');
    const [locationData, setLocationData] = useState({});
    const [fingerprint, setFingerprint] = useState(''); // Added state for fingerprint

    // Function to get city by IP
    const getCityByIp = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json/'); // Example of fetching city info from ipapi
            const { city, latitude, longitude } = response.data;
            return { city, latitude, longitude };
        } catch (error) {
            console.error("Error fetching city data", error);
            return { city: null, latitude: null, longitude: null };
        }
    };

    // Function to get the fingerprint and shorten the URL
    const getFingerprintAndShortenUrl = async () => {
        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const visitorId = result.visitorId;
            setFingerprint(visitorId); // Set fingerprint in state

            const userAgent = navigator.userAgent;
            const language = navigator.language;
            const timestamp = new Date().toISOString();
           
            const { city, latitude, longitude } = await getCityByIp();

            const response = await fetch('http://localhost:5000/api/url/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    longUrl,
                    fingerprint: visitorId, // Pass the fingerprint/VisitorId
                    userDetails: {
                        VisitorId: visitorId,
                        userAgent,
                        language,
                        location: {
                            city,
                            latitude,
                            longitude
                        },
                        timestamp
                    },
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setShortenedUrl(data.shortUrl); // Set shortened URL
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error('Error shortening URL', err);
            setError('Error shortening URL');
        }
    };

    // When a user clicks on the shortened URL
    const handleShortUrlClick = () => {
        if (shortenedUrl) {
            const urlWithFingerprint = `${shortenedUrl}?fingerprint=${fingerprint}`; // Add fingerprint as a query param
            window.open(urlWithFingerprint, '_blank'); // Open the URL with fingerprint in a new tab
        }
    };

    return (
        <div>
            <h1>URL Shortener</h1>
            <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter long URL"
            />
            <button onClick={getFingerprintAndShortenUrl}>Shorten URL</button>
            {error && <p>{error}</p>}
            {shortenedUrl && (
                <div>
                    <p>
                        Shortened URL: 
                        <a 
                            href={shortenedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={handleShortUrlClick} // Call handleShortUrlClick when the link is clicked
                        >
                            {shortenedUrl}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShortenUrl;

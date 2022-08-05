import { useState, useEffect } from 'react';

function getWindowDimensions() {
    try {
        const { innerWidth: width, innerHeight: height } = window;
        return {width, height};
    }
    catch(ex) {
        return {width: 10000, height: 10000};
    }
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

    }, []);

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    return windowDimensions;
}
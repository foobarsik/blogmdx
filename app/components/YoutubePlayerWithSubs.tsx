"use client";
import {useEffect, useRef, useState} from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubePlayerWithSubs({videoId, subtitles}) {
    const playerRef = useRef<any>(null);
    const [currentSub, setCurrentSub] = useState<string>('');

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('yt-player', {
                height: '200',
                width: '380',
                videoId: videoId,
                events: {
                    onReady: () => {
                        setInterval(() => {
                            const time = playerRef.current?.getCurrentTime?.();
                            if (time) {
                                const sub = subtitles.find(
                                    s => time >= s.start && time <= s.end
                                );
                                if (sub?.text !== currentSub) setCurrentSub(sub?.text || '');
                            }
                        }, 300);
                    }
                }
            });
        };
    }, [videoId, subtitles]);

    return (
        <div style={{width: '380px'}}>
            <div id="yt-player"/>
            <div style={{marginTop: 16, fontSize: 18, background: '#f1f1f1', padding: 10}}>
                {currentSub || '...'}
            </div>
        </div>
    );
};

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY, // 'my-app-key'
    wsHost: import.meta.env.VITE_REVERB_HOST, // 'socket.localhost.com'
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80, // 80
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    
    // Para canais privados/presence (autenticação com Sanctum)
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
        headers: {
            'Accept': 'application/json',
        }
    },
    authorizer: (channel) => {
        return {
            authorize: (socketId, callback) => {
                fetch(`${import.meta.env.VITE_API_URL}/broadcasting/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include', // Envia cookies Sanctum
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    callback(null, data);
                })
                .catch(error => {
                    console.error('Broadcasting auth error:', error);
                    callback(error);
                });
            }
        };
    }
});

export default echo;
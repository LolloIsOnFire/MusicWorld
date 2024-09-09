document.addEventListener('DOMContentLoaded', () => {
    const players = document.querySelectorAll('.player');
    let currentlyPlaying = null;
    
    players.forEach(player => {
        const audio = new Audio();
        const playPauseBtn = player.querySelector('.play-pause');
        const progress = player.querySelector('.progress');
        const progressBar = player.querySelector('.progress-bar');
        const currentTimeEl = player.querySelector('.current-time');
        const totalTimeEl = player.querySelector('.total-time');
        const volumeSlider = player.querySelector('.volume-slider');
        const volumeIcon = player.querySelector('.volume-icon');
        
        const artistName = player.querySelector('.track-artist').textContent;
        const trackName = player.querySelector('.track-name').textContent;
        audio.src = `tracks/${trackName}.mp3`;
        
        // Imposta il volume di default al 50%
        audio.volume = 0.5;
        volumeSlider.value = 50;
        
        audio.addEventListener('error', (e) => {
            console.error('Errore durante il caricamento dell\'audio:', e);
            alert(`Errore nel caricamento della traccia: ${trackName}`);
        });

        function togglePlayPause() {
            if (currentlyPlaying && currentlyPlaying !== audio) {
                currentlyPlaying.pause();
                currentlyPlaying.currentTime = 0;
                currentlyPlaying.parentPlayer.querySelector('.play-pause').innerHTML = '<i class="fas fa-play"></i>';
            }

            if (audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        currentlyPlaying = audio;
                        currentlyPlaying.parentPlayer = player;
                    }).catch(error => {
                        console.error('Errore durante la riproduzione:', error);
                        alert('Impossibile riprodurre l\'audio. Assicurati che il file esista e che il formato sia supportato.');
                    });
                }
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                currentlyPlaying = null;
            }
        }

        playPauseBtn.addEventListener('click', togglePlayPause);
        
        progressBar.addEventListener('click', (e) => {
            const clickPosition = e.offsetX / progressBar.offsetWidth;
            audio.currentTime = clickPosition * audio.duration;
        });
        
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value / 100;
            updateVolumeIcon();
        });
        
        volumeIcon.addEventListener('click', () => {
            if (audio.volume > 0) {
                audio.volume = 0;
                volumeSlider.value = 0;
            } else {
                audio.volume = 0.5;
                volumeSlider.value = 50;
            }
            updateVolumeIcon();
        });
        
        function updateVolumeIcon() {
            if (audio.volume > 0.5) {
                volumeIcon.className = 'fas fa-volume-up volume-icon';
            } else if (audio.volume > 0) {
                volumeIcon.className = 'fas fa-volume-down volume-icon';
            } else {
                volumeIcon.className = 'fas fa-volume-mute volume-icon';
            }
        }
        
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
        
        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });
        
        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            progress.style.width = '0%';
            currentTimeEl.textContent = '0:00';
            currentlyPlaying = null;
        });

        audio.load();

        audio.addEventListener('canplaythrough', () => {
            console.log(`Audio caricato per la traccia: ${trackName}`);
        });

        // Aggiorna l'icona del volume all'inizializzazione
        updateVolumeIcon();
    });
});
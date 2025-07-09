// 歌曲数据 - 实际项目中可以从服务器获取或动态生成
const songs = [
    { title: "白鸽乌鸦相爱的戏码", src: "assets/audio/白鸽乌鸦相爱的戏码.mp3" },
    { title: "枕边是她", src: "assets/audio/枕边是她.mp3" },
    { title: "清空", src: "assets/audio/清空.mp3" },
    { title: "哼着你爱听的歌", src: "assets/audio/哼着你爱听的歌.mp3" },
    { title: "风铃响 故人归", src: "assets/audio/风铃响 故人归.mp3" },
    { title: "半生风雪", src: "assets/audio/半生风雪.mp3" },
    { title: "我走后", src: "assets/audio/我走后.mp3" },
    { title: "敬往事一杯", src: "assets/audio/敬往事一杯.mp3" },
    { title: "白茫茫的雪满天", src: "assets/audio/白茫茫的雪满天.mp3" },
    { title: "陪我过个冬", src: "assets/audio/陪我过个冬.mp3" }
];

// 分页设置
const songsPerPage = 5;
let currentPage = 1;
let totalPages = Math.ceil(songs.length / songsPerPage);

// 初始化播放器
const audioPlayer = document.createElement('audio');
document.body.appendChild(audioPlayer);

// 获取DOM元素
const songList = document.querySelector('.song-list');
const prevPageBtn = document.querySelector('.prev-page');
const nextPageBtn = document.querySelector('.next-page');
const currentPageSpan = document.getElementById('current-page');
const prevBtn = document.querySelector('.prev-btn');
const playPauseBtn = document.querySelector('.play-btn');
const nextBtn = document.querySelector('.next-btn');
const songTitleElement = document.getElementById('song-title');

// 当前播放状态
let currentSongIndex = 0;
let isPlaying = false;

// 渲染当前页的歌曲列表
function renderSongList() {
    songList.innerHTML = '';

    const startIndex = (currentPage - 1) * songsPerPage;
    const endIndex = Math.min(startIndex + songsPerPage, songs.length);

    for (let i = startIndex; i < endIndex; i++) {
        const song = songs[i];
        const songItem = document.createElement('li');
        songItem.className = 'song-item';
        songItem.setAttribute('data-index', i);
        songItem.innerHTML = `
            <span class="song-number">${i + 1}.</span>
            <span class="song-title">${song.title}</span>
        `;
        songItem.addEventListener('click', () => {
            currentSongIndex = i;
            updateSongInfo();
            playCurrentSong();
        });
        songList.appendChild(songItem);
    }

    // 更新分页信息
    currentPageSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // 高亮当前播放的歌曲（如果在当前页）
    const displayedIndex = currentSongIndex - (currentPage - 1) * songsPerPage;
    if (displayedIndex >= 0 && displayedIndex < songsPerPage) {
        const items = document.querySelectorAll('.song-item');
        items.forEach(item => item.classList.remove('active'));
        items[displayedIndex]?.classList.add('active');
    }
}

// 更新歌曲信息
function updateSongInfo() {
    const song = songs[currentSongIndex];
    songTitleElement.textContent = song.title;
    audioPlayer.src = song.src;

    // 如果当前歌曲不在当前页，跳转到对应的页
    const songPage = Math.floor(currentSongIndex / songsPerPage) + 1;
    if (songPage !== currentPage) {
        currentPage = songPage;
        renderSongList();
    }
}

// 播放当前歌曲
function playCurrentSong() {
    audioPlayer.play()
        .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = '暂停';
        // 更新高亮
        renderSongList();
    })
        .catch(error => {
        console.log('播放失败:', error);
        isPlaying = false;
        playPauseBtn.textContent = '播放';
    });
}

// 事件监听器
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderSongList();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderSongList();
    }
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongInfo();
    playCurrentSong(); // 修改这里 - 总是播放
});

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        playCurrentSong();
    } else {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = '播放';
    }
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    playCurrentSong(); // 修改这里 - 总是播放
});

// 音频结束事件
audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    if (isPlaying) playCurrentSong(); // 保持原有逻辑，只有播放状态下才自动下一首
});

// 初始化
renderSongList();
updateSongInfo();
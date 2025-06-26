document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    var videoPlayer = document.getElementById('video-player');
    var videoList = document.getElementById('video-list');
    var currentVideoTitle = document.getElementById('current-video-title');
    var bookmarkBtn = document.getElementById('bookmark-btn');
    var statusSelect = document.getElementById('status-select');
    var notesInput = document.getElementById('notes-input');
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');

    // App State
    var videoData = (typeof videos !== 'undefined') ? videos : [];
    var currentVideoIndex = -1;
    var progress = {};

    // Functions
    function loadProgress() {
        try {
            var savedProgress = localStorage.getItem('videoProgress');
            return savedProgress ? JSON.parse(savedProgress) : {};
        } catch (e) {
            console.error("Failed to load progress:", e);
            return {};
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem('videoProgress', JSON.stringify(progress));
        } catch (e) {
            console.error("Failed to save progress:", e);
        }
    }

    function renderPlaylist() {
        if (!videoData.length) {
            videoList.innerHTML = '<p>No videos found. Please run the scanner.py script.</p>';
            return;
        }

        var groupedVideos = {};
        for (var i = 0; i < videoData.length; i++) {
            var video = videoData[i];
            if (!groupedVideos[video.course]) {
                groupedVideos[video.course] = [];
            }
            groupedVideos[video.course].push({ video: video, originalIndex: i });
        }

        var html = '';
        for (var courseName in groupedVideos) {
            if (groupedVideos.hasOwnProperty(courseName)) {
                html += '<h3 class="course-title">' + courseName + '</h3>';
                html += '<div class="video-items">';
                var videosInGroup = groupedVideos[courseName];
                for (var j = 0; j < videosInGroup.length; j++) {
                    var videoItemData = videosInGroup[j];
                    var videoProgress = progress[videoItemData.video.path] || {};
                    var status = videoProgress.status || 'To Watch';
                    var activeClass = videoItemData.originalIndex === currentVideoIndex ? 'active' : '';
                    
                    html += '<div class="video-item ' + activeClass + '" data-index="' + videoItemData.originalIndex + '">' +
                                '<span>' + videoItemData.video.title + '</span>' +
                                '<span class="status ' + status.replace(' ', '-') + '">' + status + '</span>' +
                            '</div>';
                }
                html += '</div>';
            }
        }
        videoList.innerHTML = html;
        addPlaylistEventListeners();
    }

    function addPlaylistEventListeners() {
        var items = document.querySelectorAll('.video-item');
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function() {
                var index = parseInt(this.getAttribute('data-index'), 10);
                playVideo(index);
            });
        }

        var titles = document.querySelectorAll('.course-title');
        for (var j = 0; j < titles.length; j++) {
            titles[j].addEventListener('click', function() {
                var videoItems = this.nextElementSibling;
                if (videoItems.style.display === 'block') {
                    videoItems.style.display = 'none';
                } else {
                    videoItems.style.display = 'block';
                }
            });
        }
    }

    function playVideo(index) {
        if (index < 0 || index >= videoData.length) {
            return;
        }
        currentVideoIndex = index;
        var video = videoData[index];
        var videoProgress = progress[video.path] || {};

        videoPlayer.src = video.path;
        currentVideoTitle.textContent = video.title;
        statusSelect.value = videoProgress.status || 'To Watch';
        notesInput.value = videoProgress.notes || '';
        
        videoPlayer.currentTime = videoProgress.timestamp || 0;
        videoPlayer.play();
        
        renderPlaylist(); // Re-render to highlight active item
    }

    function updateCurrentVideoProgress() {
        if (currentVideoIndex === -1) {
            return;
        }
        var video = videoData[currentVideoIndex];
        var path = video.path;
        if (!progress[path]) {
            progress[path] = {};
        }
        progress[path].status = statusSelect.value;
        progress[path].notes = notesInput.value;
        progress[path].timestamp = videoPlayer.currentTime;
        
        saveProgress();
        renderPlaylist(); // To update status color
    }

    // Event Listeners
    bookmarkBtn.addEventListener('click', function() {
        if (currentVideoIndex !== -1) {
            updateCurrentVideoProgress();
            alert('Bookmark saved!');
        }
    });
    
    prevBtn.addEventListener('click', function() {
        playVideo(currentVideoIndex - 1);
    });

    nextBtn.addEventListener('click', function() {
        playVideo(currentVideoIndex + 1);
    });

    videoPlayer.addEventListener('ended', function() {
        if (currentVideoIndex !== -1) {
            var video = videoData[currentVideoIndex];
            if (!progress[video.path]) {
                progress[video.path] = {};
            }
            progress[video.path].status = 'Completed';
            saveProgress();
        }
        playVideo(currentVideoIndex + 1);
    });

    statusSelect.addEventListener('change', updateCurrentVideoProgress);
    notesInput.addEventListener('blur', updateCurrentVideoProgress);

    // Initial Load
    progress = loadProgress();
    renderPlaylist();
});

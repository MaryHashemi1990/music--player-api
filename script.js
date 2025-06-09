document.addEventListener("DOMContentLoaded", () => {
  let heart = document.getElementById("favorite");
  let musicName = document.getElementById("musicName");
  let actor = document.getElementById("actor");
  const list = document.getElementById("musicList");
  let audio = document.getElementById("main-audio");
  const repeatBtn = document.getElementById("repeat");
  const backwardBtn = document.getElementById("backward");
  const playBtn = document.getElementById("play");
  const forwardBtn = document.getElementById("forward");
  const downloadBtn = document.getElementById("download");
  let seekSlider = document.getElementById("seekSlider");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");
  const search = document.getElementById("search");
  const playListBtn = document.getElementById("playListBtn");
  const favoriteBtn = document.getElementById("favoriteBtn");
  const playListShow = document.getElementById("playListShow");
  const favoriteShow = document.getElementById("favoriteShow");
  const favoriteList = document.getElementById("favoriteList");

  let index = 0;
  let musicData = [];
  let repeatMode = false;
  let favoriteSongs = [];

  
  //تابع تبدیل زمان به فرمت mm:ss
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }

  //تابع لود کردن زمان آهنگ به span مرتبط با آن در html
  audio.addEventListener("loadedmetadata", () => {
    seekSlider.max = Math.floor(audio.duration);
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  //تابع آپدیت کردن زمان آهنگ
  audio.addEventListener("timeupdate", () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  //تابع آپدیت کردن زمان آهنگ هنگامی که کاربر دستی وردی را تغییر میدهد.
  seekSlider.addEventListener("input", () => {
    audio.currentTime = seekSlider.value;
  });

  //تابع رفتن به آهنگ بعدی هنگامی که آهنگ به انتهای خود میرسد.
  audio.addEventListener("ended", () => {
    if (musicData.length === 0) return;

    if (repeatMode) {
      audio.currentTime = 0;
      audio.play();
    } else {
      index = (index + 1) % musicData.length;
      audio.src = musicData[index].url;
      musicName.textContent = musicData[index].title;
      actor.textContent = musicData[index].artist;
      audio.play();
    }
  });

  //فتچ کردن آهنگ ها
  fetch("https://683d969a199a0039e9e61378.mockapi.io/songs")
    .then((res) => {
      if (!res.ok) throw new Error("خطا در دریافت آهنگ");
      return res.json();
    })
    .then((data) => {
      musicData = data;

      if (musicData.length > 0) {
        audio.src = musicData[0].url;
      }

      data.forEach((track, idx) => {
        const item = document.createElement("li");
        item.className =
          "p-3 rounded flex justify-between items-center cursor-pointer";
        item.innerHTML = `
                <div class = "flex flex-col py-1 items-start justify-center">
                     <p>${track.title}</p>
                     <p>${track.artist}</p>
                </div>
                <div class = " flex justify-center items-center">
                     <p>${track.duration}</p>  
                     
                </div>
                <audio id = ""  src="${track.url}" class="w-[150px]"></audio>
                `;

        item.addEventListener("click", () => {
          index = idx; // آپدیت ایندکس آهنگ جاری
          audio.src = track.url;
          musicName.textContent = track.title;
          actor.textContent = track.artist;
          audio.play();
          playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`; // آیکون پاز
        });
        list.appendChild(item);
      });
    })
    .catch((err) => console.error("خطا در پخش:", err));

  //کارهایی که هنگام کلیک بر روی دکمه play باید انجام شود
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      musicName.textContent = musicData[index].title;
      actor.textContent = musicData[index].artist;
      audio.play();
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
      audio.pause();
      playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
    updateHeartColor();
  });

  //کارهایی که هنگام کلیک بر روی دکمه forward باید انجام شود
  forwardBtn.addEventListener("click", () => {
    if (musicData.length === 0) return;

    index = (index + 1) % musicData.length;
    audio.src = musicData[index].url;
    musicName.textContent = musicData[index].title;
    actor.textContent = musicData[index].artist;
    audio.play();
    updateHeartColor();
  });

  //کارهایی که هنگام کلیک بر روی دکمه backward باید انجام شود
  backwardBtn.addEventListener("click", () => {
    if (musicData.length === 0) return;

    index = (index - 1) % musicData.length;
    audio.src = musicData[index].url;
    musicName.textContent = musicData[index].title;
    actor.textContent = musicData[index].artist;
    audio.play();
    updateHeartColor();
  });

  //کارهایی که هنگام کلیک بر روی دکمه repeat باید انجام شود
  repeatBtn.addEventListener("click", () => {
    repeatMode = !repeatMode;
    repeatBtn.style.color = repeatMode ? "red" : "white";
  });

  //کارهایی که هنگام کلیک بر روی دکمه download باید انجام شود
  downloadBtn.addEventListener("click", () => {
    if (!musicData.length) return;

    const currentTrack = musicData[index];
    const link = document.createElement("a");
    link.href = currentTrack.url;
    link.download = `${currentTrack.title}.mp3`; // یا هر فرمتی که هست
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  search.addEventListener('input' , ()=>{
    const query = search.value.toLowerCase();

    list.innerHTML = "";

    musicData
    .filter(track =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    )
    .forEach((track, idx) => {
      const item = document.createElement("li");
      item.className =
        "p-3 rounded flex justify-between items-center cursor-pointer";
      item.innerHTML = `
          <div class="flex flex-col py-1 items-start justify-center">
            <p>${track.title}</p>
            <p>${track.artist}</p>
          </div>
          <div class="flex justify-center items-center">
            <p>${track.duration}</p>  
          </div>
          <audio src="${track.url}" class="w-[150px]"></audio>
      `;

      item.addEventListener("click", () => {
        index = musicData.findIndex(
          song => song.title === track.title && song.artist === track.artist
        );
        audio.src = track.url;
        musicName.textContent = track.title;
        actor.textContent = track.artist;
        audio.play();
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        updateHeartColor();
      });

      list.appendChild(item);
    });
  })

  playListBtn.addEventListener("click", () => {
    playListBtn.style.backgroundColor = "#9F0712";
    playListBtn.style.fontWeight = "600";
    favoriteBtn.style.backgroundColor = "#26282c";
    favoriteBtn.style.fontWeight = "400";
    playListShow.classList.remove("hidden");
    favoriteShow.classList.add("hidden");
  });

  favoriteBtn.addEventListener("click", () => {
    favoriteBtn.style.backgroundColor = "#9F0712";
    favoriteBtn.style.fontWeight = "600";
    playListBtn.style.backgroundColor = "#26282c";
    playListBtn.style.fontWeight = "400";
    favoriteShow.classList.remove("hidden");
    playListShow.classList.add("hidden");
  });

  heart.addEventListener("click", () => {
    const currentTrack = musicData[index];
  
    const favoriteIndex = favoriteSongs.findIndex(song =>
      song.title === currentTrack.title && song.artist === currentTrack.artist
    );
  
    if (favoriteIndex !== -1) {
      // حذف از لیست علاقه‌مندی
      favoriteSongs.splice(favoriteIndex, 1);
  
      // حذف از DOM
      const items = favoriteList.querySelectorAll("li");
      items.forEach(item => {
        if (
          item.querySelector("p").textContent === currentTrack.title &&
          item.querySelectorAll("p")[1].textContent === currentTrack.artist
        ) {
          favoriteList.removeChild(item);
        }
      });
    } else {
      // اضافه به لیست علاقه‌مندی
      favoriteSongs.push(currentTrack);
  
      const item = document.createElement("li");
      item.className =
        "p-3 rounded flex justify-between items-center cursor-pointer";
      item.innerHTML = `
        <div class="flex flex-col py-1 items-start justify-center">
          <p>${currentTrack.title}</p>
          <p>${currentTrack.artist}</p>
        </div>
        <div class="flex justify-center items-center">
          <p>${currentTrack.duration}</p>  
        </div>
        <audio src="${currentTrack.url}" class="w-[150px]"></audio>
      `;
  
      item.addEventListener("click", () => {
        index = musicData.findIndex(song =>
          song.title === currentTrack.title && song.artist === currentTrack.artist
        );
        audio.src = currentTrack.url;
        musicName.textContent = currentTrack.title;
        actor.textContent = currentTrack.artist;
        audio.play();
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        updateHeartColor();
      });
  
      favoriteList.appendChild(item);
    }
  
    updateHeartColor();
  });
  

  function updateHeartColor() {
    const currentTrack = musicData[index];
    const isFavorite = favoriteSongs.some(song =>
      song.title === currentTrack.title && song.artist === currentTrack.artist
    );
    heart.style.color = isFavorite ? "red" : "white";
  }
  
});

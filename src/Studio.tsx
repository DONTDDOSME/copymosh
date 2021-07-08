import React, { useState } from 'react';
import Modal from './Modal';

type Video = {
  file: File;
  url: string;
  previewing: boolean;
}

export default () => {
  const [videos, setVideos] = useState<Video[]>([]);

  const addVideo = (evt) => {
    const file = evt.target.files[0] as File;
    const url = URL.createObjectURL(file);
    setVideos([...videos, { file, url, previewing: false }]);
    evt.target.value = '';
  };

  const removeVideo = (i: number) => {
    videos.splice(i, 1);
    setVideos([...videos]);
  };

  const previewVideo = (i: number, previewing: boolean) => {
    videos[i].previewing = previewing;
    setVideos([...videos]);
  };

  return (
    <div className="Studio">
      <div className="files">
        {videos.length === 0 ? (
          <p>No video uploaded yet</p>
        ) : (
          videos.map((video, i) => (
            <div key={video.url} className="media">
              <video
                className="thumb"
                src={video.url}
                muted
                loop
                autoPlay
                title={`preview ${video.file.name}`}
                onClick={() => { previewVideo(i, true); }}
              />
              <span
                className="name"
                title={video.file.name}
              >
                {video.file.name}
              </span>
              <button
                type="button"
                title="delete"
                onClick={() => { removeVideo(i); }}
              >
                <img src="/icons/delete.svg" alt="delete video" />
              </button>
              {video.previewing && (
                <Modal onClose={() => { previewVideo(i, false); }}>
                  <video className="preview" src={video.url} autoPlay controls loop />
                </Modal>
              )}
            </div>
          ))
        )}
        <div>
          Add video:&nbsp;
          <input type="file" accept="video/*" onInput={addVideo} />
        </div>
      </div>
      <div className="" />
      <div className="" />
      <div className="" />
    </div>
  );
};

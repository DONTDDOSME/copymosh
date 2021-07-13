import React, { Dispatch, SetStateAction } from 'react';
import { Video } from './types';
import Modal from './Modal';
import { Segment } from './lib';
import savedFileToVideo from './savedFileToVideo';
import { stores } from './db';

export default ({
  videos,
  setVideos,
  segments,
  setSegments,
}: {
  videos: Video[];
  setVideos: Dispatch<SetStateAction<Video[]>>;
  segments: Segment[];
  setSegments: Dispatch<SetStateAction<Segment[]>>;
}) => {
  const addVideo = async (evt) => {
    const file = evt.target.files[0] as File;
    const key = await stores.files.add(file);
    const video = await savedFileToVideo({ key, file });
    setVideos([...videos, video]);
    evt.target.value = '';
  };

  const removeVideo = async (i: number) => {
    await stores.files.delete(videos[i].key);

    const newSegments = segments.filter((segment) => segment.src === videos[i].src);
    if (newSegments.length < segments.length) {
      setSegments(newSegments);
    }

    URL.revokeObjectURL(videos[i].src);

    videos.splice(i, 1);
    setVideos([...videos]);
  };

  const previewVideo = (i: number, previewing: boolean) => {
    videos[i].previewing = previewing;
    setVideos([...videos]);
  };

  return (
    <div className="Videos">
      {videos.length === 0 ? (
        <p>No video uploaded yet</p>
      ) : (
        videos.map((video, i) => (
          <div key={video.key} className="media">
            <video
              className="thumb"
              src={video.src}
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
              {`${video.width}x${video.height} ${video.file.name}`}
            </span>
            <button
              className="u-icon-button"
              type="button"
              title="delete"
              onClick={() => { removeVideo(i); }}
            >
              <img src="/icons/delete.svg" alt="delete video" />
            </button>
            {video.previewing && (
            <Modal onClose={() => { previewVideo(i, false); }}>
              <video className="preview" src={video.src} autoPlay controls loop />
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
  );
};

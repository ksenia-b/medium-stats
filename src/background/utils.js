import { STORIES_VISIBILITY} from './constants.js';

export const countStoriesByVisibility = (stories) => {
  return stories.reduce((acc, story) => {
    if (story.visibility === STORIES_VISIBILITY.PUBLIC) {
      acc.public += 1;
    } else if (story.visibility === STORIES_VISIBILITY.LOCKED) {
      acc.locked += 1;
    } else if (story.visibility === STORIES_VISIBILITY.UNLISTED) {
      acc.unlisted += 1;
    }

    return acc;
  }, { public: 0, locked: 0, unlisted: 0 });
}

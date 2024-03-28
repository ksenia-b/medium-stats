import { Totals } from './Totals.jsx';

const totals = {
  "reads": 2295,
  "views": 4510,
  "claps": 39,
  "responses": 1,
  "income": 0,
  "stories": 7
}

const totalsDetails = {
  "stories": {
    "public": 6,
    "locked": 0,
    "unlisted": 1
  }
}
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Extension/Totals',
  component: Totals,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout

  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    data: totals,
    details: totalsDetails
  },
};
